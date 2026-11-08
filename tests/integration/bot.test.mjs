import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { emptyState, openStore } from '../../apps/bot/src/store.mjs';
import { handleUpdate } from '../../apps/bot/src/handler.mjs';

function harness() {
  const state = emptyState();
  let updateId = 0;
  const text = (id, body) => {
    const update = { update_id: updateId++, message: { from: { id, first_name: `User ${id}` }, chat: { id, type: 'private' }, text: body } };
    handleUpdate(state, update, ['10', '11']);
    return update;
  };
  const click = (id, attemptId, index, option) => handleUpdate(state, {
    update_id: updateId++, callback_query: { id: `cb${updateId}`, from: { id }, message: { chat: { id, type: 'private' } }, data: `a:${attemptId}:${index}:${option}` },
  }, ['10', '11']);
  return { state, text, click };
}

test('student joins teacher, finishes quiz, and teacher gets original answers', () => {
  const { state, text, click } = harness();
  text(10, '/invite');
  const code = Object.keys(state.invites)[0];
  text(20, `/join ${code}`);
  text(21, `/join ${code}`);
  assert.equal(state.users['20'].teacherId, '10');
  assert.equal(state.users['21'].teacherId, undefined);
  text(20, '/practice');
  const id = state.users['20'].activeAttempt;
  click(20, id, 0, 1);
  click(20, id, 0, 1); // Double click must not answer the next question.
  assert.equal(state.attempts[id].answers.length, 1);
  click(20, id, 1, 2);
  text(20, 'plays'); // Intentional mistake.
  click(20, id, 3, 1);
  const lastUpdate = text(20, ' WATCHES. ');
  handleUpdate(state, lastUpdate, ['10', '11']); // Redelivery is harmless.
  assert.equal(state.attempts[id].answers.length, 5);
  assert.equal(state.users['20'].activeAttempt, null);
  assert.equal(state.attempts[id].answers.filter((answer) => answer.correct).length, 4);
  const reports = state.outbox.filter((task) => task.payload.chat_id === '10' && task.payload.text?.includes('Новое выполненное'));
  assert.equal(reports.length, 1);
  assert.match(reports[0].payload.text, /Ответ: plays/u);
  assert.match(reports[0].payload.text, /4\/5/u);
  state.outbox = [];
  text(11, '/results');
  assert.equal(state.outbox.some((task) => task.payload.text?.includes('Ответ:')), false);
});

test('role checks, callback ownership, expired invitation and group privacy', () => {
  const { state, text, click } = harness();
  text(20, '/invite');
  assert.equal(Object.keys(state.invites).length, 0);
  text(10, '/invite');
  const code = Object.keys(state.invites)[0];
  state.invites[code].expiresAt = Date.now() - 1;
  text(20, `/join ${code}`);
  assert.equal(state.users['20'].teacherId, undefined);
  text(20, '/practice');
  text(21, '/practice');
  const id = state.users['20'].activeAttempt;
  click(21, id, 0, 1);
  assert.equal(state.attempts[id].answers.length, 0);
  const count = state.outbox.length;
  handleUpdate(state, { update_id: 999, message: { from: { id: 30 }, chat: { id: -100, type: 'group' }, text: '/start' } }, ['10']);
  assert.equal(state.outbox.length, count);
  assert.equal(state.users['30'], undefined);
});

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
