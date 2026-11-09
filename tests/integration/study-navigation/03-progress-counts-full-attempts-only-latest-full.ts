import { past, harness, completedAttempt } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('progress counts full attempts only, latest full topic errors, repeats and private paginated history', () => {
  const h = harness();
  completedAttempt(h.state, 1, 'alpha', [false, false]);
  completedAttempt(h.state, 2, 'alpha', [true, true]);
  const weak = completedAttempt(h.state, 3, 'beta', [true, false]);
  for (let index = 4; index <= 7; index++) {
    completedAttempt(h.state, index, 'beta', [true], { reviewOf: weak.id });
  }
  completedAttempt(h.state, 8, 'foreign-secret', [false], { studentId: '21' });
  completedAttempt(h.state, 9, 'unfinished', [false], { completedAt: null });
  completedAttempt(h.state, 10, 'cancelled', [false], { cancelledAt: past });

  h.send(20, '/progress');
  assert.match(h.last().text!, /уникальных тем: 2/u);
  assert.match(h.last().text!, /50% \(3\/6\)/u);
  assert.match(h.last().text!, /повторений ошибок: 4/u);
  assert.match(h.last().text!, /Тем с ошибками: 1/u);
  assert.equal(h.buttons().filter((button) => button.callback_data?.startsWith('review:')).length, 5);
  assert.ok(!h.buttons().some((button) => button.text.includes('foreign-secret')));
  h.press('Дальше');
  assert.equal(h.buttons().filter((button) => button.callback_data?.startsWith('review:')).length, 2);
  h.press('Темы с ошибками');
  assert.deepEqual(
    h
      .buttons()
      .filter((button) => button.callback_data?.startsWith('review:'))
      .map((button) => button.callback_data),
    [`review:${weak.id}`],
  );
  assert.match(h.last().text!, /По последней полной попытке/u);

  h.press('beta');
  assert.match(h.last().text!, /Снимок вопроса 0/u);
  h.press('Дальше');
  assert.match(h.last().text!, /Правильно: saved-answer/u);
  assert.match(h.last().text!, /Объяснение из снимка/u);
  h.click(21, `review:${weak.id}`);
  assert.match(h.last(21).text!, /твоей практики/u);
  h.click(21, `repeat:${weak.id}`);
  assert.equal(h.state.users['21'].activeAttempt, null);
});
