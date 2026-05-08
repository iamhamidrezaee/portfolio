export type ExperienceMode = "crowd" | "aloneLocked";

export type CueId =
  | "idle"
  | "modeChoice"
  | "aloneLocked"
  | "crowdBoot"
  | "readyPrompt1"
  | "readyPrompt2"
  | "handlePhaseA"
  | "listeningPrompt1"
  | "listeningPrompt2"
  | "handlePhaseB"
  | "carefulPrompt"
  | "interiorReveal"
  | "ballerinaSilence"
  | "voiceBlast"
  | "messageHold"
  | "closeReset";

export interface CueDefinition {
  id: CueId;
  kicker: string;
  title: string;
  body: string;
  instruction?: string;
  speech: string;
  retrySpeech?: string;
  minPromptMs: number;
  gateKind: "affirmation" | "none";
}

export interface MicGateConfig {
  sampleWindowMs: number;
  holdMs: number;
  maxWaitMs: number;
  minThreshold: number;
  multiplier: number;
  ambientOffset: number;
}

export interface MicCalibrationResult {
  noiseFloor: number;
  passThreshold: number;
  supportedConstraints: {
    echoCancellation: boolean;
    noiseSuppression: boolean;
    autoGainControl: boolean;
  };
  trackSettings: {
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
    autoGainControl?: boolean;
    deviceId?: string;
  };
  bleedRisk: "low" | "high";
}

export interface HandleState {
  pressCount: number;
  cyclePressCount: number;
  cycleIndex: number;
  lidAngleDeg: number;
  currentNoteIndex: number;
  crankAngleDeg: number;
  queuedNoteIndex: number | null;
  acceptingInput: boolean;
}

export interface SessionCapture {
  status: "idle" | "recording" | "stopped" | "decoded";
  chunkCount: number;
  durationMs: number;
}

export interface ProcessedPlayback {
  peakLevel: number;
  durationMs: number;
  layerCount: number;
  source: "recorded";
}

export interface VisualTargets {
  cameraPosition: [number, number, number];
  lookAt: [number, number, number];
  spotlightIntensity: number;
  haze: number;
  interiorVisibility: number;
  ballerinaOpacity: number;
  lidAngleDeg: number;
  boxGlow: number;
}

export interface ExperienceContext {
  mode: ExperienceMode | null;
  handle: HandleState;
  calibration: MicCalibrationResult | null;
  capture: SessionCapture;
  playback: ProcessedPlayback | null;
  playbackReady: boolean;
  silenceElapsed: boolean;
  bootError: string | null;
  voiceName: string | null;
  debugVisible: boolean;
  climaxMuted: boolean;
  timingScale: number;
  qaEnabled: boolean;
}

export interface ExperienceMachineInput {
  timingScale: number;
  qaEnabled: boolean;
}

export type ExperienceEvent =
  | { type: "SELECT_MODE"; mode: "crowd" | "aloneLocked" }
  | { type: "BOOT_READY"; calibration: MicCalibrationResult; voiceName: string | null }
  | { type: "BOOT_FAILED"; message: string }
  | { type: "PROMPT_ACK" }
  | { type: "HANDLE_PRESS" }
  | { type: "NOTE_PLAYED"; noteIndex: number }
  | { type: "PLAYBACK_READY"; playback: ProcessedPlayback }
  | { type: "SILENCE_COMPLETE" }
  | { type: "BLAST_FINISHED" }
  | { type: "RETRY_BOOT" }
  | { type: "RESET" }
  | { type: "TOGGLE_DEBUG" }
  | { type: "TOGGLE_MUTE_CLIMAX" }
  | { type: "SET_TIMING_SCALE"; scale: number };
