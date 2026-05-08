import { SWAN_LAKE_SEQUENCE } from "@/soft-whisper/experience/cues";
import type { HandleState } from "@/soft-whisper/experience/types";

export const PRESSES_PER_NOTE = 2;
export const PRESS_DEGREES = 30;

const lidAnglesByNote = [
  7, 12, 18, 25, 33, 42, 51, 60,
  69, 77, 85, 93, 102, 111, 119, 126,
];

const noteVolumes = [
  0.92, 0.9, 0.87, 0.83, 0.79, 0.74, 0.69, 0.63,
  0.56, 0.49, 0.42, 0.35, 0.28, 0.2, 0.14, 0.1,
];

export function createInitialHandleState(): HandleState {
  return {
    pressCount: 0,
    cyclePressCount: 0,
    cycleIndex: 0,
    lidAngleDeg: 0,
    currentNoteIndex: -1,
    crankAngleDeg: 0,
    queuedNoteIndex: null,
    acceptingInput: true,
  };
}

export function lidAngleForNoteCount(noteCount: number): number {
  if (noteCount <= 0) return 0;
  return lidAnglesByNote[Math.min(noteCount - 1, lidAnglesByNote.length - 1)];
}

export function noteVolumeForIndex(noteIndex: number): number {
  return noteVolumes[Math.min(Math.max(noteIndex, 0), noteVolumes.length - 1)];
}

export function advanceHandlePress(handle: HandleState): HandleState {
  if (!handle.acceptingInput || handle.queuedNoteIndex !== null) return handle;

  const pressCount = handle.pressCount + 1;
  const cyclePressCount = pressCount % PRESSES_PER_NOTE;
  const completedCycle = cyclePressCount === 0;
  const queuedNoteIndex = completedCycle
    ? Math.min(handle.currentNoteIndex + 1, SWAN_LAKE_SEQUENCE.length - 1)
    : null;

  return {
    ...handle,
    pressCount,
    cyclePressCount,
    cycleIndex: Math.floor(pressCount / PRESSES_PER_NOTE),
    crankAngleDeg: pressCount * PRESS_DEGREES,
    queuedNoteIndex,
    acceptingInput: !completedCycle,
  };
}

export function commitQueuedNote(handle: HandleState, noteIndex: number): HandleState {
  const nextIndex = Math.max(handle.currentNoteIndex, noteIndex);
  const noteCount = nextIndex + 1;
  const hasMoreNotes = nextIndex < SWAN_LAKE_SEQUENCE.length - 1;

  return {
    ...handle,
    currentNoteIndex: nextIndex,
    queuedNoteIndex: null,
    lidAngleDeg: lidAngleForNoteCount(noteCount),
    acceptingInput: hasMoreNotes,
  };
}
