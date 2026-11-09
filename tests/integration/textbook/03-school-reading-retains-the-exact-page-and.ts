import { harness } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('school reading retains the exact page and section, with honest revision labels and invalid-page handling', () => {
  const h = harness();
  h.send(20, '/school 4');
  h.press('Все темы класса');
  h.press('Дальше');
  const saved = structuredClone(h.state.users['20'].schoolCatalog);
  const topic = h.last().reply_markup!.inline_keyboard![0][0];
  h.click(20, topic.callback_data!);
  h.press('Правило');
  h.send(20, '/continue');
  h.press('Темы класса');
  assert.deepEqual(h.state.users['20'].schoolCatalog, saved);
  assert.match(h.last().text!, /Страница 2/u);
  h.send(20, '/school 11');
  assert.match(h.last().text!, /B1–B2/u);
  h.click(20, 'school:0');
  assert.match(h.last().text!, /не найден/u);
  h.click(20, 'school:4:all:999');
  assert.match(h.last().text!, /не доступна/u);
  h.send(20, '/search family');
  h.press('Семья');
  assert.equal(h.state.users['20'].schoolCatalog, undefined);
});
