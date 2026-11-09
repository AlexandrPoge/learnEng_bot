import { send, panel } from '../ui/messages.js';
import type { BotState, User, Access } from '../../../../packages/domain/types.js';

/** Список работ, доступных текущему преподавателю. */
export function showResults(state: BotState, user: User, access: Access, page = 0, messageId?: number) {
  if (!access.teacher) return send(state, user.id, 'Работы доступны репетитору и администратору.');
  const attempts = Object.values(state.attempts)
    .filter((a) => a.completedAt && (access.admin || a.teacherId === user.id))
    .sort((a, b) => b.completedAt!.localeCompare(a.completedAt!));
  const pages = Math.max(1, Math.ceil(attempts.length / 5));
  if (!Number.isInteger(page) || page < 0 || page >= pages)
    return send(state, user.id, 'Страница не найдена. /results');
  const rows = attempts.slice(page * 5, page * 5 + 5).map((a) => [
    {
      text: `👤 ${state.users[a.studentId]?.name.slice(0, 24) ?? 'Ученик'} · ${a.answers.filter((x) => x.correct).length}/${a.lesson.questions.length} · ${a.lesson.title.slice(0, 42)}`,
      callback_data: `report:${a.id}`,
    },
  ]);
  const arrows = [];
  if (page > 0) arrows.push({ text: '⬅️ Назад', callback_data: `results:${page - 1}` });
  if (page + 1 < pages) arrows.push({ text: 'Дальше ➡️', callback_data: `results:${page + 1}` });
  panel(
    state,
    user,
    `📊 Работы учеников\n\n${attempts.length ? `Сдано работ: ${attempts.length}\n📄 Страница ${page + 1} из ${pages}\n\nВыбери работу: откроются ответы, оценка и время.` : 'Выполненных заданий пока нет.'}\n\n🔔 Уведомления: ${user.resultNotifications === 'off' ? 'выключены; результаты хранятся здесь' : 'только краткий результат'}.`,
    {
      inline_keyboard: [
        ...rows,
        ...(arrows.length ? [arrows] : []),
        [
          { text: '🔔 Настроить уведомления', callback_data: 'notify:results' },
          { text: '🏠 Меню', callback_data: 'home' },
        ],
      ],
    },
    messageId,
  );
}
