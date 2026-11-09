import { test } from 'node:test';
import assert from 'node:assert/strict';
import { telegramClient, TelegramError } from '../../apps/bot/src/telegram.js';
import { readConfig } from '../../apps/bot/src/config.js';

test('transport preserves rate limit delay and hides token in network errors', async () => {
  const limited = telegramClient('secret', async () => ({
    ok: false,
    status: 429,
    json: async () => ({ error_code: 429, parameters: { retry_after: 8 } }),
  }));
  await assert.rejects(
    limited('sendMessage'),
    (error) => error instanceof TelegramError && error.code === 429 && error.retryAfter === 8,
  );
  const offline = telegramClient('secret', async () => {
    throw new Error('https://api.telegram.org/botsecret/getMe');
  });
  await assert.rejects(
    offline('getMe'),
    (error) => error instanceof Error && !error.message.includes('secret'),
  );
});

test('teacher access configuration rejects usernames and invalid IDs', () => {
  assert.throws(() => readConfig({ TELEGRAM_BOT_TOKEN: '123:abc', TEACHER_IDS: '@teacher' }));
  assert.throws(() => readConfig({ TELEGRAM_BOT_TOKEN: '123:abc', ADMIN_IDS: '@admin' }));
  assert.deepEqual(readConfig({ TELEGRAM_BOT_TOKEN: '123:abc', ADMIN_IDS: '99' }).adminIds, ['99']);
  assert.deepEqual(readConfig({ TELEGRAM_BOT_TOKEN: '123:abc', TEACHER_IDS: '12, 34' }).teacherIds, [
    '12',
    '34',
  ]);
});
