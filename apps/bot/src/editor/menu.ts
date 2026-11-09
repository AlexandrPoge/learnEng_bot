import { availableLessons } from './catalog.js';
import { editorHelp, draftButtons } from './controls.js';
import type { EditorBaseRequest } from './request.js';

export function handleEditorMenu(request: EditorBaseRequest): boolean {
  const { state, user, parts, command, draft, send } = request;
  if (command === '/editor_help') {
    send(
      editorHelp +
        '\n/rule ТЕКСТ — только правило\n/examples ТЕКСТ — только примеры\n/traps ТЕКСТ — только ловушки',
    );
    return true;
  }
  if (command === '/editor') {
    if (draft) {
      send(`✏️ Черновик: ${draft.lesson.title || draft.lesson.id}\n\n👇 Выбери, что изменить.`, {
        reply_markup: draftButtons(),
      });
      return true;
    }
    const items = availableLessons(state);
    const page = Number(parts[0] ?? 0);
    if (!Number.isInteger(page) || page < 0 || page >= Math.ceil(items.length / 5)) {
      send('Страница не найдена. /editor');
      return true;
    }
    const rows = items
      .slice(page * 5, page * 5 + 5)
      .map((item) => [{ text: `${item.icon ?? '📘'} ${item.title}`, callback_data: `edit:${item.id}` }]);
    const arrows = [];
    if (page > 0) arrows.push({ text: '⬅️ Назад', callback_data: `editlist:${page - 1}` });
    if ((page + 1) * 5 < items.length)
      arrows.push({ text: 'Дальше ➡️', callback_data: `editlist:${page + 1}` });
    if (arrows.length) rows.push(arrows);
    rows.push([
      { text: '❓ Все команды', callback_data: 'editor:help' },
      { text: '🏠 Меню', callback_data: 'home' },
    ]);
    send(
      '✏️ Редактор уроков\n\n👇 Выбери тему для правки.\n➕ Новый урок: /new ID_ЛАТИНИЦЕЙ\n📦 Правки сохраняются в черновике до публикации.',
      { reply_markup: { inline_keyboard: rows } },
    );
    return true;
  }
  if (command === '/discard') {
    delete state.editors?.[user.id];
    send('Черновик закрыт.');
    return true;
  }
  return false;
}
