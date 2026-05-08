import { describe, expect, it } from "vitest";

import { derivePassThreshold, detectBleedRisk, detectHeldAffirmation } from "@/soft-whisper/audio/micMath";
import { DEFAULT_GATE_CONFIG } from "@/soft-whisper/audio/runtime";

describe("micMath", () => {
  it("derives a pass threshold above the ambient noise floor", () => {
    const threshold = derivePassThreshold(0.012, DEFAULT_GATE_CONFIG);
    expect(threshold).toBeGreaterThanOrEqual(DEFAULT_GATE_CONFIG.minThreshold);
    expect(threshold).toBeLessThanOrEqual(0.18);
  });

  it("flags strong speaker bleed as high risk", () => {
    expect(detectBleedRisk({ baseline: 0.01, after: 0.08, threshold: 0.07 })).toBe("high");
    expect(detectBleedRisk({ baseline: 0.01, after: 0.03, threshold: 0.07 })).toBe("low");
  });

  it("requires a held loud response instead of one spike", () => {
    expect(
      detectHeldAffirmation({
        samples: [0.02, 0.03, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09],
        threshold: 0.08,
        holdMs: 350,
        stepMs: 70,
      }),
    ).toBe(true);

    expect(
      detectHeldAffirmation({
        samples: [0.02, 0.03, 0.09, 0.02, 0.09, 0.02, 0.09],
        threshold: 0.08,
        holdMs: 350,
        stepMs: 70,
      }),
    ).toBe(false);
  });
});
