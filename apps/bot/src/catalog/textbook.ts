import { panel } from '../ui/messages.js';
import { schoolYears } from '../../../../packages/content/school.js';
import type { BotState, User } from '../../../../packages/domain/types.js';

/** Выбор маршрута учебника и школьного класса. */
export function showTextbook(state: BotState, user: User, messageId?: number) {
  delete user.classContext;
  delete user.schoolCatalog;
  panel(
    state,
    user,
    '📚 Учебник английского\n\n🏫 По школьным классам\nПодборки от первых слов до сложной грамматики и письма.\n\n🌱 По уровням\nA1 — первые шаги. A2 — основа.\nB1 — связная речь. B2 — сложные конструкции.\n\nВ каждой теме: правило, картинки, примеры, ловушки и упражнения.\n\n👇 Как будем искать тему?',
    {
      inline_keyboard: [
        [{ text: '🏫 По школьным классам', callback_data: 'book:school' }],
        [{ text: '🌱 По уровням A1–B2', callback_data: 'book:levels' }],
        [{ text: '🏠 Главное меню', callback_data: 'home' }],
      ],
    },
    messageId,
  );
}

export function showSchoolYears(state: BotState, user: User, messageId?: number) {
  delete user.classContext;
  delete user.schoolCatalog;
  const rows = [];
  for (let i = 0; i < schoolYears.length; i += 2)
    rows.push(
      schoolYears.slice(i, i + 2).map((y) => ({
        text: `${y.grade} класс${y.revision ? ' · повторение' : ''}`,
        callback_data: `school:${y.grade}`,
      })),
    );
  panel(
    state,
    user,
    '🏫 Учебник → школьные классы\n\nВыбери класс → раздел → тематический блок → тему. Учебную группу создавать не нужно.\n\n📚 В младших классах — первые слова и простые фразы. В старших добавлены темы B1–B2.\n\nПодборки ориентировочные: программа твоей школы может отличаться. Это растущая библиотека, а не полный школьный учебник.',
    {
      inline_keyboard: [
        ...rows,
        [
          { text: '🌱 По уровням', callback_data: 'book:levels' },
          { text: '📚 Учебник', callback_data: 'book' },
        ],
      ],
    },
    messageId,
  );
}
