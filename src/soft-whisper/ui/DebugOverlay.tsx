import type { InstallationRuntimeSnapshot } from "@/soft-whisper/audio/runtime";

interface DebugOverlayProps {
  visible: boolean;
  runtimeSnapshot: InstallationRuntimeSnapshot;
  timingScale: number;
  muted: boolean;
  onReset: () => void;
  onRetryBoot: () => void;
  onSkip: () => void;
  onToggleMute: () => void;
}

export function DebugOverlay({
  visible,
  runtimeSnapshot,
  timingScale,
  muted,
  onReset,
  onRetryBoot,
  onSkip,
  onToggleMute,
}: DebugOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <section className="hidden-debug" aria-label="Operator controls">
      <h2>Operator Controls</h2>
      <p>
        Hidden fail-safes for rehearsal and emergency recovery. These are intentionally absent from
        the audience-facing interface.
      </p>

      <div className="debug-grid">
        <button className="debug-button" type="button" onClick={onReset}>
          Reset session
        </button>
        <button className="debug-button" type="button" onClick={onSkip}>
          Skip cue
        </button>
        <button className="debug-button" type="button" onClick={onRetryBoot}>
          Recalibrate mic
        </button>
        <button className="debug-button" type="button" onClick={onToggleMute}>
          {muted ? "Unmute climax" : "Mute climax"}
        </button>
      </div>

      <p>Voice: {runtimeSnapshot.selectedVoice ?? "Not selected"}</p>
      <p>Recorder: {runtimeSnapshot.recorderState}</p>
      <p>Mic active: {runtimeSnapshot.hasStream ? "yes" : "no"}</p>
      <p>Threshold: {runtimeSnapshot.passThreshold?.toFixed(3) ?? "n/a"}</p>
      <p>Timing scale: {timingScale.toFixed(2)}</p>
    </section>
  );
}
