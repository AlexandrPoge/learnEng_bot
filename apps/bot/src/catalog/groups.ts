import { panel } from '../ui/messages.js';
import { categoryLabels } from './context.js';
import { availableLessons } from '../editor.js';
import type { BotState, User, Category, Level } from '../../../../packages/domain/types.js';

/** Разделы курса внутри уровня. */
export function showGroups(state: BotState, user: User, level: Level, messageId?: number) {
  delete user.schoolCatalog;
  delete user.classContext;
  const items = availableLessons(state).filter((item) => item.level === level);
  const groups = (Object.keys(categoryLabels) as Category[]).filter((category) =>
    items.some((item) => (item.category ?? 'grammar') === category),
  );
  panel(
    state,
    user,
    `🧭 Курс ${level}\n\n🔤 Первые шаги — алфавит, знакомство, числа.\n\n📖 Грамматика — как строить предложения.\n\n🧺 Слова — семья, дом, еда и другие темы.\n\n💬 Общение — полезные ситуации.\n\n👇 Выбери раздел.`,
    {
      inline_keyboard: [
        ...groups.map((category) => [
          {
            text: `${categoryLabels[category]} · ${items.filter((item) => (item.category ?? 'grammar') === category).length} тем`,
            callback_data: `g:${level}:${category}:0`,
          },
        ]),
        [
          { text: '📚 Все темы', callback_data: `l:${level}:0` },
          { text: '🏠 Меню', callback_data: 'home' },
        ],
      ],
    },
    messageId,
  );
}
