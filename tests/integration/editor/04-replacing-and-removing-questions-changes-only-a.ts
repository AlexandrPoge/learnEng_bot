import { setup } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findLesson } from '../../../apps/bot/src/editor.js';

test('replacing and removing questions changes only a draft until publication', () => {
  const { state, send } = setup();
  send(10, '/edit present-simple');
  send(10, '/edit_question q1');
  send(10, 'text');
  send(10, 'Впиши go: I ___ to school.');
  send(10, 'go');
  send(10, 'С I — go.');
  send(10, '/remove_question q5');
  assert.equal(findLesson(state, 'present-simple').questions.length, 5);
  send(10, '/publish');
  assert.equal(findLesson(state, 'present-simple').questions.length, 4);
  assert.equal(findLesson(state, 'present-simple').questions[0].type, 'text');
});
