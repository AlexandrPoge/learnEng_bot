import { send, panel } from '../ui/messages.js';
import { catalogReturn, schoolPath } from './context.js';
import { accessibleLesson } from './access.js';
import { availableLessons } from '../editor.js';
import { topicButtons, topicCard } from '../navigation.js';
import type { BotState, User } from '../../../../packages/domain/types.js';

/** Карточка темы и её основные действия. */
export function showLesson(state: BotState, user: User, id: string, messageId?: number) {
  const lesson = accessibleLesson(state, user, id);
  if (!lesson) return send(state, user.id, 'Тема не найдена. Выбери тему: /topics');
  user.selectedLesson = id;
  const page = Math.floor(
    availableLessons(state)
      .filter((item) => item.level === lesson.level)
      .findIndex((item) => item.id === id) / 5,
  );
  const path = schoolPath(state, user, id);
  panel(
    state,
    user,
    topicCard(lesson, user.learningMode !== 'adult', path),
    topicButtons(
      lesson,
      page,
      user.classContext || user.catalog || user.schoolCatalog ? catalogReturn(user, lesson.level) : undefined,
    ),
    messageId,
  );
}
