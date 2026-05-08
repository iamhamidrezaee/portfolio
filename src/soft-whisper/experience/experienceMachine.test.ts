import { createActor } from "xstate";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SWAN_LAKE_SEQUENCE } from "@/soft-whisper/experience/cues";
import { experienceMachine } from "@/soft-whisper/experience/experienceMachine";
import type { MicCalibrationResult } from "@/soft-whisper/experience/types";

const expectedSequence = [
  "F#5", "B4", "C#5", "D5",
  "E5", "F#5", "D5", "F#5",
  "D5", "F#5", "B4", "D5",
  "B4", "G4", "D5", "B4",
  "E5", "D5", "C#5", "F#5",
  "B4", "C#5", "D5", "E5",
  "F#5", "D5", "F#5", "D5",
  "F#5", "B4", "D5", "B4",
  "G4", "D5", "B4",
] as const;

const calibration: MicCalibrationResult = {
  noiseFloor: 0.01,
  passThreshold: 0.07,
  supportedConstraints: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  trackSettings: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: false,
    deviceId: "qa-device",
  },
  bleedRisk: "low",
};

const halfwayIndex = 15;
const nearEndIndex = SWAN_LAKE_SEQUENCE.length - 3;
const finalIndex = SWAN_LAKE_SEQUENCE.length - 1;

