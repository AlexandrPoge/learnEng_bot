import { handleUpdate } from '../../bot/src/handler.js';
import { rolesFor } from '../../../packages/domain/roles.js';
import type { BotState, OutboxTask, TelegramApi, TelegramUpdate } from '../../../packages/domain/types.js';
import { SqlStore } from './sql-store.js';

type Delivery = (state: BotState, task: OutboxTask, api: TelegramApi) => Promise<{ key: string; fileId: string } | undefined>;
export async function processPending(store: SqlStore, api: TelegramApi, deliver: Delivery, teacherIds: string[], adminIds: string[]) {
  let state = store.load();
  for (const row of store.pending()) {
    const update: TelegramUpdate = JSON.parse(row.payload);
    const next = structuredClone(state);
    // Persisted ledger deduplicates delivery; independent updates may arrive out of order.
    next.offset = Math.min(next.offset, update.update_id);
    handleUpdate(next, update, teacherIds, adminIds);
    next.offset = Math.max(state.offset, next.offset);
    store.applied(row.id, state, next); state = next;
  }
  const retryAt = Number(store.setting('retryAt') ?? 0);
  if (Date.now() < retryAt) return { pending: true, retryMs: retryAt - Date.now() };
  for (let sent = 0; sent < 15 && state.outbox.length; sent++) {
    const callback = state.outbox.findIndex(t => t.method === 'answerCallbackQuery');
    const index = callback >= 0 ? callback : 0;
    const task = state.outbox[index];
    let cache: { key: string; fileId: string } | undefined;
    const allowed = !task.requiredTeacher || rolesFor(state, teacherIds, adminIds).isTeacher(String(task.payload.chat_id));
    if (allowed) {
      try { cache = await deliver(state, task, api); }
      catch (error) {
        if (![400, 403].includes(error.code)) {
          const retryMs = Math.max(5_000, Number(error.retryAfter ?? 10) * 1000);
          store.set('retryAt', String(Date.now() + retryMs));
          return { pending: true, retryMs };
        }
      }
    }
    const next = structuredClone(state); next.outbox.splice(index, 1);
    if (cache) (next.ruleImages ??= {})[cache.key] = cache.fileId;
    store.storage.transactionSync(() => store.save(state, next)); state = next;
  }
  return { pending: state.outbox.length > 0 || store.pending().length > 0, retryMs: 1000 };
}
