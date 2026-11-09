import type { Context } from '../classrooms/shared.js';
import { button, dueLabel } from '../classrooms/shared.js';
import { homeworkStatus, homeworkStatusLabels } from '../../../../packages/domain/homework.js';
import { paginate, pageButtons } from '../pagination.js';
import type { BotState, User } from '../../../../packages/domain/types.js';

/** Сдача групповой работы: фильтры, счётчики и пагинация. */
export type BatchFilter = 'all' | 'pending' | 'overdue' | 'submitted';

export function isBatchFilter(value: string): value is BatchFilter {
  return ['all', 'pending', 'overdue', 'submitted'].includes(value);
}

export function showBatch(
  state: BotState,
  user: User,
  batch: string,
  requestedPage: number,
  ctx: Context,
  filter: BatchFilter = 'all',
) {
  const tasks = Object.values(state.assignments ?? {}).filter((a) => (a.batchId ?? a.id) === batch);
  if (!tasks.length || !ctx.teacher || (!ctx.admin && tasks.some((task) => task.teacherId !== user.id))) {
    ctx.send('Работа недоступна.');
    return;
  }

  const submitted = tasks.filter((a) => a.completedAt).length;
  const overdue = tasks.filter((task) => homeworkStatus(state, task) === 'overdue').length;
  const filtered = tasks.filter((task) => {
    if (filter === 'pending') return !task.completedAt;
    if (filter === 'submitted') return Boolean(task.completedAt);
    if (filter === 'overdue') return homeworkStatus(state, task) === 'overdue';
    return true;
  });
  const { page, pages, items } = paginate(filtered, requestedPage);
  const labels: Record<BatchFilter, string> = {
    all: 'Все',
    pending: 'Не сдали',
    overdue: 'Просрочено',
    submitted: 'Сдали',
  };
  const rows = items.map((task) => {
    const attempt = task.attemptId ? state.attempts[task.attemptId] : undefined;
    const result =
      task.completedAt && attempt?.completedAt
        ? `${attempt.answers.filter((answer) => answer.correct).length}/${attempt.lesson.questions.length}`
        : homeworkStatusLabels[homeworkStatus(state, task)];
    const name = state.users[task.studentId]?.name.slice(0, 24) ?? 'Ученик';
    return [button(`${name} · ${result}`, `work:result:${task.id}:${page}:${filter}`)];
  });

  ctx.panel(
    [
      `📊 ${tasks[0].lesson.title}`,
      `Сдано: ${submitted} из ${tasks.length}\nНе сдали: ${tasks.length - submitted}\nПросрочено: ${overdue}\nСрок: ${dueLabel(tasks[0].deadline)}`,
      `${labels[filter]} · Страница ${page + 1} из ${pages}`,
      items.length ? 'Выбери ученика: ответы и время видны после сдачи.' : 'В этом списке учеников нет.',
    ].join('\n\n'),
    {
      inline_keyboard: [
        [
          button(`Все · ${tasks.length}`, `work:batch:${batch}:0:all`),
          button(`Не сдали · ${tasks.length - submitted}`, `work:batch:${batch}:0:pending`),
        ],
        [
          button(`Просрочено · ${overdue}`, `work:batch:${batch}:0:overdue`),
          button(`Сдали · ${submitted}`, `work:batch:${batch}:0:submitted`),
        ],
        ...rows,
        ...pageButtons(page, pages, (next) => `work:batch:${batch}:${next}:${filter}`),
        [button('📤 Все отправленные', 'work:sent:0'), button('🏠 Меню', 'home')],
      ],
    },
  );
}
