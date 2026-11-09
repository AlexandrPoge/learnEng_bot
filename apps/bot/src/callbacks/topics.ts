import { send } from '../ui/messages.js';
import { showReview } from '../learning/review.js';
import { showCatalog } from '../catalog/levels.js';
import { showLesson } from '../catalog/lesson.js';
import { startLesson } from '../practice/start.js';
import type { CallbackContext } from '../routing/context.js';
import type { Category, Level } from '../../../../packages/domain/types.js';

export function handleTopicsCallback(request: CallbackContext): boolean {
  const { state, id, user, data, messageId } = request;
  const homeworkMatch = /^h:([a-f0-9]{16})$/u.exec(data);
  if (homeworkMatch) {
    const assignment = state.assignments?.[homeworkMatch[1]];
    if (!assignment || assignment.studentId !== id) {
      send(state, id, 'Это задание недоступно. /homework');
      return true;
    }
    if (assignment.completedAt) {
      assignment.attemptId
        ? showReview(state, user, assignment.attemptId, 0, messageId)
        : send(state, id, '✅ Задание сдано. Подробная попытка недоступна. /homework');
      return true;
    }

    startLesson(state, user, assignment.lesson.id, assignment);
    return true;
  }
  const catalogMatch = /^l:(A1|A2|B1|B2|C1|C2):(\d+)$/u.exec(data);
  if (catalogMatch) {
    showCatalog(state, user, catalogMatch[1] as Level, Number(catalogMatch[2]), messageId);
    return true;
  }
  const groupMatch = /^g:(A1|A2|B1|B2|C1|C2):(foundation|grammar|vocabulary|situations):(\d+)$/u.exec(data);
  if (groupMatch) {
    showCatalog(
      state,
      user,
      groupMatch[1] as Level,
      Number(groupMatch[3]),
      messageId,
      groupMatch[2] as Category,
    );
    return true;
  }
  const topicMatch = /^(t|p):([a-z0-9-]{1,40})$/u.exec(data);
  if (topicMatch) {
    topicMatch[1] === 't'
      ? showLesson(state, user, topicMatch[2], messageId)
      : startLesson(state, user, topicMatch[2]);
    return true;
  }
  return false;
}
