import { describe, expect, it } from "vitest";

import { hasAudibleCapture, mergeCaptureChunks, peakLevelForSamples } from "@/soft-whisper/audio/captureMath";

describe("captureMath", () => {
  it("merges recorded chunks without changing sample order", () => {
    const merged = mergeCaptureChunks([
      new Float32Array([0.1, -0.2]),
      new Float32Array([0.3]),
      new Float32Array([-0.4, 0.5]),
    ]);

    Array.from(merged).forEach((sample, index) => {
      expect(sample).toBeCloseTo([0.1, -0.2, 0.3, -0.4, 0.5][index]);
    });
  });

  it("detects whether a capture is substantial enough to play back", () => {
    const tooQuiet = new Float32Array(5000).fill(0.0002);
    const audible = new Float32Array(5000).fill(0.0025);

    expect(peakLevelForSamples(audible)).toBeCloseTo(0.0025);
    expect(hasAudibleCapture(tooQuiet)).toBe(false);
    expect(hasAudibleCapture(audible)).toBe(true);
    expect(hasAudibleCapture(new Float32Array(1024).fill(0.9))).toBe(false);
  });
});
