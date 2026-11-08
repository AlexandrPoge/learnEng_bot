import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { emptyState } from '../../apps/bot/src/store.js';
import { fingerprint, matches } from '../../apps/cloud/src/security.js';

test('cloud webhook persists 30 concurrent pupils, deduplicates retries and renders real PNG after restart', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'learneng-cloud-'));
  const calls: { method: string; payload: any }[] = [];
  let photoBytes: Uint8Array | undefined;
  const assets = (await readdir('.cloud-build')).filter(p => p.endsWith('.wasm') || p.endsWith('.ttf'));
  const options = {
    modulesRoot: resolve('.cloud-build'),
    modules: [{ type: 'ESModule' as const, path: resolve('.cloud-build/worker.js') }, ...assets.map(path => ({ type: path.endsWith('.wasm') ? 'CompiledWasm' as const : 'Data' as const, path: resolve('.cloud-build', path) }))],
    compatibilityDate: '2026-11-08', compatibilityFlags: ['nodejs_compat'],
    durableObjects: { BOT: { className: 'LearningBot', useSQLite: true } }, resourcePersistencePath: directory,
    bindings: { TELEGRAM_BOT_TOKEN: '12345:fake-test-token', ADMIN_IDS: '99', TEACHER_IDS: '10', WEBHOOK_SECRET: 'webhook-secret', CLOUD_ADMIN_KEY: 'admin-secret' },
    outboundService: async (request: Request) => {
      assert.equal(new URL(request.url).hostname, 'api.telegram.org');
      const method = new URL(request.url).pathname.split('/').at(-1)!;
      let payload: any;
      if (request.headers.get('content-type')?.startsWith('multipart/')) {
        const form = await request.formData(); const photo = form.get('photo');
        if (photo instanceof Blob) photoBytes = new Uint8Array(await photo.arrayBuffer());
        payload = { photo: typeof photo === 'string' ? photo : 'uploaded' };
      } else payload = await request.json();
      calls.push({ method, payload });
      return Response.json({ ok: true, result: { chat: { id: 99, type: 'private' }, message_id: calls.length, photo: [{ file_id: 'cached-png', width: 1080, height: 1200 }] } });
    },
  };
  const makeRuntime = () => new Miniflare(convertV4MiniflareOptions(options));
  let mf = makeRuntime();
  const request = (path: string, body?: any, admin = true) => mf.dispatchFetch(`https://test.invalid${path}`, { method: body === undefined ? 'GET' : 'POST', headers: admin ? { Authorization: 'Bearer admin-secret', 'Content-Type': 'application/json' } : { 'X-Telegram-Bot-Api-Secret-Token': 'webhook-secret', 'Content-Type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
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
    assert.equal((await mf.dispatchFetch('https://test.invalid/telegram', { method: 'POST', body: '{}' })).status, 403);
    const state = emptyState(); state.offset = 100; state.editors = {}; state.teacherWelcome = {};
    const imported = await (await request('/admin/import', state)).json() as any;
    assert.equal(imported.fingerprint, fingerprint(state));
    assert.equal((await request('/admin/import', state)).status, 409);
    await request('/admin/active', { active: true });
    const updates = Array.from({ length: 30 }, (_, i) => ({ update_id: 100 + i, message: { from: { id: 1000 + i, first_name: `Test ${i}` }, chat: { id: 1000 + i, type: 'private' }, text: '/start' } }));
    const responses = await Promise.all(updates.toReversed().map(u => request('/telegram', u, false)));
    assert.ok(responses.every(r => r.status === 200));
    let exported = await settled(); assert.equal(Object.keys(exported.users).length, 30);
    await delay(50); const originalCount = calls.length;
    await request('/telegram', updates[0], false); await delay(100);
    assert.equal(calls.length, originalCount);
    await request('/telegram', { update_id: 130, message: { from: { id: 1000 }, chat: { id: 1000, type: 'private' }, text: '/practice to-be' } }, false);
    for (let i = 0; i < 100; i++) { exported = await (await request('/admin/export')).json(); if (exported.users['1000'].activeAttempt) break; await delay(20); }
    const attemptId = exported.users['1000'].activeAttempt; assert.ok(attemptId);
    await mf.dispose(); mf = makeRuntime();
    exported = await (await request('/admin/export')).json(); assert.equal(exported.users['1000'].activeAttempt, attemptId);
    await request('/telegram', { update_id: 131, callback_query: { id: 'png', from: { id: 1000 }, message: { message_id: 10, chat: { id: 1000, type: 'private' } }, data: 'image:third-conditional:0' } }, false);
    for (let i = 0; i < 250 && !photoBytes; i++) await delay(20);
    assert.ok(photoBytes, 'WASM renderer must upload an actual photo');
    assert.deepEqual([...photoBytes.slice(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    await writeFile('/private/tmp/learneng-cloud-rule.png', photoBytes);
    exported = await settled(); assert.ok(Object.values(exported.ruleImages ?? {}).includes('cached-png'));
    assert.equal(matches('я', 'a'), false);
  } finally { await mf.dispose(); await rm(directory, { recursive: true, force: true }); }
});
