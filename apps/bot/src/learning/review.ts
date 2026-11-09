import { send, panel } from '../ui/messages.js';
import { button } from '../pagination.js';
import type { BotState, User } from '../../../../packages/domain/types.js';

/** Приватный разбор по сохранённому снимку завершённой попытки. */
export function showReview(state: BotState, user: User, attemptId: string, index = 0, messageId?: number) {
  const attempt = state.attempts[attemptId];
  if (
    !attempt ||
    attempt.studentId !== user.id ||
    !attempt.completedAt ||
    !Number.isSafeInteger(index) ||
    index < 0 ||
    !attempt.answers[index]
  ) {
    return send(state, user.id, 'Разбор доступен после завершения твоей практики.');
  }

  const answer = attempt.answers[index];
  const question = attempt.lesson.questions[index];
  const arrows = [];
  if (index > 0) {
    arrows.push(button('⬅️ Назад', `review:${attempt.id}:${index - 1}`));
  }
  if (index + 1 < attempt.answers.length) {
    arrows.push(button('Дальше ➡️', `review:${attempt.id}:${index + 1}`));
  }

  panel(
    state,
    user,
    `🔎 Разбор · ${index + 1}/${attempt.answers.length}\n\n${question.prompt}\n\n⌨️ Твой ответ: ${answer.value}\n${answer.correct ? '✅ Верно' : `✏️ Правильно: ${question.accepted[0]}`}\n\n💡 ${question.explanation}`,
    {
      inline_keyboard: [
        ...(arrows.length ? [arrows] : []),
        [button('📊 Мой прогресс', 'progress:history:0'), button('📝 Мои задания', 'homework:all:0')],
        [button('📚 Учебник', 'book'), button('🏠 Меню', 'home')],
      ],
    },
    messageId,
  );
}
