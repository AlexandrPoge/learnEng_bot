import { harness } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { handleUpdate } from '../../../apps/bot/src/handler.js';

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
  handleUpdate(
    state,
    { update_id: 999, message: { from: { id: 30 }, chat: { id: -100, type: 'group' }, text: '/start' } },
    ['10'],
  );
  assert.equal(state.outbox.length, count);
  assert.equal(state.users['30'], undefined);
});
