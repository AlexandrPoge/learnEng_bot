import { findLesson } from './catalog.js';
import type { BotState, Lesson } from '../../../../packages/domain/types.js';

/** Публикация новой версии с сохранением прежнего снимка. */
export function publish(state: BotState, editorId: string, lesson: Lesson) {
  state.lessonOverrides ??= {};
  state.lessonHistory ??= {};
  const old = findLesson(state, lesson.id);
  if (old) {
    state.lessonHistory[lesson.id] ??= [];
    state.lessonHistory[lesson.id].push({
      lesson: structuredClone(old),
      editedBy: editorId,
      savedAt: new Date().toISOString(),
    });
  }
  state.lessonOverrides[lesson.id] = { ...structuredClone(lesson), version: (old?.version ?? 0) + 1 };
}
