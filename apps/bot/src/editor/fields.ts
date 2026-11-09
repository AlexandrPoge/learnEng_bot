import { draftButtons } from './controls.js';
import type { EditorRequest } from './request.js';
import type { Level } from '../../../../packages/domain/types.js';

export function handleEditorFields(request: EditorRequest): boolean {
  const { command, body, draft, send } = request;
  if (command === '/title') {
    if (!body || body.length > 100) send('Название: от 1 до 100 символов.');
    else {
      draft.lesson.title = body;
      send(
        '🏷 Название сохранено.\n\nДобавь вопрос кнопкой «➕ Вопрос», затем сохрани готовое ДЗ кнопкой «✅ Опубликовать».',
        { reply_markup: draftButtons() },
      );
    }
    return true;
  }
  if (command === '/level') {
    if (!body) {
      send('🌱 Выбери уровень задания.', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'A1', callback_data: 'editor:level:A1' },
              { text: 'A2', callback_data: 'editor:level:A2' },
            ],
            [
              { text: 'B1', callback_data: 'editor:level:B1' },
              { text: 'B2', callback_data: 'editor:level:B2' },
            ],
          ],
        },
      });
      return true;
    }
    const level = body.toUpperCase();
    if (!['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(level)) send('Укажи уровень A1–C2.');
    else {
      draft.lesson.level = level as Level;
      send('Уровень сохранён.', { reply_markup: draftButtons() });
    }
    return true;
  }
  return false;
}
