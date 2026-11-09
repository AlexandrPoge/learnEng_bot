import { randomUUID } from 'node:crypto';
import { splitMessage } from '../format.js';
import type { PanelContent } from '../pagination.js';
import type {
  BotState,
  User,
  RichText,
  TelegramPayload,
  TelegramResults,
  ReplyMarkup,
} from '../../../../packages/domain/types.js';

/** Очередь исходящих сообщений и единый способ показать карточку. */
export function enqueue(
  state: BotState,
  method: keyof TelegramResults,
  payload: TelegramPayload,
  requiredTeacher = false,
) {
  state.outbox.push({ id: randomUUID(), method, payload, requiredTeacher });
}

export function send(
  state: BotState,
  chatId: string,
  text: string | RichText,
  extra: TelegramPayload & { requiredTeacher?: boolean } = {},
) {
  const { requiredTeacher = false, ...telegramExtra } = extra;
  const content = typeof text === 'string' ? { text, entities: [] } : text;
  const chunks = splitMessage(content.text, content.entities);
  for (const [index, chunk] of chunks.entries()) {
    const options = { ...telegramExtra };
    if (index !== chunks.length - 1) delete options.reply_markup;
    enqueue(state, 'sendMessage', { chat_id: chatId, ...chunk, ...options }, requiredTeacher);
  }
}

export function panel(
  state: BotState,
  user: User,
  text: string | RichText,
  replyMarkup: ReplyMarkup,
  messageId?: number,
) {
  // Изменение старой карточки не прокручивает Telegram. Новый экран всегда
  // приходит вниз чата, а навигация предыдущего экрана отключается.
  if (messageId)
    enqueue(state, 'editMessageReplyMarkup', {
      chat_id: user.id,
      message_id: messageId,
      reply_markup: { inline_keyboard: [] },
    });
  send(state, user.id, text, { reply_markup: replyMarkup, link_preview_options: { is_disabled: true } });
}

export function showPanel(state: BotState, user: User, content: PanelContent, messageId?: number) {
  panel(state, user, content.text, content.markup, messageId);
}
