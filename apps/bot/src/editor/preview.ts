import type { EditorRequest } from './request.js';

export function handleEditorPreview(request: EditorRequest): boolean {
  const { command, draft, send } = request;
  if (command === '/preview') {
    send(
      `${draft.lesson.title || '(без названия)'} · ${draft.lesson.level}\n\n${draft.lesson.theory || '(нет объяснения)'}`,
    );
    for (const item of draft.lesson.questions)
      send(
        `${item.id}. ${item.prompt}\n${item.options?.map((option, index) => `${index + 1}. ${option}`).join('\n') ?? ''}\nКлюч: ${item.accepted.join(' / ')}\n${item.explanation}`,
      );
    if (draft.step) send(`Добавление вопроса не закончено: ${draft.step}. Продолжи или /discard.`);
    return true;
  }
  return false;
}
