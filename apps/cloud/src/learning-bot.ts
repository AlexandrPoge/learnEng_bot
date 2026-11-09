import type { Env, Context } from './environment.js';
import { json } from './http.js';
import { SqlStore } from './sql-store.js';
import { matches, validUpdate, validateImport, fingerprint } from './security.js';
import { processPending } from './processor.js';
import { cloudDelivery } from './delivery.js';
import { telegramClient } from '../../bot/src/telegram.js';
import { readConfig } from '../../bot/src/config.js';

/** Последовательная обработка событий, состояние и повторная доставка. */
export class LearningBot {
  private readonly store: SqlStore;
  private serial: Promise<unknown> = Promise.resolve();
  constructor(
    private ctx: Context,
    private env: Env,
  ) {
    this.store = new SqlStore(ctx.storage);
  }
  private exclusive<T>(fn: () => Promise<T>): Promise<T> {
    const next = this.serial.then(fn);
    this.serial = next.catch(() => {});
    return next;
  }
  async fetch(request: Request) {
    return this.exclusive(async () => {
      const path = new URL(request.url).pathname;
      const authorized =
        path === '/telegram'
          ? matches(request.headers.get('X-Telegram-Bot-Api-Secret-Token'), this.env.WEBHOOK_SECRET)
          : matches(request.headers.get('Authorization'), `Bearer ${this.env.CLOUD_ADMIN_KEY}`);
      if (!authorized) return json({ error: 'unauthorized' }, 403);
      if (Number(request.headers.get('Content-Length') ?? 0) > 20_000_000)
        return json({ error: 'too_large' }, 413);
      if (path === '/admin/import' && request.method === 'POST') {
        if (this.store.initialized()) return json({ error: 'already_initialized' }, 409);
        let state: unknown;
        try {
          state = await request.json();
          validateImport(state);
        } catch {
          return json({ error: 'invalid_snapshot' }, 400);
        }
        this.store.import(state);
        return json({ ok: true, fingerprint: fingerprint(this.store.load()) });
      }
      if (path === '/admin/status' && request.method === 'GET') {
        if (!this.store.initialized()) return json({ initialized: false, active: false });
        const state = this.store.load();
        return json({
          initialized: true,
          active: this.store.setting('active') === '1',
          users: Object.keys(state.users).length,
          attempts: Object.keys(state.attempts).length,
          outbox: state.outbox.length,
          fingerprint: fingerprint(state),
        });
      }
      if (!this.store.initialized()) return json({ error: 'not_initialized' }, 503);
      if (path === '/admin/export' && request.method === 'GET') return json(this.store.load());
      if (path === '/admin/probe' && request.method === 'POST') {
        const config = readConfig(this.env as unknown as NodeJS.ProcessEnv);
        if (!config.adminIds.length) return json({ error: 'admin_missing' }, 503);
        const api = telegramClient(config.token);
        const me = await api('getMe');
        const message = await api('sendMessage', {
          chat_id: config.adminIds[0],
          text: '☁️ Бот подключён к облаку Cloudflare.\n\nЭто сообщение отправлено облачной версией. Локальный процесс остановлен. Ученики, ДЗ и результаты перенесены.\n\nНажми «Открыть меню», чтобы проверить работу.',
          reply_markup: { inline_keyboard: [[{ text: '🏠 Открыть меню', callback_data: 'home' }]] },
        });
        return json({ ok: true, bot: me.username, message_id: message.message_id });
      }
      if (path === '/admin/active' && request.method === 'POST') {
        const body: any = await request.json();
        if (typeof body.active !== 'boolean') return json({ error: 'invalid_state' }, 400);
        if (body.active) await this.ctx.storage.setAlarm(Date.now() + 1000);
        this.store.set('active', body.active ? '1' : '0');
        return json({ ok: true, active: body.active });
      }
      if (path === '/telegram' && request.method === 'POST') {
        if (this.store.setting('active') !== '1') return json({ error: 'inactive' }, 503);
        let update: unknown;
        try {
          update = await request.json();
        } catch {
          return json({ error: 'invalid_json' }, 400);
        }
        if (!validUpdate(update)) return json({ error: 'invalid_update' }, 400);
        await this.ctx.storage.setAlarm(Date.now() + 1000);
        this.store.enqueue(update);
        this.ctx.waitUntil(this.exclusive(() => this.process()));
        return json({ ok: true });
      }
      return json({ error: 'not_found' }, 404);
    });
  }
  async alarm() {
    return this.exclusive(() => this.process());
  }
  private async process() {
    if (!this.store.initialized() || this.store.setting('active') !== '1') return;
    await this.ctx.storage.setAlarm(Date.now() + 60_000);
    try {
      const config = readConfig(this.env as unknown as NodeJS.ProcessEnv);
      const result = await processPending(
        this.store,
        telegramClient(config.token),
        cloudDelivery,
        config.teacherIds,
        config.adminIds,
      );
      if (result.pending) await this.ctx.storage.setAlarm(Date.now() + result.retryMs);
      else await this.ctx.storage.deleteAlarm();
    } catch {
      await this.ctx.storage.setAlarm(Date.now() + 30_000);
    }
  }
}
