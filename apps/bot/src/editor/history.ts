import { findLesson } from './catalog.js';
import { publish } from './publish.js';
import type { EditorBaseRequest } from './request.js';

export function handleEditorHistory(request: EditorBaseRequest): boolean {
  const { state, user, parts, command, admin, send } = request;
  if (command === '/history') {
    const id = parts[0];
    const current = findLesson(state, id);
    if (!current) {
      send('Тема не найдена.');
      return true;
    }
    const records = state.lessonHistory?.[id] ?? [];
    send(
      `${current.title}\nТекущая версия: ${current.version}\n` +
        records
          .map((entry) => `Версия ${entry.lesson.version} · ${entry.savedAt} · редактор ${entry.editedBy}`)
          .join('\n'),
    );
    return true;
  }
  if (command === '/restore') {
    if (!admin) {
      send('Восстановление доступно администратору.');
      return true;
    }
    const [id, version] = parts;
    const entry = state.lessonHistory?.[id]?.find((item) => item.lesson.version === Number(version));
    if (!entry) {
      send('Версия не найдена. Посмотри /history ID');
      return true;
    }
    publish(state, user.id, entry.lesson);
    send(`Восстановлено как новая версия ${findLesson(state, id)!.version}.`);
    return true;
  }
  return false;
}
