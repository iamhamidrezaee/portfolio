import { assign, setup } from "xstate";

import { SWAN_LAKE_SEQUENCE } from "@/soft-whisper/experience/cues";
import { advanceHandlePress, commitQueuedNote, createInitialHandleState } from "@/soft-whisper/experience/handleMath";
import type {
  ExperienceContext,
  ExperienceEvent,
  ExperienceMachineInput,
} from "@/soft-whisper/experience/types";

const HALFWAY_NOTE_INDEX = 15;
const CAREFUL_PROMPT_NOTE_INDEX = SWAN_LAKE_SEQUENCE.length - 3;
const FINAL_NOTE_INDEX = SWAN_LAKE_SEQUENCE.length - 1;

function createInitialContext(input: ExperienceMachineInput): ExperienceContext {
  return {
    mode: null,
    handle: createInitialHandleState(),
    calibration: null,
    capture: {
      status: "idle",
      chunkCount: 0,
      durationMs: 0,
    },
    playback: null,
    playbackReady: false,
    silenceElapsed: false,
    bootError: null,
    voiceName: null,
    debugVisible: false,
    climaxMuted: false,
    timingScale: input.timingScale,
    qaEnabled: input.qaEnabled,
  };
}

export const experienceMachine = setup({
  types: {
    context: {} as ExperienceContext,
    events: {} as ExperienceEvent,
    input: {} as ExperienceMachineInput,
  },
  guards: {
    canAcceptHandlePress: ({ context }) =>
      context.handle.acceptingInput && context.handle.queuedNoteIndex === null,
    noteIsHalfway: ({ event }) => event.type === "NOTE_PLAYED" && event.noteIndex === HALFWAY_NOTE_INDEX,
    noteIsNearEnd: ({ event }) =>
      event.type === "NOTE_PLAYED" && event.noteIndex === CAREFUL_PROMPT_NOTE_INDEX,
    noteIsFinal: ({ event }) => event.type === "NOTE_PLAYED" && event.noteIndex >= FINAL_NOTE_INDEX,
    hasPlaybackReady: ({ context }) => context.playbackReady,
    silenceAlreadyElapsed: ({ context }) => context.silenceElapsed,
  },
  delays: {
    idlePause: ({ context }) => 500 * context.timingScale,
    alonePause: ({ context }) => 2400 * context.timingScale,
    interiorRevealPause: ({ context }) => 3000 * context.timingScale,
    messagePause: ({ context }) => 360000 * context.timingScale,
    closeResetPause: ({ context }) => 4200 * context.timingScale,
  },
  actions: {
    setCrowdMode: assign({
      mode: "crowd",
      bootError: null,
      playback: null,
      playbackReady: false,
      silenceElapsed: false,
      capture: () => ({
        status: "recording",
        chunkCount: 0,
        durationMs: 0,
      }),
    }),
    setAloneMode: assign({
      mode: "aloneLocked",
      bootError: null,
      playback: null,
      playbackReady: false,
      silenceElapsed: false,
    }),
    storeBootReady: assign(({ event }) => {
      if (event.type !== "BOOT_READY") {
        return {};
      }

      return {
        calibration: event.calibration,
        voiceName: event.voiceName,
        bootError: null,
        capture: {
          status: "recording",
          chunkCount: 0,
          durationMs: 0,
        },
      };
    }),
    storeBootFailure: assign(({ event, context }) => {
      if (event.type !== "BOOT_FAILED") {
        return {};
      }

      return {
        bootError: event.message,
        capture: {
          ...context.capture,
          status: "idle",
        },
      };
    }),
    clearBootFailure: assign({
      bootError: null,
    }),
    applyHandlePress: assign(({ context }) => ({
      handle: advanceHandlePress(context.handle),
    })),
    commitNote: assign(({ context, event }) => {
      if (event.type !== "NOTE_PLAYED") {
        return {};
      }

      return {
        handle: commitQueuedNote(context.handle, event.noteIndex),
      };
    }),
    storePlayback: assign(({ event, context }) => {
      if (event.type !== "PLAYBACK_READY") {
        return {};
      }

      return {
        playback: event.playback,
        playbackReady: true,
        capture: {
          ...context.capture,
          status: "decoded",
          durationMs: event.playback.durationMs,
        },
      };
    }),
    markSilenceElapsed: assign({
      silenceElapsed: true,
    }),
    clearSilenceElapsed: assign({
      silenceElapsed: false,
    }),
    toggleDebug: assign(({ context }) => ({
      debugVisible: !context.debugVisible,
    })),
    toggleMuteClimax: assign(({ context }) => ({
      climaxMuted: !context.climaxMuted,
    })),
    setTimingScale: assign(({ event }) => {
      if (event.type !== "SET_TIMING_SCALE") {
        return {};
      }

      return {
        timingScale: Math.max(0.05, Math.min(event.scale, 2)),
      };
    }),
    resetContext: assign(({ context }) =>
      createInitialContext({
        timingScale: context.timingScale,
        qaEnabled: context.qaEnabled,
      }),
    ),
  },
}).createMachine({
  id: "softWhisperExperience",
  initial: "idle",
  context: ({ input }) => createInitialContext(input),
  on: {
    TOGGLE_DEBUG: {
      actions: "toggleDebug",
    },
    TOGGLE_MUTE_CLIMAX: {
      actions: "toggleMuteClimax",
    },
    SET_TIMING_SCALE: {
      actions: "setTimingScale",
    },
    RESET: {
      target: ".closeReset",
    },
  },
  states: {
    idle: {
      entry: "resetContext",
      after: {
        idlePause: "modeChoice",
      },
    },
    modeChoice: {
      on: {
        SELECT_MODE: [
          {
            guard: ({ event }) => event.type === "SELECT_MODE" && event.mode === "crowd",
            target: "crowdBoot",
            actions: "setCrowdMode",
          },
          {
            target: "aloneLocked",
            actions: "setAloneMode",
          },
        ],
      },
    },
    aloneLocked: {
      after: {
        alonePause: "closeReset",
      },
    },
    crowdBoot: {
      on: {
        BOOT_READY: {
          target: "readyPrompt1",
          actions: "storeBootReady",
        },
        BOOT_FAILED: {
          actions: "storeBootFailure",
        },
        RETRY_BOOT: {
          actions: "clearBootFailure",
        },
      },
    },
    readyPrompt1: {
      on: {
        PROMPT_ACK: "readyPrompt2",
      },
    },
    readyPrompt2: {
      on: {
        PROMPT_ACK: "handlePhaseA",
      },
    },
    handlePhaseA: {
      on: {
        HANDLE_PRESS: {
          guard: "canAcceptHandlePress",
          actions: "applyHandlePress",
        },
        NOTE_PLAYED: [
          {
            guard: "noteIsHalfway",
            target: "listeningPrompt1",
            actions: "commitNote",
          },
          {
            actions: "commitNote",
          },
        ],
      },
    },
    listeningPrompt1: {
      on: {
        PROMPT_ACK: "listeningPrompt2",
      },
    },
    listeningPrompt2: {
      on: {
        PROMPT_ACK: "handlePhaseB",
      },
    },
    handlePhaseB: {
      on: {
        HANDLE_PRESS: {
          guard: "canAcceptHandlePress",
          actions: "applyHandlePress",
        },
        NOTE_PLAYED: [
          {
            guard: "noteIsFinal",
            target: "interiorReveal",
            actions: "commitNote",
          },
          {
            guard: "noteIsNearEnd",
            target: "carefulPrompt",
            actions: "commitNote",
          },
          {
            actions: "commitNote",
          },
        ],
      },
    },
    carefulPrompt: {
      on: {
        PROMPT_ACK: "handlePhaseB",
      },
    },
    interiorReveal: {
      on: {
        PLAYBACK_READY: {
          actions: "storePlayback",
        },
      },
      after: {
        interiorRevealPause: {
          target: "ballerinaSilence",
          actions: "clearSilenceElapsed",
        },
      },
    },
    ballerinaSilence: {
      on: {
        PLAYBACK_READY: [
          {
            guard: "silenceAlreadyElapsed",
            target: "voiceBlast",
            actions: "storePlayback",
          },
          {
            actions: "storePlayback",
          },
        ],
        SILENCE_COMPLETE: [
          {
            guard: "hasPlaybackReady",
            target: "voiceBlast",
          },
          {
            actions: "markSilenceElapsed",
          },
        ],
      },
    },
    voiceBlast: {
      on: {
        BLAST_FINISHED: "messageHold",
      },
    },
    messageHold: {
      after: {
        messagePause: "closeReset",
      },
    },
    closeReset: {
      after: {
        closeResetPause: "idle",
      },
    },
  },
});
