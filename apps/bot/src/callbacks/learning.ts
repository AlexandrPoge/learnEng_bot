import { send } from '../ui/messages.js';
import { showReview } from '../learning/review.js';
import { showSection } from '../catalog/section.js';
import { startLesson } from '../practice/start.js';
import type { CallbackContext } from '../routing/context.js';
import type { Section } from '../../../../packages/domain/types.js';

export function handleLearningCallback(request: CallbackContext): boolean {
  const { state, id, user, data, messageId } = request;
  const repeatMatch = /^repeat:([a-f0-9]{16})$/u.exec(data);
  if (repeatMatch) {
    const origin = state.attempts[repeatMatch[1]];
    if (!origin || origin.studentId !== id || !origin.completedAt) {
      send(state, id, 'Повторение доступно только для твоей завершённой попытки.');
      return true;
    }

    startLesson(state, user, origin.lesson.id, undefined, origin);
    return true;
  }
  const sectionMatch = /^s:([a-z0-9-]{1,40}):(rule|examples|traps):(\d+)$/u.exec(data);
  if (sectionMatch) {
    showSection(state, user, sectionMatch[1], sectionMatch[2] as Section, Number(sectionMatch[3]), messageId);
    return true;
  }
  const reviewMatch = /^review:([a-f0-9]{16})(?::(\d+))?$/u.exec(data);
  if (reviewMatch) {
    showReview(state, user, reviewMatch[1], Number(reviewMatch[2] ?? 0), messageId);
    return true;
  }
  return false;
}
