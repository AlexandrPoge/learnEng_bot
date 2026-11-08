import { setTimeout as delay } from 'node:timers/promises';
import { readConfig } from './config.mjs';
import { openStore } from './store.mjs';
import { telegramClient } from './telegram.mjs';
import { handleUpdate } from './handler.mjs';
import { rolesFor } from '../../../packages/domain/roles.mjs';

async function run() {
  const config = readConfig();
  const api = telegramClient(config.token);
  const store = await openStore(config.dataFile);
  const controller = new AbortController();
  const stop = () => controller.abort();
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);

  async function flush() {
    while (store.state.outbox.length && !controller.signal.aborted) {
      const task = store.state.outbox[0];
      // Отзыв доступа действует также на ещё не доставленные отчёты.
      if ((task.requiredTeacher || task.payload.text?.startsWith('Новое выполненное задание')) && !rolesFor(store.state, config.teacherIds, config.adminIds).isTeacher(String(task.payload.chat_id))) {
        const next = structuredClone(store.state);
        next.outbox.shift();
        await store.commit(next);
        continue;
      }
      try { await api(task.method, task.payload, controller.signal); }
      catch (error) {
        // Недоступный чат или истёкший callback не блокируют остальные отчёты.
        if (![400, 403].includes(error.code)) throw error;
        console.warn(`Сообщение не доставлено: ${error.message}`);
      }
      const next = structuredClone(store.state);
      next.outbox.shift();
      await store.commit(next);
    }
  }

  try {
    const info = await api('getWebhookInfo');
    if (info.url) throw new Error('У бота установлен webhook. Для long polling отключите его или используйте отдельного тестового бота.');
    const me = await api('getMe');
    console.log(`Бот @${me.username} запущен. Остановка: Ctrl+C`);
    while (!controller.signal.aborted) {
      try {
        await flush();
        const updates = await api('getUpdates', {
          offset: store.state.offset, timeout: 30, allowed_updates: ['message', 'callback_query'],
        }, controller.signal);
        for (const update of updates) {
          if (controller.signal.aborted) break;
          const next = structuredClone(store.state);
          handleUpdate(next, update, config.teacherIds, config.adminIds);
          await store.commit(next);
          await flush();
        }
      } catch (error) {
        if (controller.signal.aborted) break;
        if ([401, 409].includes(error.code)) throw error;
        console.error(error.message);
        await delay(Math.min(60, Math.max(3, error.retryAfter ?? 3)) * 1000, undefined, { signal: controller.signal }).catch(() => {});
      }
    }
  } finally { await store.close(); }
}

run().catch((error) => { console.error(error.message); process.exitCode = 1; });
