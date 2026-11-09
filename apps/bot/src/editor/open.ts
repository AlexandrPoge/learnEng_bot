import { findLesson } from './catalog.js';
import { draftButtons } from './controls.js';
import type { EditorBaseRequest } from './request.js';

export function handleEditorOpen(request: EditorBaseRequest): boolean {
  const { state, user, parts, command, draft, send } = request;
  if (command === '/new' || command === '/edit') {
    if (user.workspace) {
      send('Сначала закрой настройку класса или назначения: /cancel_setup');
      return true;
    }
    if (user.activeAttempt) {
      send('Сначала заверши практику или отмени её: /cancel');
      return true;
    }
    if (draft) {
      send('Есть открытый черновик. Сначала /publish или /discard.');
      return true;
    }
    const id = parts[0];
    if (!/^[a-z0-9-]{1,40}$/u.test(id ?? '')) {
      send('Укажи ID латиницей: /edit present-simple или /new my-topic');
      return true;
    }
    const current = findLesson(state, id);
    if (command === '/edit' && !current) {
      send('Тема не найдена. /topics');
      return true;
    }
    if (command === '/new' && current) {
      send('Такой ID уже есть. Используй /edit ID');
      return true;
    }
    (state.editors ??= {})[user.id] = {
      baseVersion: current?.version ?? 0,
      lesson: current
        ? structuredClone(current)
        : {
            id,
            title: '',
            level: 'A1',
            category: 'grammar',
            estimatedMinutes: 7,
            version: 1,
            theory: '',
            questions: [],
          },
      step: null,
    };
    send(
      `✏️ Открыт черновик: ${current?.title ?? id}.\n\nУченики увидят изменения после публикации.\n👇 Что изменить?`,
      { reply_markup: draftButtons() },
    );
    return true;
  }
  return false;
}
