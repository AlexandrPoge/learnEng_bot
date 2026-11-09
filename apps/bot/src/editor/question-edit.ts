import { draftButtons } from './controls.js';
import type { EditorRequest } from './request.js';

export function handleEditorQuestionEdit(request: EditorRequest): boolean {
  const { parts, command, draft, send } = request;
  if (command === '/add_question' || command === '/edit_question') {
    if (command === '/add_question' && draft.lesson.questions.length >= 20) {
      send('В одном уроке максимум 20 вопросов.');
      return true;
    }
    if (command === '/edit_question' && !draft.lesson.questions.some((item) => item.id === parts[0])) {
      send('ID вопроса не найден. Посмотри /preview');
      return true;
    }
    delete draft.inputField;
    draft.pending = { replaceId: command === '/edit_question' ? parts[0] : null };
    draft.step = 'type';
    send('Выбери тип вопроса.', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔘 Варианты ответа', callback_data: 'editor:type:choice' },
            { text: '⌨️ Вписать ответ', callback_data: 'editor:type:text' },
          ],
        ],
      },
    });
    return true;
  }
  if (command === '/remove_question') {
    const before = draft.lesson.questions.length;
    draft.lesson.questions = draft.lesson.questions.filter((item) => item.id !== parts[0]);
    send(before === draft.lesson.questions.length ? 'ID вопроса не найден.' : 'Вопрос удалён из черновика.', {
      reply_markup: draftButtons(),
    });
    return true;
  }
  return false;
}
