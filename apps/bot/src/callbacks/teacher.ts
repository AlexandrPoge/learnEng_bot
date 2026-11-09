import { send } from '../ui/messages.js';
import { showResults } from '../teacher/results.js';
import { showNotifications } from '../teacher/notifications.js';
import type { CallbackContext } from '../routing/context.js';
import { buildReport } from '../../../../packages/domain/grading.js';

export function handleTeacherCallback(request: CallbackContext): boolean {
  const { state, id, user, teacher, admin, access, data, messageId } = request;
  const resultPage = /^results:(\d+)$/u.exec(data);
  if (resultPage) {
    showResults(state, user, access, Number(resultPage[1]), messageId);
    return true;
  }
  const teacherReport = /^report:([a-f0-9]{16})$/u.exec(data);
  if (teacherReport) {
    const attempt = state.attempts[teacherReport[1]];
    if (!teacher || !attempt?.completedAt || (!admin && attempt.teacherId !== id)) {
      send(state, id, 'Нет доступа к работе.');
      return true;
    }

    send(state, id, buildReport(attempt, state.users[attempt.studentId]?.name ?? 'Ученик'), {
      requiredTeacher: true,
      reply_markup: { inline_keyboard: [[{ text: '📊 К списку работ', callback_data: 'results:0' }]] },
    });
    return true;
  }
  if (['notify:results', 'notify:compact', 'notify:off'].includes(data)) {
    if (!teacher) {
      send(state, id, 'Настройка доступна репетитору и администратору.');
      return true;
    }
    if (data !== 'notify:results') user.resultNotifications = data === 'notify:off' ? 'off' : 'compact';

    showNotifications(state, user, access, messageId);
    return true;
  }
  return false;
}
