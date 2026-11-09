import { setup } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';

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
