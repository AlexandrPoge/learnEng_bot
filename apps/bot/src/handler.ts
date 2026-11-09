import { createContext } from './routing/context.js';
import { handleCallback } from './routing/callbacks.js';
import { handleMessage } from './routing/messages.js';
import type { BotState, TelegramUpdate } from '../../../packages/domain/types.js';

/** Публичная точка входа: проверяет update и передаёт его нужному маршрутизатору. */
export function handleUpdate(
  state: BotState,
  update: TelegramUpdate,
  teacherIds: string[] = [],
  adminIds: string[] = [],
) {
  const context = createContext(state, update, teacherIds, adminIds);
  if (!context) return;
  if (context.callback) handleCallback(context);
  else handleMessage(context);
}
