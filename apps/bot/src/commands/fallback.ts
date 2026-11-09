import { send } from '../ui/messages.js';
import { acceptAnswer } from '../practice/answers.js';
import type { CommandContext } from '../routing/context.js';
import { mainMenu } from '../navigation.js';

export function handleFallbackCommand(request: CommandContext): boolean {
  const { state, id, user, access, text } = request;
  if (text.startsWith('/')) {
    send(state, id, 'Неизвестная команда. /help');
    return true;
  }
  if (user.activeAttempt) {
    const attempt = state.attempts[user.activeAttempt];
    if (attempt.lesson.questions[attempt.answers.length].type === 'choice') {
      send(state, id, 'Выбери вариант кнопкой под вопросом.');
      return true;
    }
    if (text.length > 300) {
      send(state, id, 'Ответ слишком длинный. Впиши только пропущенное слово.');
      return true;
    }
    acceptAnswer(state, user, text);
    return true;
  }
  send(state, id, '🧭 Выбери 📚 Темы или ▶️ Практика на кнопках внизу.', { reply_markup: mainMenu(access) });
  return false;
}
