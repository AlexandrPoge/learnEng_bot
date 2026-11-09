import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { renderRuleImage, ruleImageKey, ruleImagePages } from '../../apps/bot/src/rule-images.js';
import { deliverTask } from '../../apps/bot/src/delivery.js';
import { emptyState } from '../../apps/bot/src/store.js';
import { telegramClient, TelegramError } from '../../apps/bot/src/telegram.js';
import { lessons } from '../../packages/content/catalog.js';
import { recordActivity } from '../../packages/domain/timing.js';
import type { Attempt, OutboxTask, TelegramApi } from '../../packages/domain/types.js';

test('rule cards render actual rule text, Cyrillic and XML characters into valid PNG pages', async () => {
  const lesson = {
    ...lessons[0],
    title: '<A & B> "Правило"',
    theory: 'Кошка <cat> & dog. I am happy! '.repeat(100) + '\nПримеры:\nDO NOT INCLUDE',
    memory: undefined,
  };
  const pages = ruleImagePages(lesson);
  assert.ok(pages.length > 1);
  assert.ok(pages.flat().join(' ').includes('Кошка'));
  assert.equal(pages.flat().join(' ').includes('DO NOT INCLUDE'), false);
  for (const page of [0, pages.length - 1]) {
    const png = await renderRuleImage(lesson, page);
    const meta = await sharp(png).metadata();
    assert.equal(meta.format, 'png');
    assert.equal(meta.width, 1080);
    assert.ok(meta.height! < 2500);
    assert.ok(png.length < 10_000_000);
  }
  assert.notEqual(ruleImageKey(lesson, 0), ruleImageKey({ ...lesson, theory: 'Исправленное правило' }, 0));
  assert.notEqual(ruleImageKey(lesson, 0), ruleImageKey(lesson, 1));
});

test('media delivery uploads once, caches file_id and replaces invalid cached photo', async () => {
  const state = emptyState();
  const lesson = lessons[0];
  const task: OutboxTask = {
    id: 'x',
    method: 'sendPhoto',
    payload: { chat_id: '20', caption: lesson.title },
    requiredTeacher: false,
    ruleCard: { lesson, page: 0 },
  };
  const sent: unknown[] = [];
  let rejectCache = false;
  const api = (async (method, payload) => {
    sent.push(payload?.photo);
    if (rejectCache && typeof payload?.photo === 'string') throw new TelegramError(400);
    return { photo: [{ file_id: 'telegram-file-id' }] };
  }) as TelegramApi;
  const result = await deliverTask(state, task, api);
  assert.ok(sent[0] instanceof Blob);
  assert.equal(result?.fileId, 'telegram-file-id');
  state.ruleImages = { [result!.key]: result!.fileId };
  await deliverTask(state, task, api);
  assert.equal(sent[1], 'telegram-file-id');
  rejectCache = true;
  await deliverTask(state, task, api);
  assert.equal(sent[2], 'telegram-file-id');
  assert.ok(sent[3] instanceof Blob);
});

test('multipart Telegram transport serializes captions and inline markup without JSON-encoding Blob', async () => {
  const api = telegramClient('secret', async (_url, init) => {
    assert.ok(init.body instanceof FormData);
    assert.equal(init.headers, undefined);
    assert.ok(init.body.get('photo') instanceof Blob);
    assert.equal(init.body.get('chat_id'), '20');
    assert.deepEqual(JSON.parse(String(init.body.get('reply_markup'))), { inline_keyboard: [] });
    return {
      ok: true,
      status: 200,
      json: async () => ({ ok: true, result: { chat: { id: 20, type: 'private' } } }),
    };
  });
  await api('sendPhoto', {
    chat_id: 20,
    photo: new Blob(['image'], { type: 'image/png' }),
    reply_markup: { inline_keyboard: [] },
  });
});

test('time estimate excludes long gaps, counts resumed work and leaves legacy attempts unknown', () => {
  const a = {
    startedAt: '2026-01-01T00:00:00Z',
    lastActivityAt: '2026-01-01T00:00:00Z',
    engagedMs: 0,
  } as Attempt;
  recordActivity(a, '2026-01-01T00:00:30Z');
  assert.equal(a.engagedMs, 30_000);
  recordActivity(a, '2026-01-01T01:00:00Z');
  assert.equal(a.engagedMs, 30_000);
  recordActivity(a, '2026-01-01T01:00:20Z');
  assert.equal(a.engagedMs, 50_000);
  const legacy = { startedAt: '2026-01-01T00:00:00Z' } as Attempt;
  recordActivity(legacy, '2026-01-01T01:00:00Z');
  assert.equal(legacy.engagedMs, undefined);
});
