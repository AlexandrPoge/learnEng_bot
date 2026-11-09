import { send } from '../ui/messages.js';
import type { HandlerContext } from './context.js';
import { handleCatalogCommand } from '../commands/catalog.js';
import { handleStudentCommand } from '../commands/student.js';
import { handleTeacherCommand } from '../commands/teacher.js';
import { handleAdminCommand } from '../commands/admin.js';
import { handleAssignCommand } from '../commands/assign.js';
import { handleWelcomeCommand } from '../commands/welcome.js';
import { handleConnectionsCommand } from '../commands/connections.js';
import { handleFallbackCommand } from '../commands/fallback.js';
import { handleEditor } from '../editor.js';
import { textActions } from '../navigation.js';
import { handleClassrooms } from '../classrooms.js';

/** Нормализация кнопок в команды, затем редактор и свободные ответы. */
export function handleMessage(context: HandlerContext) {
  const { state, user, id, teacher, admin, message, classroomContext } = context;
  const incoming = message?.text?.trim();
  const text = incoming && Object.hasOwn(textActions, incoming) ? textActions[incoming] : incoming;
  if (!text) {
    const draft = state.editors?.[id];
    const photo = message?.photo?.at(-1);
    if (photo && teacher && draft?.awaitingPhoto) {
      draft.lesson.rulePhoto = photo.file_id;
      delete draft.awaitingPhoto;
      send(state, id, '✅ Картинка сохранена в черновике. Опубликуй изменения, когда всё готово.');
      return handleEditor(state, user, '/editor', {
        teacher,
        admin,
        send: (value, extra) => send(state, id, value, extra),
      });
    }
    send(
      state,
      id,
      photo
        ? 'Для картинки сначала открой черновик и нажми «🖼 Своя картинка правила».'
        : 'Используй текстовые ответы и кнопки. /help',
    );
    return;
  }
  if (text.startsWith('/')) user.searching = false;
  if (handleClassrooms(state, user, { text }, classroomContext)) return;
  const [rawCommand, argument] = text.split(/\s+/u);
  const command = rawCommand.split('@')[0].toLowerCase();
  const request = { ...context, text, rawCommand, argument, command };
  if (handleCatalogCommand(request)) return;
  if (handleStudentCommand(request)) return;
  if (handleTeacherCommand(request)) return;
  if (handleAdminCommand(request)) return;
  if (
    handleEditor(state, user, text, { teacher, admin, send: (value, extra) => send(state, id, value, extra) })
  )
    return;
  if (handleAssignCommand(request)) return;
  if (handleWelcomeCommand(request)) return;
  if (handleConnectionsCommand(request)) return;
  if (handleFallbackCommand(request)) return;
}
