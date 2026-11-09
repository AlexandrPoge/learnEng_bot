import { send, panel } from './messages.js';
import { mainMenu } from '../navigation.js';
import type { BotState, User, Access } from '../../../../packages/domain/types.js';

/** Главное меню и выбор подачи учебного материала. */
export function showHome(state: BotState, user: User, access: Access) {
  delete user.workspace;
  send(
    state,
    user.id,
    `🌟 Английский шаг за шагом\n\n📚 Открой «Учебник».\n🏫 Выбери школьный класс или 🌱 уровень A1–B2.\n📖 Найди тему, прочитай правило и примеры.\n✏️ Закрепи её упражнениями.\n\n${user.learningMode === 'adult' ? '🧑 Подача для взрослых' : '🧒 Простая подача для детей'}\n👇 Всё нужное — на кнопках внизу.`,
    { reply_markup: mainMenu(access) },
  );
}

export function showMode(state: BotState, user: User, messageId?: number) {
  panel(
    state,
    user,
    '⚙️ Как тебе удобнее учиться?\n\n🧒 Для детей — простые подсказки и короткие шаги.\n🧑 Для взрослых — краткие объяснения и формулы.\n\nТемы и задания одинаковые. Выбор можно изменить здесь в любой момент.',
    {
      inline_keyboard: [
        [
          { text: '🧒 Для детей', callback_data: 'mode:child' },
          { text: '🧑 Для взрослых', callback_data: 'mode:adult' },
        ],
        [{ text: '🏠 Главное меню', callback_data: 'home' }],
      ],
    },
    messageId,
  );
}
