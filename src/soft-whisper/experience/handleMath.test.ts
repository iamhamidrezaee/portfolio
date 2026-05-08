import { describe, expect, it } from "vitest";

import {
  advanceHandlePress,
  commitQueuedNote,
  createInitialHandleState,
  noteVolumeForIndex,
} from "@/soft-whisper/experience/handleMath";

describe("handleMath", () => {
  it("queues exactly one note on every second press", () => {
    let handle = createInitialHandleState();

    handle = advanceHandlePress(handle);
    expect(handle.queuedNoteIndex).toBeNull();
    expect(handle.acceptingInput).toBe(true);

    handle = advanceHandlePress(handle);

    expect(handle.queuedNoteIndex).toBe(0);
    expect(handle.acceptingInput).toBe(false);
    expect(handle.cycleIndex).toBe(1);
    expect(handle.crankAngleDeg).toBe(60);
  });

  it("opens the lid only after the queued note is committed", () => {
    let handle = createInitialHandleState();

    for (let index = 0; index < 2; index += 1) {
      handle = advanceHandlePress(handle);
    }

    expect(handle.lidAngleDeg).toBe(0);

    handle = commitQueuedNote(handle, 0);

    expect(handle.currentNoteIndex).toBe(0);
    expect(handle.lidAngleDeg).toBeGreaterThan(0);
    expect(handle.queuedNoteIndex).toBeNull();
    expect(handle.acceptingInput).toBe(true);
  });

  it("fades note volumes across the phrase", () => {
    expect(noteVolumeForIndex(0)).toBeGreaterThan(noteVolumeForIndex(7));
    expect(noteVolumeForIndex(3)).toBeGreaterThan(noteVolumeForIndex(6));
  });
});
