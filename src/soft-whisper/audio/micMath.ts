import type { MicGateConfig } from "@/soft-whisper/experience/types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function derivePassThreshold(noiseFloor: number, config: MicGateConfig): number {
  return clamp(
    Math.max(config.minThreshold, noiseFloor * config.multiplier + config.ambientOffset),
    config.minThreshold,
    0.18,
  );
}

export function detectBleedRisk(args: {
  baseline: number;
  after: number;
  threshold: number;
}): "low" | "high" {
  return args.after > args.threshold * 0.9 && args.after > args.baseline * 2.2 ? "high" : "low";
}

export function detectHeldAffirmation(args: {
  samples: number[];
  threshold: number;
  holdMs: number;
  stepMs: number;
}): boolean {
  let heldMs = 0;

  for (const sample of args.samples) {
    if (sample >= args.threshold) {
      heldMs += args.stepMs;
    } else {
      heldMs = Math.max(0, heldMs - args.stepMs * 0.6);
    }

    if (heldMs >= args.holdMs) {
      return true;
    }
  }

  return false;
}
