import { expectValue, expectInlineKeyboard } from '../../helpers/expectations.js';
import { setup } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleUpdate } from '../../../apps/bot/src/handler.js';
import { findLesson } from '../../../apps/bot/src/editor.js';

test('new lesson wizard validates choices, publishes and lets a student complete it', () => {
  const { state, send, last } = setup();
  send(10, '/new test-topic');
  send(10, '/publish');
  assert.equal(findLesson(state, 'test-topic'), undefined);
  send(10, '/title Пробная тема');
  send(10, '/level B1');
  send(10, '/theory After does use the infinitive. Does she work?');
  send(10, '/add_question');
  send(10, 'choice');
  send(10, 'Does she ___ here?');
  send(10, 'work\nworks');
  send(10, '99');
  assert.match(last(), /номер варианта/u);
  send(10, '1');
  send(10, 'После does — начальная форма work.');
  send(10, '/add_question');
  send(10, 'text');
  send(10, 'Впиши do: I ___ not work here.');
  send(10, 'do');
  send(10, 'С I используется do.');
  send(10, '/preview');
  assert.match(last(), /Ключ: do/u);
  send(10, '/publish');
  assert.equal(expectValue(findLesson(state, 'test-topic')).questions.length, 2);
  send(30, '/topics B1');
  while (
    !expectInlineKeyboard(expectValue(state.outbox.at(-1)).payload)
      .flat()
      .some((b) => b.text.includes('Пробная тема'))
  ) {
    const next = expectInlineKeyboard(expectValue(state.outbox.at(-1)).payload)
      .flat()
      .find((b) => b.text.includes('Далее'));
    assert.ok(next, 'Published lesson must be reachable in the B1 catalog');
    handleUpdate(
      state,
      {
        update_id: state.offset,
        callback_query: {
          id: `page-${state.offset}`,
          from: { id: 30 },
          message: { chat: { id: 30, type: 'private' } },
          data: next.callback_data,
        },
      },
      [],
      ['10'],
    );
  }
  assert.ok(
    expectInlineKeyboard(expectValue(state.outbox.at(-1)).payload)
      .flat()
      .some((b) => b.text.includes('Пробная тема')),
  );
  handleUpdate(
    state,
    {
      update_id: state.offset,
      message: { from: { id: 30 }, chat: { id: 30, type: 'private' }, text: '/practice test-topic' },
    },
    [],
    ['10'],
  );
  const id = expectValue(state.users['30'].activeAttempt);
  handleUpdate(
    state,
    {
      update_id: state.offset,
      callback_query: {
        id: 'trial',
        from: { id: 30 },
        message: { chat: { id: 30, type: 'private' } },
        data: `a:${id}:0:0`,
      },
    },
    [],
    ['10'],
  );
  // Continue outside the harness to preserve the strictly increasing offset.
  handleUpdate(
    state,
    { update_id: state.offset, message: { from: { id: 30 }, chat: { id: 30, type: 'private' }, text: 'do' } },
    [],
    ['10'],
  );
  assert.ok(state.attempts[id].completedAt);
  assert.equal(
    state.attempts[id].answers.every((answer) => answer.correct),
    true,
  );
});
