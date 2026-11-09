import type { EditorRequest } from './request.js';

export function handleEditorInput(request: EditorRequest): boolean {
  const { command, body, draft, send } = request;
  if (draft.step && ['/add_question', '/edit_question', '/remove_question'].includes(command)) {
    send('Сначала закончи текущий вопрос или закрой черновик: /discard');
    return true;
  }
  if (['/title', '/rule', '/examples', '/traps'].includes(command) && !body) {
    if (draft.step) {
      send('Сначала закончи вопрос.');
      return true;
    }
    draft.inputField = command.slice(1);
    const prompts: Record<string, string> = {
      '/title': '🏷 Отправь новое название.',
      '/rule': '📖 Отправь новое правило короткими абзацами.',
      '/examples': '💡 Отправь примеры. Каждый — с новой строки. Можно добавить перевод через «—».',
      '/traps': '⚠️ Отправь типичные ошибки и как их исправить. Каждый случай — с новой строки.',
    };
    send(prompts[command]);
    return true;
  }
  return false;
}
