/** Типы области: telegram. Сериализуемые данные совместимы с прежним хранилищем. */
export interface TextEntity {
  type: 'bold' | 'code';
  offset: number;
  length: number;
}

export interface RichText {
  text: string;
  entities: TextEntity[];
}

export interface InlineButton {
  text: string;
  callback_data?: string;
  url?: string;
}

export interface ReplyMarkup {
  inline_keyboard?: InlineButton[][];
  keyboard?: string[][];
  resize_keyboard?: boolean;
}

export interface TelegramPayload {
  [key: string]: unknown;
  chat_id?: string | number;
  text?: string;
  entities?: TextEntity[];
  message_id?: number;
  callback_query_id?: string;
  reply_markup?: ReplyMarkup;
}

export interface TelegramPerson {
  id: number;
  first_name?: string;
  username?: string;
  is_bot?: boolean;
}

export interface TelegramMessage {
  message_id?: number;
  chat: { id: number; type: string };
  from?: TelegramPerson;
  text?: string;
  entities?: TextEntity[];
  reply_markup?: ReplyMarkup;
  photo?: { file_id: string; width: number; height: number }[];
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: { id: string; from: TelegramPerson; message?: TelegramMessage; data?: string };
}

export interface BotCommand {
  command: string;
  description: string;
}

export interface TelegramResults {
  getMe: TelegramPerson;
  getWebhookInfo: { url: string; pending_update_count: number };
  getUpdates: TelegramUpdate[];
  getMyCommands: BotCommand[];
  sendMessage: TelegramMessage;
  sendPhoto: TelegramMessage;
  editMessageText: TelegramMessage;
  editMessageReplyMarkup: TelegramMessage;
  answerCallbackQuery: boolean;
  setMyName: boolean;
  setMyDescription: boolean;
  setMyShortDescription: boolean;
  setMyCommands: boolean;
  setWebhook: boolean;
  deleteWebhook: boolean;
}

export type TelegramApi = <M extends keyof TelegramResults>(
  method: M,
  payload?: TelegramPayload,
  signal?: AbortSignal,
) => Promise<TelegramResults[M]>;
