import { Canvas } from "@react-three/fiber";
import { useMachine } from "@xstate/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PCFShadowMap } from "three";

import {
  createInstallationRuntime,
  DEFAULT_GATE_CONFIG,
  type InstallationRuntime,
  type MeterSnapshot,
} from "@/soft-whisper/audio/runtime";
import { getQaSettings } from "@/soft-whisper/app/qa";
import { experienceMachine } from "@/soft-whisper/experience/experienceMachine";
import { cueForState, selectVisualTargets, stateAllowsHandle } from "@/soft-whisper/experience/selectors";
import { InstallationScene } from "@/soft-whisper/scene/InstallationScene";
import { Overlay } from "@/soft-whisper/ui/Overlay";

const spokenCueStates = new Set([
  "aloneLocked",
  "readyPrompt1",
  "readyPrompt2",
  "handlePhaseA",
  "listeningPrompt1",
  "listeningPrompt2",
  "handlePhaseB",
  "carefulPrompt",
  "interiorReveal",
  "ballerinaSilence",
]);

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error interrupted the ritual.";
}

export function App() {
  const qaSettings = useMemo(() => getQaSettings(window.location.search), []);
  const [qaScenario, setQaScenario] = useState(qaSettings.scenario);
  const [meter, setMeter] = useState<MeterSnapshot>({
    level: 0,
    threshold: DEFAULT_GATE_CONFIG.minThreshold,
    prompt: "idle",
  });

  const runtimeRef = useRef<InstallationRuntime>(
    createInstallationRuntime({
      qaEnabled: qaSettings.enabled,
      scenario: qaSettings.scenario,
      speed: qaSettings.speed,
    }),
  );

  const [snapshot, send] = useMachine(experienceMachine, {
    input: {
      timingScale: qaSettings.speed,
      qaEnabled: qaSettings.enabled,
    },
  });

  const stateValue = String(snapshot.value);
  const cue = cueForState(stateValue);
  const visualTargets = selectVisualTargets(stateValue, snapshot.context.handle);

  useEffect(() => {
    runtimeRef.current.setScenario?.(qaScenario);
  }, [qaScenario]);

  useEffect(() => {
    runtimeRef.current.setClimaxMuted(snapshot.context.climaxMuted);
  }, [snapshot.context.climaxMuted]);

  useEffect(() => {
    if (stateValue === "closeReset" || stateValue === "idle") {
      setMeter({
        level: 0,
        threshold: DEFAULT_GATE_CONFIG.minThreshold,
        prompt: stateValue,
      });
      void runtimeRef.current.stopAll();
    }
  }, [stateValue]);

  useEffect(() => {
    return () => {
      void runtimeRef.current.stopAll();
    };
  }, []);

  useEffect(() => {
    if (stateValue !== "crowdBoot" || snapshot.context.bootError) {
      return undefined;
    }

    const abortController = new AbortController();

    void (async () => {
      try {
        const result = await runtimeRef.current.bootCrowdSession();
        if (!abortController.signal.aborted) {
          send({
            type: "BOOT_READY",
            calibration: result.calibration,
            voiceName: result.voiceName,
          });
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          send({ type: "BOOT_FAILED", message: errorMessage(error) });
        }
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [send, snapshot.context.bootError, stateValue]);

  useEffect(() => {
    if (!spokenCueStates.has(stateValue)) {
      return undefined;
    }

    const abortController = new AbortController();

    void (async () => {
      try {
        await runtimeRef.current.runPrompt(cue, DEFAULT_GATE_CONFIG, abortController.signal, setMeter);

        if (abortController.signal.aborted) {
          return;
        }

        if (
          stateValue === "readyPrompt1" ||
          stateValue === "readyPrompt2" ||
          stateValue === "listeningPrompt1" ||
          stateValue === "listeningPrompt2" ||
          stateValue === "carefulPrompt"
        ) {
          send({ type: "PROMPT_ACK" });
        }
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        console.error(errorMessage(error));
        send({ type: "RESET" });
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [cue, send, stateValue]);

  useEffect(() => {
    if (!stateAllowsHandle(stateValue) || snapshot.context.handle.queuedNoteIndex === null) {
      return undefined;
    }

    const noteIndex = snapshot.context.handle.queuedNoteIndex;
    const abortController = new AbortController();

    void (async () => {
      try {
        await runtimeRef.current.queueMusicBoxNote(noteIndex, abortController.signal);
        if (!abortController.signal.aborted) {
          send({ type: "NOTE_PLAYED", noteIndex });
        }
      } catch {
        // The reset path intentionally aborts scheduled notes.
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [send, snapshot.context.handle.queuedNoteIndex, stateValue]);

  const shouldPrepareClimax =
    (stateValue === "interiorReveal" || stateValue === "ballerinaSilence") &&
    !snapshot.context.playbackReady;

  useEffect(() => {
    if (!shouldPrepareClimax) {
      return undefined;
    }

    const abortController = new AbortController();

    void (async () => {
      try {
        const playback = await runtimeRef.current.prepareClimaxPlayback(abortController.signal);
        if (!abortController.signal.aborted) {
          send({ type: "PLAYBACK_READY", playback });
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          send({ type: "BOOT_FAILED", message: errorMessage(error) });
        }
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [shouldPrepareClimax, send]);

  useEffect(() => {
    if (stateValue !== "ballerinaSilence") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      send({ type: "SILENCE_COMPLETE" });
    }, 15000 * snapshot.context.timingScale);

    return () => {
      window.clearTimeout(timer);
    };
  }, [send, snapshot.context.timingScale, stateValue]);

  useEffect(() => {
    if (stateValue !== "voiceBlast") {
      return undefined;
    }

    const abortController = new AbortController();

    void (async () => {
      try {
        await runtimeRef.current.playClimax(abortController.signal);
        if (!abortController.signal.aborted) {
          send({ type: "BLAST_FINISHED" });
        }
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        console.error(errorMessage(error));
        send({ type: "BLAST_FINISHED" });
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [send, stateValue]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" && stateAllowsHandle(stateValue)) {
        event.preventDefault();
        send({ type: "HANDLE_PRESS" });
      }

      if (event.shiftKey && event.altKey && event.key.toLowerCase() === "d") {
        event.preventDefault();
        send({ type: "TOGGLE_DEBUG" });
      }

      if (event.shiftKey && event.altKey && event.key.toLowerCase() === "r") {
        event.preventDefault();
        send({ type: "RESET" });
      }

      if (event.shiftKey && event.altKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        skipCue();
      }

      if (event.shiftKey && event.altKey && event.key.toLowerCase() === "c") {
        event.preventDefault();
        retryBoot();
      }

      if (event.shiftKey && event.altKey && event.key.toLowerCase() === "m") {
        event.preventDefault();
        send({ type: "TOGGLE_MUTE_CLIMAX" });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [send, stateValue]);

  useEffect(() => {
    if (!qaSettings.enabled) {
      return undefined;
    }

    window.__SOFT_WHISPER_QA__ = {
      setScenario: (scenario: string) => {
        setQaScenario(scenario);
      },
      getSnapshot: () => ({
        state: stateValue,
        context: snapshot.context,
        runtime: runtimeRef.current.getSnapshot(),
      }),
    };

    return () => {
      delete window.__SOFT_WHISPER_QA__;
    };
  }, [qaSettings.enabled, snapshot.context, stateValue]);

  const retryBoot = () => {
    void runtimeRef.current.stopAll();
    send({ type: "RETRY_BOOT" });
  };

  const skipCue = () => {
    switch (stateValue) {
      case "readyPrompt1":
      case "readyPrompt2":
      case "listeningPrompt1":
      case "listeningPrompt2":
      case "carefulPrompt":
        send({ type: "PROMPT_ACK" });
        break;
      case "ballerinaSilence":
        send({ type: "SILENCE_COMPLETE" });
        break;
      case "voiceBlast":
        send({ type: "BLAST_FINISHED" });
        break;
      default:
        break;
    }
  };

  const selectCrowd = async () => {
    try {
      await runtimeRef.current.primeFromGesture();
    } catch {
      // The boot phase will surface the actual failure state if audio cannot start.
    }

    send({ type: "SELECT_MODE", mode: "crowd" });
  };

  const selectAlone = () => {
    send({ type: "SELECT_MODE", mode: "aloneLocked" });
  };

  const runtimeSnapshot = runtimeRef.current.getSnapshot();

  return (
    <div className="app-shell">
      <div className="canvas-wrap">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [3.38, 1.92, 5.86], fov: 34 }}
          gl={{ antialias: true }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = PCFShadowMap;
          }}
        >
          <InstallationScene
            stateValue={stateValue}
            handle={snapshot.context.handle}
            visualTargets={visualTargets}
          />
        </Canvas>
      </div>

      <Overlay
        cue={cue}
        stateValue={stateValue}
        bootError={snapshot.context.bootError}
        voiceName={snapshot.context.voiceName}
        meter={meter}
        handle={snapshot.context.handle}
        runtimeSnapshot={runtimeSnapshot}
        debugVisible={snapshot.context.debugVisible}
        timingScale={snapshot.context.timingScale}
        muted={snapshot.context.climaxMuted}
        onSelectCrowd={() => {
          void selectCrowd();
        }}
        onSelectAlone={selectAlone}
        onHandlePress={() => send({ type: "HANDLE_PRESS" })}
        onReset={() => send({ type: "RESET" })}
        onRetryBoot={retryBoot}
        onSkip={skipCue}
        onToggleMute={() => send({ type: "TOGGLE_MUTE_CLIMAX" })}
      />
    </div>
  );
}
