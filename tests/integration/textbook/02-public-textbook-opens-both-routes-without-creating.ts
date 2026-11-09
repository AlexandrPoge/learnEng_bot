import { harness } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mainMenu } from '../../../apps/bot/src/navigation.js';

test('public textbook opens both routes without creating or joining a teacher group', () => {
  const h = harness();
  h.send(20, '/start');
  h.send(20, '📚 Учебник');
  h.press('По школьным классам');
  h.press('3 класс');
  h.press('Грамматика');
  h.press('Времена');
  h.press('Present Simple');
  assert.match(h.last().text!, /Учебник → 3 класс/u);
  h.press('Правило');
  assert.match(h.last().text!, /Учебник → 3 класс/u);
  assert.equal(h.state.classes, undefined);
  assert.equal(h.state.invites && Object.keys(h.state.invites).length, 0);
  assert.equal(h.state.users['20'].teacherId, undefined);
  assert.equal(h.state.users['20'].activeAttempt, null);
  h.press('Темы класса');
  h.press('Разделы 3 класса');
  h.press('Другой класс');
  h.press('По уровням');
  h.press('A2');
  assert.equal(h.state.users['20'].schoolCatalog, undefined);
  assert.equal(h.state.users['20'].catalog?.level, 'A2');
  assert.ok(
    h
      .last()
      .reply_markup?.inline_keyboard?.flat()
      .some((b) => b.callback_data === 't:past-simple'),
  );
  assert.ok(mainMenu().keyboard!.flat().includes('📚 Учебник'));
  assert.equal(mainMenu().keyboard!.flat().includes('🏫 Мои классы'), false);
});
