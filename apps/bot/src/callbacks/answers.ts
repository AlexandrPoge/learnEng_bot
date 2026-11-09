import { send } from '../ui/messages.js';
import { acceptAnswer } from '../practice/answers.js';
import type { CallbackContext } from '../routing/context.js';

export function handleAnswersCallback(request: CallbackContext): boolean {
  const { state, callback, id, user } = request;
  const [, attemptId, index, optionIndex] =
    /^a:([a-f0-9]{16}):(\d+):(\d+)$/u.exec(callback!.data ?? '') ?? [];
  const attempt = user.activeAttempt ? state.attempts[user.activeAttempt] : undefined;
  if (!attempt || attempt.id !== attemptId || attempt.answers.length !== Number(index)) {
    send(state, id, 'Эта кнопка уже неактуальна. Открой текущий вопрос: /practice');
    return true;
  }
  const question = attempt.lesson.questions[Number(index)];
  const answer = question.type === 'choice' ? question.options[Number(optionIndex)] : undefined;
  if (answer !== undefined) {
    acceptAnswer(state, user, answer);
    return true;
  }
  return true;
}
