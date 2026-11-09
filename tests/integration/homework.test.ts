import { assignedHomework, expectValue, expectText } from '../helpers/expectations.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyState } from '../../apps/bot/src/store.js';
import { handleUpdate } from '../../apps/bot/src/handler.js';
import { parseDeadline } from '../../packages/domain/deadline.js';

test('deadline requires a real date and explicit timezone', () => {
  assert.equal(parseDeadline('2099-11-20T18:00+03:00'), '2099-11-20T15:00:00.000Z');
  assert.equal(parseDeadline('2099-02-30T18:00+03:00'), null);
  assert.equal(parseDeadline('2099-11-20T25:00+03:00'), null);
  assert.equal(parseDeadline('2099-11-20T18:00'), null);
});

test('assigned homework is scoped, uses a frozen lesson and cannot be submitted twice', () => {
  const state = emptyState();
  const send = (id: number, text: string) =>
    handleUpdate(
      state,
      {
        update_id: state.offset,
        message: { from: { id, first_name: `User ${id}` }, chat: { id, type: 'private' }, text },
      },
      ['10', '11'],
      ['99'],
    );
  const click = (id: number, data: string) =>
    handleUpdate(
      state,
      {
        update_id: state.offset,
        callback_query: {
          id: `cb-${state.offset}`,
          from: { id },
          message: { chat: { id, type: 'private' } },
          data,
        },
      },
      ['10', '11'],
      ['99'],
    );
  send(20, '/start');
  send(21, '/start');
  state.users['20'].teacherId = '10';
  send(11, '/assign 20 present-simple 2099-11-20T18:00+03:00');
  assert.equal(state.assignments, undefined);
  send(10, '/assign 20 present-simple 2099-11-20T18:00+03:00');
  const assignment = Object.values(assignedHomework(state))[0];
  const originalVersion = assignment.lesson.version;
  send(99, '/edit present-simple');
  send(99, '/title Changed title');
  send(99, '/publish');
  assert.equal(assignment.lesson.version, originalVersion);
  click(21, `h:${assignment.id}`);
  assert.equal(state.users['21'].activeAttempt, null);
  click(20, `h:${assignment.id}`);
  const attempt = state.attempts[expectValue(state.users['20'].activeAttempt)];
  assert.equal(attempt.assignmentId, assignment.id);
  assert.equal(attempt.lesson.version, originalVersion);
  assert.equal(attempt.teacherId, '10');
  for (const [index, question] of attempt.lesson.questions.entries()) {
    if (question.type === 'choice')
      click(20, `a:${attempt.id}:${index}:${expectValue(question.options).indexOf(question.accepted[0])}`);
    else send(20, question.accepted[0]);
  }
  assert.equal(assignment.attemptId, attempt.id);
  assert.equal(attempt.late, false);
  assert.ok(
    state.outbox.some(
      (task) =>
        task.payload.chat_id === '10' && task.payload.text?.includes('сдано вовремя') && task.requiredTeacher,
    ),
  );
  click(20, `h:${assignment.id}`);
  assert.equal(state.users['20'].activeAttempt, null);
  send(20, '/homework');
  assert.match(expectText(expectValue(state.outbox.at(-1)).payload), /Сдано/u);
  send(99, '/results');
  assert.equal(expectText(expectValue(state.outbox.at(-1)).payload).includes('Ответ:'), false);
  click(99, `report:${attempt.id}`);
  assert.ok(expectText(expectValue(state.outbox.at(-1)).payload).includes('Ответ:'));
  send(11, '/results');
  assert.equal(expectText(expectValue(state.outbox.at(-1)).payload).includes('Ответ:'), false);
});
