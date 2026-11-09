import type { EditorContext } from './editor/controls.js';
import { handleEditorMenu } from './editor/menu.js';
import { handleEditorHomework } from './editor/homework.js';
import { handleEditorOpen } from './editor/open.js';
import { handleEditorHistory } from './editor/history.js';
import { handleEditorGrades } from './editor/grades.js';
import { handleEditorQuestions } from './editor/questions.js';
import { handleEditorPhoto } from './editor/photo.js';
import { handleEditorInput } from './editor/input.js';
import { handleEditorFields } from './editor/fields.js';
import { handleEditorTheory } from './editor/theory.js';
import { handleEditorQuestionEdit } from './editor/question-edit.js';
import { handleEditorPreview } from './editor/preview.js';
import { handleEditorSave } from './editor/save.js';
import { handleEditorQuestionAnswer } from './editor/question-answer.js';
import type { BotState, User } from '../../../packages/domain/types.js';

export { availableLessons, findLesson } from './editor/catalog.js';
/** Редактор проверяет роль, затем направляет ввод в отдельные операции черновика. */
export function handleEditor(
  state: BotState,
  user: User,
  text: string,
  { teacher, admin, send }: EditorContext,
): boolean {
  const [raw, ...parts] = text.split(/\s+/u);
  const command = raw.split('@')[0].toLowerCase();
  const body = text.slice(raw.length).trim();
  const commands = [
    '/editor',
    '/editor_help',
    '/edit',
    '/new',
    '/new_homework',
    '/edit_homework',
    '/attach_rule',
    '/remove_rule_photo',
    '/questions',
    '/question',
    '/school_grades',
    '/title',
    '/level',
    '/theory',
    '/rule',
    '/examples',
    '/traps',
    '/add_question',
    '/edit_question',
    '/remove_question',
    '/preview',
    '/publish',
    '/discard',
    '/history',
    '/restore',
  ];
  state.editors ??= {};
  const draft = state.editors[user.id];
  if (!commands.includes(command) && !((draft?.step || draft?.inputField) && !text.startsWith('/')))
    return false;
  if (!teacher) {
    send('Редактор доступен репетитору или администратору.');
    return true;
  }
  if (draft?.inputField && !text.startsWith('/')) {
    const field = draft.inputField;
    delete draft.inputField;
    return handleEditor(state, user, `/${field} ${text}`, { teacher, admin, send });
  }
  const request = { state, user, text, raw, parts, command, body, draft, teacher, admin, send };
  if (handleEditorMenu(request)) return true;
  if (handleEditorHomework(request)) return true;
  if (handleEditorOpen(request)) return true;
  if (handleEditorHistory(request)) return true;
  if (!draft) {
    send('Сначала открой /edit ID или /new ID');
    return true;
  }
  const draftRequest = { ...request, draft };
  if (handleEditorGrades(draftRequest)) return true;
  if (handleEditorQuestions(draftRequest)) return true;
  if (handleEditorPhoto(draftRequest)) return true;
  if (handleEditorInput(draftRequest)) return true;
  if (handleEditorFields(draftRequest)) return true;
  if (handleEditorTheory(draftRequest)) return true;
  if (handleEditorQuestionEdit(draftRequest)) return true;
  if (handleEditorPreview(draftRequest)) return true;
  if (handleEditorSave(draftRequest)) return true;
  if (handleEditorQuestionAnswer(draftRequest)) return true;
  return true;
}
