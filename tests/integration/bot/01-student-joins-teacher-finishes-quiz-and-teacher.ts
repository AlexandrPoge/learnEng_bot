import { harness } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { handleUpdate } from '../../../apps/bot/src/handler.js';

test('student joins teacher, finishes quiz, and teacher gets original answers', () => {
  const { state, text, click, action } = harness();
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
  const reports = state.outbox.filter(
    (task) => task.payload.chat_id === '10' && task.payload.text?.includes('Новое выполненное'),
  );
  assert.equal(reports.length, 1);
  assert.doesNotMatch(reports[0].payload.text, /Ответ:/u);
  assert.match(reports[0].payload.text, /4\/5/u);
  action(10, `report:${id}`);
  assert.ok(
    state.outbox.some((task) => task.payload.chat_id === '10' && task.payload.text?.includes('Ответ: plays')),
  );
  state.outbox = [];
  text(11, '/results');
  assert.equal(
    state.outbox.some((task) => task.payload.text?.includes('Ответ:')),
    false,
  );
});