describe("experienceMachine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("keeps the requested Swan Lake melody order", () => {
    expect(SWAN_LAKE_SEQUENCE).toEqual(expectedSequence);
  });

  it("boots into the mode choice after the idle delay", () => {
    const actor = createActor(experienceMachine, {
      input: { timingScale: 0.1, qaEnabled: true },
    }).start();

    expect(actor.getSnapshot().value).toBe("idle");
    vi.advanceTimersByTime(60);
    expect(actor.getSnapshot().value).toBe("modeChoice");
  });

  it("routes the crowd path through prompt checkpoints and the final reveal", () => {
    const actor = createActor(experienceMachine, {
      input: { timingScale: 0.1, qaEnabled: true },
    }).start();

    vi.advanceTimersByTime(60);
    actor.send({ type: "SELECT_MODE", mode: "crowd" });
    expect(actor.getSnapshot().value).toBe("crowdBoot");

    actor.send({ type: "BOOT_READY", calibration, voiceName: "QA" });
    expect(actor.getSnapshot().value).toBe("readyPrompt1");

    actor.send({ type: "PROMPT_ACK" });
    actor.send({ type: "PROMPT_ACK" });
    expect(actor.getSnapshot().value).toBe("handlePhaseA");

    actor.send({ type: "NOTE_PLAYED", noteIndex: halfwayIndex });
    expect(actor.getSnapshot().value).toBe("listeningPrompt1");

    actor.send({ type: "PROMPT_ACK" });
    actor.send({ type: "PROMPT_ACK" });
    expect(actor.getSnapshot().value).toBe("handlePhaseB");

    actor.send({ type: "NOTE_PLAYED", noteIndex: nearEndIndex });
    expect(actor.getSnapshot().value).toBe("carefulPrompt");

    actor.send({ type: "PROMPT_ACK" });
    actor.send({ type: "NOTE_PLAYED", noteIndex: finalIndex });
    expect(actor.getSnapshot().value).toBe("interiorReveal");

    actor.send({
      type: "PLAYBACK_READY",
      playback: {
        peakLevel: 0.84,
        durationMs: 1800,
        layerCount: 10,
        source: "recorded",
      },
    });

    vi.advanceTimersByTime(320);
    expect(actor.getSnapshot().value).toBe("ballerinaSilence");

    actor.send({ type: "SILENCE_COMPLETE" });
    expect(actor.getSnapshot().value).toBe("voiceBlast");

    actor.send({ type: "BLAST_FINISHED" });
    expect(actor.getSnapshot().value).toBe("messageHold");
  });

  it("transitions to voiceBlast when PLAYBACK_READY arrives late during ballerinaSilence", () => {
    const actor = createActor(experienceMachine, {
      input: { timingScale: 0.1, qaEnabled: true },
    }).start();

    vi.advanceTimersByTime(60);
    actor.send({ type: "SELECT_MODE", mode: "crowd" });
    actor.send({ type: "BOOT_READY", calibration, voiceName: "QA" });
    actor.send({ type: "PROMPT_ACK" });
    actor.send({ type: "PROMPT_ACK" });
    actor.send({ type: "NOTE_PLAYED", noteIndex: halfwayIndex });
    actor.send({ type: "PROMPT_ACK" });
    actor.send({ type: "PROMPT_ACK" });
    actor.send({ type: "NOTE_PLAYED", noteIndex: nearEndIndex });
    actor.send({ type: "PROMPT_ACK" });
    actor.send({ type: "NOTE_PLAYED", noteIndex: finalIndex });
    expect(actor.getSnapshot().value).toBe("interiorReveal");

    // Do NOT send PLAYBACK_READY yet — simulate slow audio rendering
    vi.advanceTimersByTime(320);
    expect(actor.getSnapshot().value).toBe("ballerinaSilence");
    expect(actor.getSnapshot().context.playbackReady).toBe(false);

    // Silence timer fires first — no playback yet, so just marks elapsed
    actor.send({ type: "SILENCE_COMPLETE" });
    expect(actor.getSnapshot().value).toBe("ballerinaSilence");
    expect(actor.getSnapshot().context.silenceElapsed).toBe(true);

    // PLAYBACK_READY arrives late — should transition to voiceBlast immediately
    actor.send({
      type: "PLAYBACK_READY",
      playback: {
        peakLevel: 0.84,
        durationMs: 1800,
        layerCount: 10,
        source: "recorded",
      },
    });
    expect(actor.getSnapshot().value).toBe("voiceBlast");
  });

  it("transitions to voiceBlast when SILENCE_COMPLETE arrives after late PLAYBACK_READY", () => {
    const actor = createActor(experienceMachine, {
      input: { timingScale: 0.1, qaEnabled: true },
    }).start();

    vi.advanceTimersByTime(60);
    actor.send({ type: "SELECT_MODE", mode: "crowd" });
    actor.send({ type: "BOOT_READY", calibration, voiceName: "QA" });
    actor.send({ type: "PROMPT_ACK" });
    actor.send({ type: "PROMPT_ACK" });
    actor.send({ type: "NOTE_PLAYED", noteIndex: halfwayIndex });
    actor.send({ type: "PROMPT_ACK" });
    actor.send({ type: "PROMPT_ACK" });
    actor.send({ type: "NOTE_PLAYED", noteIndex: nearEndIndex });
    actor.send({ type: "PROMPT_ACK" });
    actor.send({ type: "NOTE_PLAYED", noteIndex: finalIndex });

    // Transition to ballerinaSilence without PLAYBACK_READY
    vi.advanceTimersByTime(320);
    expect(actor.getSnapshot().value).toBe("ballerinaSilence");

    // PLAYBACK_READY arrives in ballerinaSilence but silence hasn't elapsed
    actor.send({
      type: "PLAYBACK_READY",
      playback: {
        peakLevel: 0.84,
        durationMs: 1800,
        layerCount: 10,
        source: "recorded",
      },
    });
    expect(actor.getSnapshot().value).toBe("ballerinaSilence");
    expect(actor.getSnapshot().context.playbackReady).toBe(true);

    // Now silence completes — should transition to voiceBlast
    actor.send({ type: "SILENCE_COMPLETE" });
    expect(actor.getSnapshot().value).toBe("voiceBlast");
  });

  it("resets back to idle after close reset", () => {
    const actor = createActor(experienceMachine, {
      input: { timingScale: 0.1, qaEnabled: true },
    }).start();

    vi.advanceTimersByTime(60);
    actor.send({ type: "RESET" });
    expect(actor.getSnapshot().value).toBe("closeReset");

    vi.advanceTimersByTime(430);
    expect(actor.getSnapshot().value).toBe("idle");
  });
});
