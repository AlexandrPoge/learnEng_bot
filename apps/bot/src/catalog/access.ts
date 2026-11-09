import { findLesson } from '../editor.js';
import type { BotState, User } from '../../../../packages/domain/types.js';

/** Проверка доступа к опубликованной теме или личному назначению. */
export function accessibleLesson(state: BotState, user: User, id: string | undefined) {
  if (!id) return undefined;
  const active = user.activeAttempt && state.attempts[user.activeAttempt];
  if (active && active.lesson.id === id) return active.lesson;
  return (
    findLesson(state, id) ??
    Object.values(state.assignments ?? {})
      .reverse()
      .find((a) => a.studentId === user.id && a.lesson.id === id)?.lesson
  );
}
