import type { EditorRequest } from './request.js';

export function handleEditorQuestions(request: EditorRequest): boolean {
  const { parts, command, draft, send } = request;
  if (command === '/questions' || command === '/question') {
    if (draft.step || draft.inputField || draft.awaitingPhoto) {
      send('Сначала закончи текущее поле, картинку или вопрос.');
      return true;
    }
    if (command === '/questions') {
      send('🔧 Вопросы черновика\n\nВыбери вопрос для правки или удаления.', {
        reply_markup: {
          inline_keyboard: [
            ...draft.lesson.questions.map((q, i) => [
              { text: `${i + 1}. ${q.prompt.slice(0, 60)}`, callback_data: `editor:q:${q.id}` },
            ]),
            [
              { text: '➕ Новый вопрос', callback_data: 'editor:add' },
              { text: '✏️ К черновику', callback_data: 'editor:back' },
            ],
          ],
        },
      });
    } else {
      const q = draft.lesson.questions.find((q) => q.id === parts[0]);
      if (!q) {
        send('Вопрос не найден в черновике.');
        return true;
      }
      send(
        `🔧 ${q.prompt}\n\n${q.options?.join('\n') ?? 'Ответ вводится текстом'}\n\n🔑 Ключ: ${q.accepted.join(' / ')}\n💡 ${q.explanation}\n\nУдаление уберёт вопрос только из черновика.`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '✏️ Заменить вопрос', callback_data: `editor:replace:${q.id}` }],
              [{ text: '🗑 Удалить из черновика', callback_data: `editor:remove:${q.id}` }],
              [{ text: '🔧 Все вопросы', callback_data: 'editor:questions' }],
            ],
          },
        },
      );
    }
    return true;
  }
  return false;
}
