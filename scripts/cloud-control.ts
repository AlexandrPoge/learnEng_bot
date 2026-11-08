import { randomBytes } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { readConfig } from '../apps/bot/src/config.js';
import { telegramClient } from '../apps/bot/src/telegram.js';
import { fingerprint, validateImport } from '../apps/cloud/src/security.js';

const secretsPath = '.cloud-secrets.json';
const [command, urlArgument] = process.argv.slice(2);
try {
  const config = readConfig();
  if (command === 'secrets') {
    let old: Record<string, string> = {};
    try { old = JSON.parse(await readFile(secretsPath, 'utf8')); } catch (e) { if (e.code !== 'ENOENT') throw e; }
    await writeFile(secretsPath, JSON.stringify({ TELEGRAM_BOT_TOKEN: config.token, TEACHER_IDS: config.teacherIds.join(','), ADMIN_IDS: config.adminIds.join(','), WEBHOOK_SECRET: old.WEBHOOK_SECRET ?? randomBytes(32).toString('hex'), CLOUD_ADMIN_KEY: old.CLOUD_ADMIN_KEY ?? randomBytes(32).toString('hex') }), { mode: 0o600 });
    console.log('Секреты подготовлены в игнорируемом файле; значения скрыты.');
  } else {
    const url = new URL(urlArgument);
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.workers.dev') || url.username || url.password) throw new Error('Нужен адрес опубликованного Worker на workers.dev.');
    const secrets = JSON.parse(await readFile(secretsPath, 'utf8'));
    const cloud = async (path: string, body?: unknown) => {
      const response = await fetch(new URL(path, url), { method: body === undefined ? 'GET' : 'POST', headers: { Authorization: `Bearer ${secrets.CLOUD_ADMIN_KEY}`, 'Content-Type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.timeout(60_000) });
      if (!response.ok) throw new Error(`Cloud API ${response.status}`);
      return response.json() as Promise<any>;
    };
    if (command === 'status') console.log(JSON.stringify(await cloud('/admin/status')));
    else if (command === 'probe') console.log(JSON.stringify(await cloud('/admin/probe', {})));
    else if (command === 'import') {
      try { await access(`${config.dataFile}.lock`); throw new Error('Сначала остановите локального бота. Импорт из работающего хранилища запрещён.'); }
      catch (e) { if (e.code !== 'ENOENT') throw e; }
      const state = JSON.parse(await readFile(config.dataFile, 'utf8')); validateImport(state);
      await mkdir('data/backups', { recursive: true });
      const backup = `data/backups/before-cloud-${Date.now()}.json`;
      await writeFile(backup, JSON.stringify(state), { flag: 'wx', mode: 0o600 });
      const result = await cloud('/admin/import', state);
      if (result.fingerprint !== fingerprint(state)) throw new Error('Контрольная сумма переноса не совпала. Бот не переключён.');
      console.log(`Данные перенесены и проверены. Резервная копия: ${backup}`);
    } else if (command === 'activate' || command === 'deactivate') console.log(JSON.stringify(await cloud('/admin/active', { active: command === 'activate' })));
    else if (command === 'webhook') {
      const status = await cloud('/admin/status');
      if (!status.initialized || !status.active) throw new Error('Сначала импортируйте данные и активируйте облачный обработчик.');
      const api = telegramClient(config.token);
      await api('setWebhook', { url: new URL('/telegram', url).href, secret_token: secrets.WEBHOOK_SECRET, max_connections: 1, allowed_updates: ['message', 'callback_query'], drop_pending_updates: false });
      const info = await api('getWebhookInfo');
      if (info.url !== new URL('/telegram', url).href) throw new Error('Webhook не подтвердился.');
      console.log('Telegram переключён на облако; ожидающие сообщения сохранены.');
    } else if (command === 'export') {
      const state = await cloud('/admin/export'); validateImport(state);
      await mkdir('data/backups', { recursive: true });
      const backup = `data/backups/cloud-${Date.now()}.json`;
      await writeFile(backup, JSON.stringify(state), { flag: 'wx', mode: 0o600 }); console.log(`Резервная копия облака: ${backup}`);
    } else throw new Error('Команды: secrets, status, import, activate, deactivate, webhook, export.');
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
