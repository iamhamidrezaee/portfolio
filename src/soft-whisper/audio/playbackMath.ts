import type { ProcessedPlayback } from "@/soft-whisper/experience/types";

export const CLIMAX_LAYER_SETTINGS = [
  { offset: 0, gain: 2.8, rate: 1.0 },
  { offset: 0.05, gain: 2.45, rate: 1.018 },
  { offset: 0.11, gain: 2.25, rate: 0.986 },
  { offset: 0.18, gain: 2.05, rate: 1.045 },
  { offset: 0.28, gain: 1.9, rate: 0.962 },
  { offset: 0.39, gain: 1.65, rate: 1.072 },
  { offset: 0.52, gain: 1.42, rate: 0.934 },
  { offset: 0.68, gain: 1.22, rate: 1.108 },
  { offset: 0.86, gain: 1.05, rate: 0.902 },
  { offset: 1.05, gain: 0.92, rate: 1.135 },
] as const;

export function createPlaybackMetadata(durationMs: number, peakLevel: number): ProcessedPlayback {
  return {
    peakLevel,
    durationMs,
    layerCount: CLIMAX_LAYER_SETTINGS.length,
    source: "recorded",
  };
}
