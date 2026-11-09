import { harness } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openStore } from '../../../apps/bot/src/store.js';

test('attempt and pending reports survive restart; concurrent writer is rejected', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'learneng-'));
  const path = join(directory, 'bot.json');
  let store;
  try {
    store = await openStore(path);
    const { state, text } = harness();
    text(20, '/practice');
    await store.commit(state);
    await assert.rejects(openStore(path), /занято/u);
    await store.close();
    store = await openStore(path);
    assert.equal(store.state.users['20'].activeAttempt, state.users['20'].activeAttempt);
    assert.deepEqual(store.state.outbox, state.outbox);
    assert.equal(store.state.offset, state.offset);
  } finally {
    if (store) await store.close();
    await rm(directory, { recursive: true, force: true });
  }
});
