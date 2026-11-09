import { send, panel } from '../ui/messages.js';
import { categoryLabels } from './context.js';
import { availableLessons } from '../editor.js';
import type { BotState, User, Category, Level } from '../../../../packages/domain/types.js';

/** Каталог по языковым уровням. */
export function showCatalog(
  state: BotState,
  user: User,
  level?: Level,
  page = 0,
  messageId?: number,
  category?: Category,
) {
  delete user.classContext;
  delete user.schoolCatalog;
  const lessons = availableLessons(state);
  const levels = [...new Set(lessons.map((item) => item.level))].sort();
  if (!level) {
    panel(
      state,
      user,
      `📚 Библиотека английского\n\n🌱 A1 — первые шаги\n🌿 A2 — продолжаем учиться\n🌳 B1 — связная речь и грамматика\n🎓 B2 — сложные конструкции и рассуждения\n\n${lessons.length} тем · выбирай подходящую ниже.\n✅ означает, что ты уже закончил практику по теме.`,
      {
        inline_keyboard: [
          ...levels.map((value) => [
            {
              text: `${value === 'A1' ? '🌱' : '🌿'} ${value} · ${lessons.filter((item) => item.level === value).length} тем`,
              callback_data: `l:${value}:0`,
            },
          ]),
          [
            { text: '🏫 По школьным классам', callback_data: 'book:school' },
            { text: '📚 Учебник', callback_data: 'book' },
          ],
        ],
      },
      messageId,
    );
    return;
  }
  if (!levels.includes(level))
    return send(state, user.id, 'Этот уровень пока не добавлен. Доступные уровни: /topics');
  const levelItems = lessons.filter((item) => item.level === level);
  const items = levelItems.filter((item) => !category || (item.category ?? 'grammar') === category);
  const pageCount = Math.ceil(items.length / 5);
  if (!Number.isInteger(page) || page < 0 || page >= pageCount)
    return send(state, user.id, 'Страница не найдена. Открой /topics');
  user.catalog = { level, page, category: category ?? null };
  const completed = new Set(
    Object.values(state.attempts)
      .filter((item) => item.studentId === user.id && item.completedAt)
      .map((item) => item.lesson.id),
  );
  const rows = items.slice(page * 5, page * 5 + 5).map((item) => [
    {
      text: `${completed.has(item.id) ? '✅' : (item.icon ?? '📘')} ${item.title}`,
      callback_data: `t:${item.id}`,
    },
  ]);
  const navigation = [];
  const prefix = category ? `g:${level}:${category}` : `l:${level}`;
  if (page > 0) navigation.push({ text: '← Назад', callback_data: `${prefix}:${page - 1}` });
  if (page + 1 < pageCount) navigation.push({ text: 'Далее →', callback_data: `${prefix}:${page + 1}` });
  if (navigation.length) rows.push(navigation);
  rows.push([{ text: '🧭 Выбрать раздел курса', callback_data: `groups:${level}` }]);
  if (category) rows.push([{ text: `📚 Все темы ${level}`, callback_data: `l:${level}:0` }]);
  rows.push([
    { text: '📚 Все уровни', callback_data: 'levels' },
    { text: '🏠 Меню', callback_data: 'home' },
  ]);
  panel(
    state,
    user,
    `📚 Темы ${level}\n\n${category ? `${categoryLabels[category]}\n` : ''}📄 Страница ${page + 1} из ${pageCount}\n\n👇 Выбери тему или раздел курса.`,
    { inline_keyboard: rows },
    messageId,
  );
}
