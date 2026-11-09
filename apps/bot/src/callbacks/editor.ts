import { send } from '../ui/messages.js';
import type { CallbackContext } from '../routing/context.js';
import { handleEditor } from '../editor.js';

export function handleEditorCallback(request: CallbackContext): boolean {
  const { state, id, user, teacher, admin, data } = request;
  const editMatch = /^edit:([a-z0-9-]{1,40})$/u.exec(data);
  const editPage = /^editlist:(\d+)$/u.exec(data);
  const editorQuestion = /^editor:(q|replace|remove):([a-z0-9-]{1,32})$/u.exec(data);
  if (editorQuestion) {
    const commands = { q: '/question', replace: '/edit_question', remove: '/remove_question' };

    handleEditor(
      state,
      user,
      `${commands[editorQuestion[1] as keyof typeof commands]} ${editorQuestion[2]}`,
      { teacher, admin, send: (value, extra) => send(state, id, value, extra) },
    );
    return true;
  }
  const editActions: Record<string, string> = {
    'editor:type:choice': 'choice',
    'editor:type:text': 'text',
    'editor:photo': '/attach_rule',
    'editor:no-photo': '/remove_rule_photo',
    'editor:preview': '/preview',
    'editor:publish': '/publish',
    'editor:discard': '/discard',
    'editor:add': '/add_question',
    'editor:title': '/title',
    'editor:rule': '/rule',
    'editor:examples': '/examples',
    'editor:traps': '/traps',
    'editor:help': '/editor_help',
  };
  if (data.startsWith('editor:type:') && state.editors?.[id]?.step !== 'type') {
    send(state, id, 'Выбор типа уже завершён. Продолжи текущий вопрос.');
    return true;
  }
  const editorExtra: Record<string, string> = {
    'editor:grades': '/school_grades',
    'editor:back': '/editor',
    'editor:questions': '/questions',
    'editor:level': '/level',
    'editor:level:A1': '/level A1',
    'editor:level:A2': '/level A2',
    'editor:level:B1': '/level B1',
    'editor:level:B2': '/level B2',
  };
  if (Object.hasOwn(editorExtra, data)) {
    handleEditor(state, user, editorExtra[data], {
      teacher,
      admin,
      send: (value, extra) => send(state, id, value, extra),
    });
    return true;
  }
  if (editMatch || editPage || Object.hasOwn(editActions, data)) {
    handleEditor(
      state,
      user,
      editMatch ? `/edit ${editMatch[1]}` : editPage ? `/editor ${editPage[1]}` : editActions[data],
      { teacher, admin, send: (value, extra) => send(state, id, value, extra) },
    );
    return true;
  }
  return false;
}
