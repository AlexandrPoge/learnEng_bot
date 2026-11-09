import { send, panel } from '../ui/messages.js';
import type { CallbackContext } from '../routing/context.js';
import { lessonSections } from '../../../../packages/content/presentation.js';
import { richText, readable } from '../format.js';
import { recordActivity } from '../../../../packages/domain/timing.js';

export function handleHintsCallback(request: CallbackContext): boolean {
  const { state, id, user, data } = request;
  const hintMatch = /^hint:([a-f0-9]{16}):(\d+)$/u.exec(data);
  if (hintMatch) {
    const attempt = user.activeAttempt ? state.attempts[user.activeAttempt] : undefined;
    if (!attempt || attempt.id !== hintMatch[1] || attempt.answers.length !== Number(hintMatch[2])) {
      send(state, id, 'Подсказка относится к прошлому вопросу. Продолжить: /practice');
      return true;
    }
    if (attempt.mode === 'test') {
      send(state, id, 'В проверочной подсказки закрыты. Разбор появится после сдачи.');
      return true;
    }
    recordActivity(attempt);
    attempt.hintsUsed ??= [];
    if (!attempt.hintsUsed.includes(attempt.answers.length)) attempt.hintsUsed.push(attempt.answers.length);
    const hintCard = richText()
      .add('💡 Подсказка', 'bold')
      .add(`\n\n${attempt.lesson.title}\n\n`)
      .add(readable(attempt.lesson.memory ?? lessonSections(attempt.lesson).rule[0]), 'code')
      .add('\n\n🧭 Как выбрать ответ\n', 'bold')
      .add(
        '1. Определи, о ком или о чём речь.\n2. Сравни форму с правилом.\n3. Вернись к вопросу и попробуй.',
      )
      .build();

    panel(state, user, hintCard, {
      inline_keyboard: [[{ text: '✏️ Вернуться к вопросу', callback_data: `p:${attempt.lesson.id}` }]],
    });
    return true;
  }
  return false;
}
