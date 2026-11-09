import { showPanel } from '../ui/messages.js';
import { showContinue } from '../learning/continue.js';
import { showHome } from '../ui/home.js';
import type { CallbackContext } from '../routing/context.js';
import { homeworkPanel } from '../homework.js';
import { progressPanel } from '../progress.js';

export function handleStudentCallback(request: CallbackContext): boolean {
  const { state, user, access, data, messageId } = request;
  if (data === 'home') {
    showHome(state, user, access);
    return true;
  }
  if (data === 'continue') {
    showContinue(state, user, messageId);
    return true;
  }
  const progressPage = /^progress:(history|weak):(\d+)$/u.exec(data);
  if (progressPage) {
    showPanel(
      state,
      user,
      progressPanel(state, user, progressPage[1] as 'history' | 'weak', Number(progressPage[2])),
      messageId,
    );
    return true;
  }
  const homeworkPage = /^homework:(all|pending|submitted):(\d+)$/u.exec(data);
  if (homeworkPage) {
    showPanel(
      state,
      user,
      homeworkPanel(state, user, homeworkPage[1] as 'all' | 'pending' | 'submitted', Number(homeworkPage[2])),
      messageId,
    );
    return true;
  }
  return false;
}
