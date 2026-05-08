import { describe, expect, it } from "vitest";

import { CLIMAX_LAYER_SETTINGS, createPlaybackMetadata } from "@/soft-whisper/audio/playbackMath";

describe("playbackMath", () => {
  it("keeps the climax layered and sourced from the captured recording", () => {
    expect(CLIMAX_LAYER_SETTINGS.length).toBeGreaterThanOrEqual(8);

    const metadata = createPlaybackMetadata(1600, 0.88);
    expect(metadata.durationMs).toBe(1600);
    expect(metadata.layerCount).toBe(CLIMAX_LAYER_SETTINGS.length);
    expect(metadata.source).toBe("recorded");
  });
});
