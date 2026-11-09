import { send, panel } from '../ui/messages.js';
import { categoryLabels } from './context.js';
import { availableLessons } from '../editor.js';
import {
  schoolYears,
  schoolLessons,
  grammarStrands,
  lessonStrand,
} from '../../../../packages/content/school.js';
import type { BotState, User, Category, GrammarStrand } from '../../../../packages/domain/types.js';

/** Темы школьного класса с фильтром и сохранением позиции. */
export function showSchool(
  state: BotState,
  user: User,
  grade: number,
  category?: Category | null,
  page = 0,
  messageId?: number,
  strand?: GrammarStrand | 'all',
) {
  const year = schoolYears.find((y) => y.grade === grade);
  if (!year) return send(state, user.id, 'Такой класс не найден. Открой 📚 Учебник.');
  delete user.classContext;
  const all = schoolLessons(grade, availableLessons(state));
  const completed = new Set(
    Object.values(state.attempts)
      .filter((a) => a.studentId === user.id && a.completedAt && !a.reviewOf)
      .map((a) => a.lesson.id),
  );
  const intro = `🏫 Учебник → ${grade} класс\n\n${year.focus}\n📚 Учебная подборка; порядок тем уточняй у репетитора.\n\n✅ Пройдено тем: ${all.filter((l) => completed.has(l.id)).length} из ${all.length}`;
  if (category === undefined) {
    user.schoolCatalog = { grade, category: null, page: 0 };
    const categories = (Object.keys(categoryLabels) as Category[]).filter((c) =>
      all.some((l) => l.category === c),
    );
    return panel(
      state,
      user,
      `${intro}\n\n👇 Выбери раздел.`,
      {
        inline_keyboard: [
          ...categories.map((c) => [
            {
              text: `${categoryLabels[c]} · ${all.filter((l) => l.category === c).length} тем`,
              callback_data: `school:${grade}:${c}:0`,
            },
          ]),
          ...(all.length ? [[{ text: '📚 Все темы класса', callback_data: `school:${grade}:all:0` }]] : []),
          [
            { text: '🏫 Другой класс', callback_data: 'book:school' },
            { text: '🌱 По уровням', callback_data: 'book:levels' },
          ],
        ],
      },
      messageId,
    );
  }
  if (category === 'grammar' && !strand) {
    const grammar = all.filter((l) => l.category === 'grammar');
    user.schoolCatalog = { grade, category, page: 0 };
    return panel(
      state,
      user,
      `${intro}\n\n📖 Грамматика → выбери блок\nКороткие тематические списки помогут найти нужное правило.`,
      {
        inline_keyboard: [
          ...(Object.keys(grammarStrands) as GrammarStrand[])
            .filter((s) => grammar.some((l) => lessonStrand(l) === s))
            .map((s) => [
              {
                text: `${grammarStrands[s]} · ${grammar.filter((l) => lessonStrand(l) === s).length}`,
                callback_data: `schg:${grade}:${s}:0`,
              },
            ]),
          [{ text: '📖 Вся грамматика', callback_data: `schg:${grade}:all:0` }],
          [{ text: `🗂 Разделы ${grade} класса`, callback_data: `school:${grade}` }],
        ],
      },
      messageId,
    );
  }
  const items = all.filter(
    (l) =>
      (!category || l.category === category) && (!strand || strand === 'all' || lessonStrand(l) === strand),
  );
  const pages = Math.max(1, Math.ceil(items.length / 5));
  if (!Number.isInteger(page) || page < 0 || page >= pages)
    return send(state, user.id, 'Страница больше не доступна. Открой класс заново: /school');
  user.schoolCatalog = { grade, category, page, ...(strand ? { strand } : {}) };
  const prefix = strand ? `schg:${grade}:${strand}` : `school:${grade}:${category ?? 'all'}`;
  const arrows = [];
  if (page > 0) arrows.push({ text: '⬅️ Назад', callback_data: `${prefix}:${page - 1}` });
  if (page + 1 < pages) arrows.push({ text: 'Дальше ➡️', callback_data: `${prefix}:${page + 1}` });
  panel(
    state,
    user,
    `${intro}\n\n${strand && strand !== 'all' ? grammarStrands[strand] : category ? categoryLabels[category] : '📚 Все темы класса'}\n📄 Страница ${page + 1} из ${pages}\n\n${items.length ? '👇 Выбери тему.' : 'В этом разделе пока нет тем. Выбери другой раздел или уровень.'}`,
    {
      inline_keyboard: [
        ...items.slice(page * 5, page * 5 + 5).map((l) => [
          {
            text: `${completed.has(l.id) ? '✅' : (l.icon ?? '📘')} ${l.title}`,
            callback_data: `t:${l.id}`,
          },
        ]),
        ...(arrows.length ? [arrows] : []),
        ...(strand ? [[{ text: '📖 Блоки грамматики', callback_data: `school:${grade}:grammar:0` }]] : []),
        [{ text: `🗂 Разделы ${grade} класса`, callback_data: `school:${grade}` }],
        [
          { text: '🏫 Другой класс', callback_data: 'book:school' },
          { text: '📚 Учебник', callback_data: 'book' },
        ],
      ],
    },
    messageId,
  );
}
