import { cues } from "@/soft-whisper/experience/cues";
import type { CueDefinition, CueId, HandleState, VisualTargets } from "@/soft-whisper/experience/types";

export function cueForState(stateValue: string): CueDefinition {
  return cues[(stateValue as CueId) ?? "modeChoice"] ?? cues.modeChoice;
}

export function stateAllowsHandle(stateValue: string): boolean {
  return stateValue === "handlePhaseA" || stateValue === "handlePhaseB";
}

export function stateUsesGate(stateValue: string): boolean {
  return (
    stateValue === "readyPrompt1" ||
    stateValue === "readyPrompt2" ||
    stateValue === "listeningPrompt1" ||
    stateValue === "listeningPrompt2"
  );
}

export function statusLabel(stateValue: string): string {
  switch (stateValue) {
    case "modeChoice":
      return "Awaiting choice";
    case "crowdBoot":
      return "Calibrating";
    case "readyPrompt1":
    case "readyPrompt2":
    case "listeningPrompt1":
    case "listeningPrompt2":
      return "Listening";
    case "handlePhaseA":
    case "handlePhaseB":
      return "Playing";
    case "ballerinaSilence":
      return "Silence";
    case "voiceBlast":
      return "Playback";
    case "messageHold":
      return "Message";
    default:
      return "";
  }
}

export function selectVisualTargets(stateValue: string, handle: HandleState): VisualTargets {
  const lidAngle = stateValue === "closeReset" ? 0 : handle.lidAngleDeg;

  if (stateValue === "interiorReveal") {
    return {
      cameraPosition: [0.4, 3.5, 1.8],
      lookAt: [0, 1.05, 0.1],
      spotlightIntensity: 7.2,
      haze: 0.04,
      interiorVisibility: 0.9,
      ballerinaOpacity: 0.64,
      lidAngleDeg: lidAngle,
      boxGlow: 0.92,
    };
  }

  if (stateValue === "ballerinaSilence" || stateValue === "voiceBlast" || stateValue === "messageHold") {
    return {
      cameraPosition: [0.3, 3.2, 1.6],
      lookAt: [0, 1.0, 0.05],
      spotlightIntensity: stateValue === "voiceBlast" ? 8.6 : 6.4,
      haze: stateValue === "voiceBlast" ? 0.08 : 0.035,
      interiorVisibility: 1,
      ballerinaOpacity: stateValue === "messageHold" ? 0.38 : 0.88,
      lidAngleDeg: lidAngle,
      boxGlow: stateValue === "voiceBlast" ? 1.35 : 0.98,
    };
  }

  if (stateValue === "carefulPrompt" || stateValue === "handlePhaseB") {
    return {
      cameraPosition: [2.48, 1.72, 4.2],
      lookAt: [0, 1.06, 0],
      spotlightIntensity: 6.2,
      haze: 0.028,
      interiorVisibility: 0.54,
      ballerinaOpacity: 0.08,
      lidAngleDeg: lidAngle,
      boxGlow: 0.55,
    };
  }

  if (
    stateValue === "readyPrompt1" ||
    stateValue === "readyPrompt2" ||
    stateValue === "listeningPrompt1" ||
    stateValue === "listeningPrompt2" ||
    stateValue === "handlePhaseA" ||
    stateValue === "crowdBoot"
  ) {
    return {
      cameraPosition: [3.12, 1.82, 5.22],
      lookAt: [0, 1.02, 0],
      spotlightIntensity: 6.1,
      haze: 0.022,
      interiorVisibility: 0.06,
      ballerinaOpacity: 0,
      lidAngleDeg: lidAngle,
      boxGlow: 0.22,
    };
  }

  return {
    cameraPosition: [3.38, 1.92, 5.86],
    lookAt: [0, 1.0, 0],
    spotlightIntensity: 6.8,
    haze: 0.018,
    interiorVisibility: 0,
    ballerinaOpacity: 0,
    lidAngleDeg: lidAngle,
    boxGlow: 0.1,
  };
}
