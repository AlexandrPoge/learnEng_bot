import { expectValue, expectInlineKeyboard, expectText } from '../../helpers/expectations.js';
import { harness } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLesson } from '../../../packages/content/catalog.js';

test('catalog navigation, topic selection and practice resuming preserve the active lesson', () => {
  const { state, text, action } = harness();
  text(20, '/topics');
  assert.ok(
    expectInlineKeyboard(expectValue(state.outbox.at(-1)).payload).some(
      (row) => row[0].callback_data === 'l:A1:0',
    ),
  );
  action(20, 'l:A1:0');
  const firstPage = expectInlineKeyboard(expectValue(state.outbox.at(-1)).payload);
  action(20, 'l:A1:1');
  assert.notDeepEqual(expectInlineKeyboard(expectValue(state.outbox.at(-1)).payload), firstPage);
  action(20, 't:articles');
  assert.equal(state.users['20'].selectedLesson, 'articles');
  action(20, 'p:articles');
  const id = expectValue(state.users['20'].activeAttempt);
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
  assert.match(expectText(expectValue(state.outbox.at(-1)).payload), /Страница не найдена/u);
  text(20, '/topics C2');
  assert.match(expectText(expectValue(state.outbox.at(-1)).payload), /пока не добавлен/u);
});
