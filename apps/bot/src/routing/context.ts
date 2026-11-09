import { send, panel } from '../ui/messages.js';
import { showLesson } from '../catalog/lesson.js';
import { rolesFor } from '../../../../packages/domain/roles.js';
import { handleEditor } from '../editor.js';
import type {
  BotState,
  TelegramPayload,
  TelegramUpdate,
  ReplyMarkup,
} from '../../../../packages/domain/types.js';

/** Валидация Telegram update и вычисление прав на каждое действие. */
export function createContext(
  state: BotState,
  update: TelegramUpdate,
  teacherIds: string[],
  adminIds: string[],
) {
  if (!Number.isSafeInteger(update.update_id) || update.update_id < state.offset) return;
  state.offset = update.update_id + 1;
  const callback = update.callback_query;
  const message = callback?.message ?? update.message;
  const from = callback?.from ?? message?.from;
  // Учебные ответы и отчёты принимаем только в личном чате.
  if (!from || from.is_bot || message?.chat?.type !== 'private' || message.chat.id !== from.id) return;
  const id = String(from.id);
  const user = (state.users[id] ??= { id, name: from.first_name || 'Ученик', activeAttempt: null });
  user.name = (from.first_name || 'Ученик').slice(0, 80);
  const roles = rolesFor(state, teacherIds, adminIds);
  const teacher = roles.isTeacher(id);
  const admin = roles.isAdmin(id);
  const access = { teacher, admin };
  const classroomContext = {
    teacher,
    admin,
    isTeacher: roles.isTeacher,
    send: (value: string, extra?: TelegramPayload) => send(state, id, value, extra),
    notify: (recipient: string, value: string, extra?: TelegramPayload) =>
      send(state, recipient, value, extra),
    panel: (value: string, markup: ReplyMarkup) =>
      panel(state, user, value, markup, callback?.message?.message_id),
    editor: (value: string) => {
      handleEditor(state, user, value, { teacher, admin, send: (v, extra) => send(state, id, v, extra) });
    },
    topic: (topicId: string) => {
      delete user.schoolCatalog;
      showLesson(state, user, topicId, message?.message_id);
    },
  };

  return { state, update, callback, message, id, user, roles, teacher, admin, access, classroomContext };
}
export type HandlerContext = NonNullable<ReturnType<typeof createContext>>;
export type CallbackContext = HandlerContext & { data: string; messageId?: number };
export type CommandContext = HandlerContext & {
  text: string;
  rawCommand: string;
  command: string;
  argument: string;
};
