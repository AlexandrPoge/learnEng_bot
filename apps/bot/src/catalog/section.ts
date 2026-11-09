import { send, panel } from '../ui/messages.js';
import { catalogReturn, schoolPath } from './context.js';
import { accessibleLesson } from './access.js';
import { sectionCard } from '../navigation.js';
import type { BotState, User, Section } from '../../../../packages/domain/types.js';

/** Чтение правила, примеров и ловушек с сохранением страницы. */
export function showSection(
  state: BotState,
  user: User,
  id: string,
  section: Section,
  page: number,
  messageId?: number,
) {
  const lesson = accessibleLesson(state, user, id);
  if (!lesson) return send(state, user.id, 'Тема не найдена. Открой 📚 Темы.');
  const card = sectionCard(lesson, section, page, user.learningMode !== 'adult', schoolPath(state, user, id));
  if (!card) return send(state, user.id, 'Эта карточка недоступна. Открой тему заново.');
  user.selectedLesson = id;
  user.reading = { lessonId: id, section, page, version: lesson.version };
  const pagination = [];
  if (page > 0) pagination.push({ text: '⬅️ Назад', callback_data: `s:${id}:${section}:${page - 1}` });
  if (page + 1 < card.pages)
    pagination.push({ text: 'Дальше ➡️', callback_data: `s:${id}:${section}:${page + 1}` });
  else if (section !== 'traps')
    pagination.push({
      text: section === 'rule' ? '💡 К примерам' : '⚠️ К ловушкам',
      callback_data: `s:${id}:${section === 'rule' ? 'examples' : 'traps'}:0`,
    });
  const buttons = [
    ...(pagination.length ? [pagination] : []),
    [
      { text: '🗂 Разделы темы', callback_data: `t:${id}` },
      { text: '✏️ Практика', callback_data: `p:${id}` },
    ],
    [
      {
        text: user.schoolCatalog ? '🏫 Темы класса' : `📚 Темы ${lesson.level}`,
        callback_data: catalogReturn(user, lesson.level),
      },
      { text: '🏠 Меню', callback_data: 'home' },
    ],
  ];
  panel(state, user, card, { inline_keyboard: buttons }, messageId);
}
