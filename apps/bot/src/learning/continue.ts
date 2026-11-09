import { send, showPanel } from '../ui/messages.js';
import { ask } from '../practice/questions.js';
import { accessibleLesson } from '../catalog/access.js';
import { showSection } from '../catalog/section.js';
import { nextHomeworkPanel, studentHomework } from '../homework.js';
import { button } from '../pagination.js';
import type { BotState, User } from '../../../../packages/domain/types.js';

/** Продолжение: активная попытка, ближайшее ДЗ, чтение, учебник. */
export function showContinue(state: BotState, user: User, messageId?: number) {
  if (user.activeAttempt) {
    return ask(state, user);
  }

  const assignment = studentHomework(state, user).find((item) => !item.completedAt);
  if (assignment) {
    return showPanel(state, user, nextHomeworkPanel(assignment), messageId);
  }

  const saved = user.reading;
  const lesson = saved && accessibleLesson(state, user, saved.lessonId);
  if (saved && lesson) {
    const updated = saved.version !== lesson.version;
    if (updated) {
      send(state, user.id, '📖 Репетитор обновил тему. Открываю раздел с начала.');
    }
    return showSection(state, user, saved.lessonId, saved.section, updated ? 0 : saved.page, messageId);
  }

  showPanel(
    state,
    user,
    {
      text: '📍 Продолжить обучение\n\nОткрой учебник, выбери тему и начни с правила или практики.',
      markup: { inline_keyboard: [[button('📚 Учебник', 'book'), button('🏠 Меню', 'home')]] },
    },
    messageId,
  );
}
