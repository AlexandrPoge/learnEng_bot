import { expectInlineKeyboard, expectValue } from '../helpers/expectations.js';
import { createCloudRuntime } from './runtime.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { emptyState } from '../../apps/bot/src/store.js';
import { fingerprint, matches } from '../../apps/cloud/src/security.js';

test('cloud webhook persists 30 concurrent pupils, deduplicates retries and renders real PNG after restart', async () => {
  const runtime = await createCloudRuntime();
  const { directory, calls, makeRuntime } = runtime;
  let mf = makeRuntime();
  const request = (path: string, body?: any, admin = true) =>
    mf.dispatchFetch(`https://test.invalid${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: admin
        ? { Authorization: 'Bearer admin-secret', 'Content-Type': 'application/json' }
        : { 'X-Telegram-Bot-Api-Secret-Token': 'webhook-secret', 'Content-Type': 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  const settled = async () => {
    for (let i = 0; i < 250; i++) {
      const state: any = await (await request('/admin/export')).json();
      if (state.outbox.length === 0 && Object.keys(state.users).length >= 30) return state;
      await delay(20);
    }
    throw new Error('Cloud queue did not drain');
  };
  try {
    assert.equal((await mf.dispatchFetch('https://test.invalid/admin/export')).status, 403);
    assert.equal(
      (await mf.dispatchFetch('https://test.invalid/telegram', { method: 'POST', body: '{}' })).status,
      403,
    );
    const state = emptyState();
    state.offset = 100;
    state.editors = {};
    state.teacherWelcome = {};
    state.outbox.push({
      id: 'broken-card',
      method: 'sendPhoto',
      requiredTeacher: false,
      payload: {
        chat_id: 1000,
        reply_markup: { inline_keyboard: [[{ text: '📖 Правило', callback_data: 'home' }]] },
      },
      ruleCard: {
        page: 0,
        lesson: {
          id: 'broken-card',
          title: 'Invalid XML \u0000',
          level: 'A1',
          category: 'grammar',
          version: 1,
          estimatedMinutes: 5,
          theory: 'Rule',
          questions: [],
        },
      },
    });
    const imported = (await (await request('/admin/import', state)).json()) as any;
    assert.equal(imported.fingerprint, fingerprint(state));
    assert.equal((await request('/admin/import', state)).status, 409);
    await request('/admin/active', { active: true });
    const updates = Array.from({ length: 30 }, (_, i) => ({
      update_id: 100 + i,
      message: {
        from: { id: 1000 + i, first_name: `Test ${i}` },
        chat: { id: 1000 + i, type: 'private' },
        text: '/start',
      },
    }));
    const responses = await Promise.all(updates.toReversed().map((u) => request('/telegram', u, false)));
    assert.ok(responses.every((r) => r.status === 200));
    let exported = await settled();
    assert.equal(Object.keys(exported.users).length, 30);
    const fallback = calls.find(
      (c) => c.method === 'sendMessage' && c.payload.text?.startsWith('Картинка временно недоступна.'),
    );
    assert.ok(fallback, 'A broken card must fall back to text without blocking other pupils');
    assert.equal(expectInlineKeyboard(fallback.payload)[0][0].text, '📖 Правило');
    await delay(50);
    const originalCount = calls.length;
    await request('/telegram', updates[0], false);
    await delay(100);
    assert.equal(calls.length, originalCount);
    await request(
      '/telegram',
      {
        update_id: 130,
        message: { from: { id: 1000 }, chat: { id: 1000, type: 'private' }, text: '/practice to-be' },
      },
      false,
    );
    for (let i = 0; i < 100; i++) {
      exported = await (await request('/admin/export')).json();
      if (exported.users['1000'].activeAttempt) break;
      await delay(20);
    }
    const attemptId = expectValue(exported.users['1000'].activeAttempt);
    assert.ok(attemptId);
    await mf.dispose();
    mf = makeRuntime();
    exported = await (await request('/admin/export')).json();
    assert.equal(exported.users['1000'].activeAttempt, attemptId);
    await request(
      '/telegram',
      {
        update_id: 131,
        callback_query: {
          id: 'png',
          from: { id: 1000 },
          message: { message_id: 10, chat: { id: 1000, type: 'private' } },
          data: 'image:third-conditional:0',
        },
      },
      false,
    );
    for (let i = 0; i < 250 && !runtime.getPhoto(); i++) await delay(20);
    const photoBytes = runtime.getPhoto();
    assert.ok(photoBytes, 'WASM renderer must upload an actual photo');
    assert.deepEqual([...photoBytes.slice(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    await writeFile(join(directory, 'rule.png'), photoBytes);
    exported = await settled();
    assert.ok(Object.values(exported.ruleImages ?? {}).includes('cached-png'));
    assert.equal(matches('я', 'a'), false);
  } finally {
    await mf.dispose();
    await rm(directory, { recursive: true, force: true });
  }
});
