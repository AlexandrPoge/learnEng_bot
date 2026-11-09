import type { TelegramPayload } from '../../../../packages/domain/types.js';

/** Команды и кнопки редактора; входные данные не публикуются автоматически. */
export const editorHelp =
  'Редактор:\n/edit ID — открыть урок\n/new ID — новый урок\n/title НАЗВАНИЕ\n/level A1\n/theory ТЕКСТ — правило, примеры, ловушки\n/add_question — добавить вопрос пошагово\n/edit_question q1 — заменить вопрос\n/remove_question q1 — удалить вопрос\n/preview — черновик и ключи\n/publish — опубликовать\n/discard — закрыть черновик\n/history ID — история\n/restore ID ВЕРСИЯ — восстановить (админ)';

export function draftButtons() {
  return {
    inline_keyboard: [
      [
        { text: '🏷 Название', callback_data: 'editor:title' },
        { text: '📖 Правило', callback_data: 'editor:rule' },
      ],
      [
        { text: '🌱 Уровень', callback_data: 'editor:level' },
        { text: '🔧 Изменить вопросы', callback_data: 'editor:questions' },
      ],
      [{ text: '🏫 Школьные классы', callback_data: 'editor:grades' }],
      [
        { text: '💡 Примеры', callback_data: 'editor:examples' },
        { text: '⚠️ Ловушки', callback_data: 'editor:traps' },
      ],
      [
        { text: '🖼 Своя картинка правила', callback_data: 'editor:photo' },
        { text: '🧽 Убрать картинку', callback_data: 'editor:no-photo' },
      ],
      [
        { text: '➕ Вопрос', callback_data: 'editor:add' },
        { text: '👀 Предпросмотр', callback_data: 'editor:preview' },
      ],
      [
        { text: '✅ Опубликовать', callback_data: 'editor:publish' },
        { text: '🗑 Закрыть черновик', callback_data: 'editor:discard' },
      ],
      [{ text: '❓ Все команды', callback_data: 'editor:help' }],
    ],
  };
}

export interface EditorContext {
  teacher: boolean;
  admin: boolean;
  send(text: string, extra?: TelegramPayload): void;
}
