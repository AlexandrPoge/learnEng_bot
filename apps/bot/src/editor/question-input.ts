import { draftButtons } from './controls.js';
import type { EditorContext } from './controls.js';
import type { EditorDraft, Question } from '../../../../packages/domain/types.js';

/** Пошаговый ввод вопроса с проверкой ключа ответа. */
export function addQuestion(draft: EditorDraft, text: string, send: EditorContext['send']) {
  const pending = draft.pending!;
  if (text.length > 1000) {
    send('Сократи ответ до 1000 символов.');
    return;
  }
  if (draft.step === 'type') {
    if (!['choice', 'text'].includes(text.toLowerCase())) {
      send('Отправь choice или text.');
      return;
    }
    pending.type = text.toLowerCase() as Question['type'];
    draft.step = 'prompt';
    send('Отправь формулировку вопроса.');
  } else if (draft.step === 'prompt') {
    pending.prompt = text;
    draft.step = pending.type === 'choice' ? 'options' : 'accepted';
    send(
      pending.type === 'choice'
        ? 'Отправь 2–6 вариантов, каждый с новой строки (до 80 символов на вариант).'
        : 'Отправь допустимые ответы через ; (например: do not; don’t).',
    );
  } else if (draft.step === 'options') {
    const options = text
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean);
    if (
      options.length < 2 ||
      options.length > 6 ||
      options.some((value) => value.length > 80) ||
      new Set(options).size !== options.length
    ) {
      send('Нужно 2–6 разных вариантов до 80 символов, каждый с новой строки.');
      return;
    }
    pending.options = options;
    draft.step = 'accepted';
    send('Отправь номер правильного варианта (1, 2, ...).');
  } else if (draft.step === 'accepted') {
    if (pending.type === 'choice') {
      const index = Number(text) - 1;
      if (!Number.isInteger(index) || !pending.options?.[index]) {
        send('Укажи номер варианта из списка.');
        return;
      }
      pending.accepted = [pending.options[index]];
    } else {
      pending.accepted = text
        .split(';')
        .map((value) => value.trim())
        .filter(Boolean);
      if (!pending.accepted.length || pending.accepted.some((value) => value.length > 300)) {
        send('Каждый допустимый ответ должен быть от 1 до 300 символов.');
        return;
      }
    }
    draft.step = 'explanation';
    send('Объясни правильный ответ и типичную ошибку.');
  } else if (draft.step === 'explanation') {
    const { replaceId, ...question } = pending;
    const complete = { ...question, explanation: text };
    if (replaceId) {
      draft.lesson.questions = draft.lesson.questions.map((item) =>
        item.id === replaceId ? ({ id: replaceId, ...complete } as Question) : item,
      );
    } else {
      let number = 1;
      while (draft.lesson.questions.some((item) => item.id === `q${number}`)) number++;
      draft.lesson.questions.push({ id: `q${number}`, ...complete } as Question);
    }
    draft.step = null;
    delete draft.pending;
    send('✅ Вопрос сохранён в черновике.\n\nДобавь следующий вопрос или опубликуй готовое задание.', {
      reply_markup: draftButtons(),
    });
  }
}
