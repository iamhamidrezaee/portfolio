import { AnimatePresence, motion } from "framer-motion";

import type { InstallationRuntimeSnapshot, MeterSnapshot } from "@/soft-whisper/audio/runtime";
import { PRESSES_PER_NOTE } from "@/soft-whisper/experience/handleMath";
import type { CueDefinition, HandleState } from "@/soft-whisper/experience/types";
import { DebugOverlay } from "@/soft-whisper/ui/DebugOverlay";

interface OverlayProps {
  cue: CueDefinition;
  stateValue: string;
  bootError: string | null;
  voiceName: string | null;
  meter: MeterSnapshot;
  handle: HandleState;
  runtimeSnapshot: InstallationRuntimeSnapshot;
  debugVisible: boolean;
  timingScale: number;
  muted: boolean;
  onSelectCrowd: () => void;
  onSelectAlone: () => void;
  onHandlePress: () => void;
  onReset: () => void;
  onRetryBoot: () => void;
  onSkip: () => void;
  onToggleMute: () => void;
}

function showHandleButton(stateValue: string): boolean {
  return stateValue === "handlePhaseA" || stateValue === "handlePhaseB";
}

function showMeter(stateValue: string): boolean {
  return (
    stateValue === "readyPrompt1" ||
    stateValue === "readyPrompt2" ||
    stateValue === "listeningPrompt1" ||
    stateValue === "listeningPrompt2"
  );
}

function hidePrompt(stateValue: string): boolean {
  return stateValue === "voiceBlast" || stateValue === "messageHold";
}

export function Overlay({
  cue,
  stateValue,
  bootError,
  meter,
  handle,
  runtimeSnapshot,
  debugVisible,
  timingScale,
  muted,
  onSelectCrowd,
  onSelectAlone,
  onHandlePress,
  onReset,
  onRetryBoot,
  onSkip,
  onToggleMute,
}: OverlayProps) {
  return (
    <div className="overlay">
      <div className="prompt-stack">
        <AnimatePresence mode="wait">
          {!hidePrompt(stateValue) ? (
            <motion.div
              key={cue.id}
              className="prompt-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.35, 1] }}
            >
              <h1 className="prompt-title">{cue.title}</h1>
              {cue.body ? <p className="prompt-body">{cue.body}</p> : null}
              {cue.instruction ? <p className="prompt-instruction">{cue.instruction}</p> : null}
              {bootError ? (
                <p className="prompt-instruction" style={{ color: "var(--danger)" }}>
                  {bootError}
                </p>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {stateValue === "modeChoice" ? (
          <div className="option-row">
            <button className="option-button" type="button" onClick={onSelectAlone}>
              <strong>Alone</strong>
            </button>
            <button className="option-button" type="button" onClick={onSelectCrowd}>
              <strong>In a crowd</strong>
            </button>
          </div>
        ) : null}

        {showHandleButton(stateValue) ? (
          <div className="control-row">
            <button
              className="handle-button"
              type="button"
              onClick={onHandlePress}
              disabled={!handle.acceptingInput}
            >
              <span className="handle-symbol">↑</span>
              <span>
                {handle.acceptingInput
                  ? `${PRESSES_PER_NOTE - handle.cyclePressCount || PRESSES_PER_NOTE} left`
                  : "\u2026"}
              </span>
            </button>
          </div>
        ) : null}

        {showMeter(stateValue) ? (
          <div className="meter-panel">
            <div className="meter-line" aria-hidden="true">
              <div
                className="meter-fill"
                style={{ width: `${Math.min(100, meter.level * 400)}%` }}
              />
              <div
                className="meter-threshold"
                style={{ left: `${Math.min(100, meter.threshold * 400)}%` }}
              />
            </div>
            <div className="meter-copy">
              <span>listening</span>
              <span>{meter.level.toFixed(3)}</span>
            </div>
          </div>
        ) : null}
      </div>

      <DebugOverlay
        visible={debugVisible}
        runtimeSnapshot={runtimeSnapshot}
        timingScale={timingScale}
        muted={muted}
        onReset={onReset}
        onRetryBoot={onRetryBoot}
        onSkip={onSkip}
        onToggleMute={onToggleMute}
      />
    </div>
  );
}
