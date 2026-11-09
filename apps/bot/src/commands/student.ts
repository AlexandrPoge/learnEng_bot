import { send, showPanel } from '../ui/messages.js';
import { showContinue } from '../learning/continue.js';
import { showHome, showMode } from '../ui/home.js';
import { startLesson } from '../practice/start.js';
import type { CommandContext } from '../routing/context.js';
import { homeworkPanel } from '../homework.js';
import { progressPanel } from '../progress.js';

export function handleStudentCommand(request: CommandContext): boolean {
  const { state, id, user, teacher, admin, access, text, command, argument } = request;
  if (command === '/menu') {
    showHome(state, user, access);
    return true;
  }
  if (command === '/continue') {
    showContinue(state, user);
    return true;
  }
  if (command === '/mode') {
    showMode(state, user);
    return true;
  }
  if (command === '/homework' || text === '📝 Домашние задания') {
    showPanel(state, user, homeworkPanel(state, user));
    return true;
  }
  if (command === '/whoami') {
    send(
      state,
      id,
      `Твой Telegram ID: ${id}\nРоль: ${admin ? 'администратор' : teacher ? 'репетитор' : 'ученик'}`,
    );
    return true;
  }
  if (command === '/practice' || text === '▶️ Практика') {
    startLesson(state, user, command === '/practice' ? argument : undefined);
    return true;
  }
  if (command === '/cancel') {
    if (user.activeAttempt) state.attempts[user.activeAttempt].cancelledAt = new Date().toISOString();
    user.activeAttempt = null;
    send(state, id, 'Можно начать новую практику: /practice');
    return true;
  }
  if (command === '/progress' || text === '📊 Мой прогресс') {
    showPanel(state, user, progressPanel(state, user));
    return true;
  }
  return false;
}
