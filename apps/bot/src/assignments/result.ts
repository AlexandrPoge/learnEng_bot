import { button, dueLabel } from '../classrooms/shared.js';
import { isBatchFilter } from './batch.js';
import type { ClassroomRequest } from '../classrooms/request.js';
import { buildReport } from '../../../../packages/domain/grading.js';
import { homeworkStatus, homeworkStatusLabels } from '../../../../packages/domain/homework.js';

export function handleAssignmentResult(request: ClassroomRequest): boolean {
  const { state, user, ctx, action, id, detail, extra } = request;
  if (action === 'result') {
    const a = state.assignments?.[id];
    if (!ctx.teacher || !a || (!ctx.admin && a.teacherId !== user.id)) {
      ctx.send('Нет доступа к работе.');
      return true;
    }
    const filter = extra ?? 'all';
    if (!isBatchFilter(filter)) {
      ctx.send('Фильтр недоступен. /sent_homework');
      return true;
    }
    const page = Number(detail ?? 0);
    const returnPage = Number.isSafeInteger(page) && page >= 0 ? page : 0;
    const attempt = a.attemptId ? state.attempts[a.attemptId] : undefined;
    const name = state.users[a.studentId]?.name ?? 'Ученик';
    const text =
      a.completedAt && attempt?.completedAt
        ? buildReport(attempt, name)
        : `${name} · ${homeworkStatusLabels[homeworkStatus(state, a)]}\nСрок: ${dueLabel(a.deadline)}`;
    ctx.send(text, {
      requiredTeacher: true,
      reply_markup: {
        inline_keyboard: [
          [button('📊 К работе', `work:batch:${a.batchId ?? a.id}:${returnPage}:${filter}`)],
          [button('🏠 Меню', 'home')],
        ],
      },
    });
    return true;
  }
  return false;
}
