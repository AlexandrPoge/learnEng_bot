import { addQuestion } from './question-input.js';
import type { EditorRequest } from './request.js';

export function handleEditorQuestionAnswer(request: EditorRequest): boolean {
  const { text, draft, send } = request;
  if (draft.step && !text.startsWith('/')) {
    addQuestion(draft, text, send);
    return true;
  }
  return false;
}
