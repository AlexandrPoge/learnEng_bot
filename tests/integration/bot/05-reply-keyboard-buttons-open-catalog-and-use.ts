import { expectValue, expectInlineKeyboard } from '../../helpers/expectations.js';
import { harness } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('reply keyboard buttons open catalog and use the selected topic', () => {
  const { state, text } = harness();
  text(20, '📚 Темы');
  assert.ok(expectInlineKeyboard(expectValue(state.outbox.at(-1)).payload));
  text(20, '/lesson pronouns');
  text(20, '▶️ Практика');
  const attempt = state.attempts[expectValue(state.users['20'].activeAttempt)];
  assert.equal(attempt.lesson.id, 'pronouns');
  text(20, '▶️ Практика');
  assert.equal(state.users['20'].activeAttempt, attempt.id);
});
