import { harness } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('empty progress and homework preserve menu navigation and filter callbacks', () => {
  const h = harness();
  h.send(20, '/progress');
  assert.match(h.last().text!, /Результатов пока нет/u);
  h.press('Темы с ошибками');
  assert.match(h.last().text!, /Тем с ошибками.*нет/u);
  h.send(20, '/homework');
  assert.match(h.last().text!, /Домашних заданий пока нет/u);
  h.press('Сданы');
  assert.ok(h.buttons().some((button) => button.callback_data === 'home'));
  h.press('Меню');
  assert.ok(h.last().reply_markup!.keyboard);
});
