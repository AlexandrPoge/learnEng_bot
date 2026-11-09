import { lessons } from '../../../../packages/content/catalog.js';
import type { BotState, Lesson } from '../../../../packages/domain/types.js';

/** Объединение встроенных уроков с опубликованными версиями. */
export const availableLessons = (state: BotState): Lesson[] => {
  const merged = new Map(lessons.map((item) => [item.id, item]));
  for (const item of Object.values(state.lessonOverrides ?? {})) merged.set(item.id, item);
  return [...merged.values()];
};

export const findLesson = (state: BotState, id: string | undefined) =>
  availableLessons(state).find((item) => item.id === id);
