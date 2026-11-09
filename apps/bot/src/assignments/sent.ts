import { button, paged } from '../classrooms/shared.js';
import { isBatchFilter, showBatch } from './batch.js';
import type { ClassroomRequest } from '../classrooms/request.js';

export function handleAssignmentSent(request: ClassroomRequest): boolean {
  const { state, user, ctx, action, id, detail, extra } = request;
  if (action === 'sent') {
    const tasks = Object.values(state.assignments ?? {}).filter((a) => ctx.admin || a.teacherId === user.id);
    const batches = [...new Map(tasks.map((a) => [a.batchId ?? a.id, a])).values()].reverse();
    ctx.panel(
      '📤 Отправленные работы\n\nВыбери задание, чтобы увидеть, кто сдал, ответы и время.',
      paged(
        batches,
        Number(id),
        (a) => [
          button(
            `${a.lesson.title} · ${new Date(a.createdAt).toLocaleDateString('ru-RU')}`,
            `work:batch:${a.batchId ?? a.id}:0`,
          ),
        ],
        (p) => `work:sent:${p}`,
        [[button('📝 Мои ДЗ', 'work:list:0')]],
      ),
    );
    return true;
  }
  if (action === 'batch') {
    const filter = extra ?? 'all';
    if (!isBatchFilter(filter)) {
      ctx.send('Фильтр недоступен. /sent_homework');
      return true;
    }
    showBatch(state, user, id, Number(detail), ctx, filter);
    return true;
  }
  return false;
}
