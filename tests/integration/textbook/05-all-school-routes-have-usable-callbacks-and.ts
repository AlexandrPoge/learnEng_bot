import { harness } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { schoolYears } from '../../../packages/content/school.js';

test('all school routes have usable callbacks and training marks the shared topic as completed', () => {
  const h = harness();
  for (const year of schoolYears) {
    h.send(20, `/school ${year.grade}`);
    h.press('Все темы класса');
    for (const b of h.last().reply_markup!.inline_keyboard!.flat())
      if (b.callback_data) assert.ok(Buffer.byteLength(b.callback_data) <= 64);
  }
  h.send(20, '/school 1');
  h.press('Все темы класса');
  h.press('Алфавит');
  h.press('Практика');
  const attempt = h.state.attempts[h.state.users['20'].activeAttempt!];
  for (const [i, q] of attempt.lesson.questions.entries()) {
    if (q.type === 'choice') h.click(20, `a:${attempt.id}:${i}:${q.options.indexOf(q.accepted[0])}`);
    else h.send(20, q.accepted[0]);
  }
  h.send(20, '/school 2');
  assert.match(h.last().text!, /Пройдено тем: 1 из/u);
  h.press('Все темы класса');
  assert.match(h.last().reply_markup!.inline_keyboard![0][0].text, /^✅/u);
  h.send(20, '👥 Учебные группы');
  assert.match(h.last().text!, /Групп пока нет/u);
  h.send(20, '📚 Учебник');
  h.press('По школьным классам');
  h.press('2 класс');
  assert.equal(h.state.users['20'].classContext, undefined);
  assert.equal(h.state.users['20'].schoolCatalog?.grade, 2);
});
