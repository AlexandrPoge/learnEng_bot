import type { Env } from './environment.js';
import { json } from './http.js';
import { matches } from './security.js';

export { LearningBot } from './learning-bot.js';
/** Публичный Worker проверяет секрет до обращения к Durable Object. */
export default {
  async fetch(request: Request, env: Env) {
    const path = new URL(request.url).pathname;
    if (path === '/health' && request.method === 'GET')
      return json({ ok: true, service: 'learneng-bot-cloud' });
    if (path === '/telegram') {
      if (request.method !== 'POST') return json({ error: 'method' }, 405);
      if (!matches(request.headers.get('X-Telegram-Bot-Api-Secret-Token'), env.WEBHOOK_SECRET))
        return json({ error: 'unauthorized' }, 403);
    } else if (path.startsWith('/admin/')) {
      if (
        !matches(
          request.headers.get('Authorization'),
          env.CLOUD_ADMIN_KEY ? `Bearer ${env.CLOUD_ADMIN_KEY}` : undefined,
        )
      )
        return json({ error: 'unauthorized' }, 403);
    } else return json({ error: 'not_found' }, 404);
    if (!env.TELEGRAM_BOT_TOKEN || !env.CLOUD_ADMIN_KEY || !env.WEBHOOK_SECRET)
      return json({ error: 'not_configured' }, 503);
    const id = env.BOT.idFromName(`telegram:${env.TELEGRAM_BOT_TOKEN.split(':')[0]}`);
    try {
      return await env.BOT.get(id).fetch(request);
    } catch {
      return json({ error: 'temporary_failure' }, 503);
    }
  },
};
