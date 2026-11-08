import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { emptyState, openStore } from '../../apps/bot/src/store.mjs';
import { handleUpdate } from '../../apps/bot/src/handler.mjs';
import { lessons, getLesson } from '../../packages/content/catalog.mjs';

function harness() {
  const state = emptyState();
  let updateId = 0;
  const text = (id, body) => {
    const update = { update_id: updateId++, message: { from: { id, first_name: `User ${id}` }, chat: { id, type: 'private' }, text: body } };
    handleUpdate(state, update, ['10', '11']);
    return update;
  };
  const action = (id, data) => handleUpdate(state, {
    update_id: updateId++, callback_query: { id: `cb${updateId}`, from: { id }, message: { chat: { id, type: 'private' } }, data },
  }, ['10', '11']);
  const click = (id, attemptId, index, option) => action(id, `a:${attemptId}:${index}:${option}`);
  return { state, text, click, action };
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

test('catalog navigation, topic selection and practice resuming preserve the active lesson', () => {
  const { state, text, action } = harness();
  text(20, '/topics');
  assert.ok(state.outbox.at(-1).payload.reply_markup.inline_keyboard.some((row) => row[0].callback_data === 'l:A1:0'));
  action(20, 'l:A1:0');
  const firstPage = state.outbox.at(-1).payload.reply_markup.inline_keyboard;
  action(20, 'l:A1:1');
  assert.notDeepEqual(state.outbox.at(-1).payload.reply_markup.inline_keyboard, firstPage);
  action(20, 't:articles');
  assert.equal(state.users['20'].selectedLesson, 'articles');
  action(20, 'p:articles');
  const id = state.users['20'].activeAttempt;
  assert.equal(state.attempts[id].lesson.id, 'articles');
  text(20, '/practice past-simple');
  assert.equal(state.users['20'].activeAttempt, id);
  assert.equal(state.attempts[id].lesson.id, 'articles');
  action(20, 'p:unknown');
  assert.equal(state.users['20'].activeAttempt, id);
  text(20, '/cancel');
  assert.ok(state.attempts[id].cancelledAt);
  text(20, '/practice past-simple');
  const secondId = state.users['20'].activeAttempt;
  assert.equal(state.attempts[secondId].lesson.id, 'past-simple');
  assert.notEqual(state.attempts[secondId].lesson, getLesson('past-simple'));
  action(20, 'l:A1:999');
  assert.match(state.outbox.at(-1).payload.text, /Страница не найдена/u);
  text(20, '/topics B2');
  assert.match(state.outbox.at(-1).payload.text, /пока не добавлен/u);
});

test('reply keyboard buttons open catalog and use the selected topic', () => {
  const { state, text } = harness();
  text(20, '📚 Темы');
  assert.ok(state.outbox.at(-1).payload.reply_markup.inline_keyboard);
  text(20, '/lesson pronouns');
  text(20, '▶️ Практика');
  const attempt = state.attempts[state.users['20'].activeAttempt];
  assert.equal(attempt.lesson.id, 'pronouns');
  text(20, '▶️ Практика');
  assert.equal(state.users['20'].activeAttempt, attempt.id);
});

test('every published topic can be completed through the actual bot handler', () => {
  const { state, text, click } = harness();
  for (const lesson of lessons) {
    text(20, `/practice ${lesson.id}`);
    const id = state.users['20'].activeAttempt;
    assert.equal(state.attempts[id].lesson.id, lesson.id);
    for (const [index, question] of lesson.questions.entries()) {
      if (question.type === 'choice') click(20, id, index, question.options.indexOf(question.accepted[0]));
      else text(20, question.accepted[0]);
    }
    assert.equal(state.users['20'].activeAttempt, null, lesson.id);
    assert.ok(state.attempts[id].completedAt, lesson.id);
    assert.equal(state.attempts[id].answers.every((answer) => answer.correct), true, lesson.id);
  }
  for (const task of state.outbox) {
    if (task.method !== 'sendMessage') continue;
    assert.ok(task.payload.text.length <= 4096);
    for (const row of task.payload.reply_markup?.inline_keyboard ?? []) {
      for (const button of row) assert.ok(Buffer.byteLength(button.callback_data) <= 64);
    }
  }
  text(20, '/topics A1');
  assert.ok(state.outbox.at(-1).payload.reply_markup.inline_keyboard[0][0].text.startsWith('✅'));
});
