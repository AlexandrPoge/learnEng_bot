import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyState } from '../../apps/bot/src/store.js';
import { handleUpdate } from '../../apps/bot/src/handler.js';
import { findLesson } from '../../apps/bot/src/editor.js';

function setup() {
  const state = emptyState();
  let index = 0;
  const send = (id, text) => handleUpdate(state, {
    update_id: index++, message: { from: { id, first_name: `User ${id}` }, chat: { id, type: 'private' }, text },
  }, [], ['10']);
  return { state, send, last: () => state.outbox.at(-1).payload.text };
}

test('only administrator grants or revokes roles; administrator includes teacher capabilities', () => {
  const { state, send, last } = setup();
  send(10, '/whoami');
  assert.match(last(), /администратор/u);
  send(20, '/add_teacher 20');
  assert.match(last(), /администратору/u);
  send(20, '/edit articles');
  assert.equal(state.editors?.['20'], undefined);
  send(10, '/add_teacher 20');
  send(20, '/edit articles');
  assert.ok(state.editors['20']);
  send(20, '/restore articles 1');
  assert.match(last(), /администратору/u);
  send(10, '/remove_teacher 20');
  assert.equal(state.editors['20'], undefined);
  send(20, '/invite');
  assert.match(last(), /репетитору/u);
  send(10, '/invite');
  assert.equal(Object.keys(state.invites).length, 1);
});

test('draft publishing, conflicts, rollback, and active attempt snapshots', () => {
  const { state, send, last } = setup();
  send(30, '/practice articles');
  const attempt = state.attempts[state.users['30'].activeAttempt];
  const original = attempt.lesson.theory;
  const originalVersion = attempt.lesson.version;
  send(10, '/add_teacher 20');
  send(10, '/edit articles');
  send(20, '/edit articles');
  send(10, '/theory Новое объяснение с примерами.');
  assert.equal(findLesson(state, 'articles').theory, original);
  send(10, '/publish');
  assert.equal(findLesson(state, 'articles').version, originalVersion + 1);
  assert.equal(attempt.lesson.version, originalVersion);
  assert.equal(attempt.lesson.theory, original);
  send(20, '/publish');
  assert.match(last(), /другим редактором/u);
  send(10, `/restore articles ${originalVersion}`);
  assert.equal(findLesson(state, 'articles').version, originalVersion + 2);
  assert.equal(findLesson(state, 'articles').theory, original);
  send(10, '/history articles');
  assert.ok(last().includes(`Версия ${originalVersion + 1}`));
  send(30, '/editor');
  assert.match(last(), /доступен репетитору/u);
});

test('new lesson wizard validates choices, publishes and lets a student complete it', () => {
  const { state, send, last } = setup();
  send(10, '/new test-topic');
  send(10, '/publish');
  assert.equal(findLesson(state, 'test-topic'), undefined);
  send(10, '/title Пробная тема');
  send(10, '/level B1');
  send(10, '/theory After does use the infinitive. Does she work?');
  send(10, '/add_question');
  send(10, 'choice'); send(10, 'Does she ___ here?');
  send(10, 'work\nworks'); send(10, '99');
  assert.match(last(), /номер варианта/u);
  send(10, '1'); send(10, 'После does — начальная форма work.');
  send(10, '/add_question');
  send(10, 'text'); send(10, 'Впиши do: I ___ not work here.');
  send(10, 'do'); send(10, 'С I используется do.');
  send(10, '/preview');
  assert.match(last(), /Ключ: do/u);
  send(10, '/publish');
  assert.equal(findLesson(state, 'test-topic').questions.length, 2);
  send(30, '/topics B1');
  while (!state.outbox.at(-1).payload.reply_markup.inline_keyboard.flat().some(b => b.text.includes('Пробная тема'))) {
    const next = state.outbox.at(-1).payload.reply_markup.inline_keyboard.flat().find(b => b.text.includes('Далее'));
    assert.ok(next, 'Published lesson must be reachable in the B1 catalog');
    handleUpdate(state, { update_id: state.offset, callback_query: { id: `page-${state.offset}`, from: { id: 30 }, message: { chat: { id: 30, type: 'private' } }, data: next.callback_data } }, [], ['10']);
  }
  assert.ok(state.outbox.at(-1).payload.reply_markup.inline_keyboard.flat().some(b => b.text.includes('Пробная тема')));
  handleUpdate(state, { update_id: state.offset, message: { from: { id: 30 }, chat: { id: 30, type: 'private' }, text: '/practice test-topic' } }, [], ['10']);
  const id = state.users['30'].activeAttempt;
  handleUpdate(state, { update_id: state.offset, callback_query: {
    id: 'trial', from: { id: 30 }, message: { chat: { id: 30, type: 'private' } }, data: `a:${id}:0:0`,
  } }, [], ['10']);
  // Continue outside the harness to preserve the strictly increasing offset.
  handleUpdate(state, { update_id: state.offset, message: { from: { id: 30 }, chat: { id: 30, type: 'private' }, text: 'do' } }, [], ['10']);
  assert.ok(state.attempts[id].completedAt);
  assert.equal(state.attempts[id].answers.every((answer) => answer.correct), true);
});

test('replacing and removing questions changes only a draft until publication', () => {
  const { state, send } = setup();
  send(10, '/edit present-simple');
  send(10, '/edit_question q1');
  send(10, 'text'); send(10, 'Впиши go: I ___ to school.'); send(10, 'go'); send(10, 'С I — go.');
  send(10, '/remove_question q5');
  assert.equal(findLesson(state, 'present-simple').questions.length, 5);
  send(10, '/publish');
  assert.equal(findLesson(state, 'present-simple').questions.length, 4);
  assert.equal(findLesson(state, 'present-simple').questions[0].type, 'text');
});
