import { send, panel } from '../ui/messages.js';
import { showTextbook, showSchoolYears } from '../catalog/textbook.js';
import { showSchool } from '../catalog/school.js';
import { showResults } from '../teacher/results.js';
import { showNotifications } from '../teacher/notifications.js';
import { showCatalog } from '../catalog/levels.js';
import { showLesson } from '../catalog/lesson.js';
import type { CommandContext } from '../routing/context.js';
import { availableLessons } from '../editor.js';
import type { Level } from '../../../../packages/domain/types.js';

export function handleCatalogCommand(request: CommandContext): boolean {
  const { state, id, user, access, text, rawCommand, command, argument } = request;
  if (command === '/textbook') {
    showTextbook(state, user);
    return true;
  }
  if (command === '/notifications') {
    showNotifications(state, user, access);
    return true;
  }
  if (command === '/results') {
    showResults(state, user, access);
    return true;
  }
  if (command === '/school') {
    argument ? showSchool(state, user, Number(argument)) : showSchoolYears(state, user);
    return true;
  }
  if (command === '/search' || (user.searching && !text.startsWith('/'))) {
    delete user.schoolCatalog;
    delete user.classContext;
    const query = command === '/search' ? text.slice(rawCommand.length).trim() : text;
    user.searching = !query;
    if (!query) {
      send(
        state,
        id,
        '🔎 Напиши название или слово из темы.\n\nНапример:\n• семья\n• артикли\n• Past Simple\n\nДля выхода нажми 🏠 Главное меню.',
      );
      return true;
    }
    const normalized = query.toLocaleLowerCase('ru');
    const found = availableLessons(state).filter((item) =>
      `${item.title} ${item.id}`.toLocaleLowerCase('ru').includes(normalized),
    );

    panel(
      state,
      user,
      found.length
        ? `🔎 Найдено тем: ${found.length}\n\n👇 Выбери тему.${found.length > 8 ? '\nПоказаны первые 8 — уточни запрос для остальных.' : ''}`
        : '🔎 Пока ничего не нашлось.\nПопробуй другое слово: /search запрос',
      {
        inline_keyboard: [
          ...found
            .slice(0, 8)
            .map((item) => [{ text: `${item.icon ?? '📘'} ${item.title}`, callback_data: `t:${item.id}` }]),
          [{ text: '📚 Все темы', callback_data: 'levels' }],
        ],
      },
    );
    return true;
  }
  if (command === '/topics' || text === '📚 Темы') {
    showCatalog(state, user, command === '/topics' ? (argument?.toUpperCase() as Level) : undefined);
    return true;
  }
  if (command === '/lesson') {
    if (!argument) {
      showCatalog(state, user);
      return true;
    }
    showLesson(state, user, argument);
    return true;
  }
  return false;
}
