import { expectValue } from '../../helpers/expectations.js';
import { harness, assignment } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('test homework keeps answers hidden until completion, then opens its frozen review from old homework buttons', () => {
  const h = harness();
  const task = assignment(h.state, 1, { mode: 'test' });
  h.click(20, `h:${task.id}`);
  const attempt = h.state.attempts[h.state.users['20'].activeAttempt!];
  const before = h.state.outbox.length;
  h.send(20, '/progress');
  h.click(20, `review:${attempt.id}`);
  h.click(20, `repeat:${attempt.id}`);
  h.click(20, `hint:${attempt.id}:0`);
  assert.ok(h.state.outbox.slice(before).every((task) => !task.payload.text?.includes('Правильно:')));

  for (const [index, question] of attempt.lesson.questions.entries()) {
    if (question.type === 'choice') {
      h.click(20, `a:${attempt.id}:${index}:${expectValue(question.options).indexOf(question.accepted[0])}`);
    } else {
      h.send(20, question.accepted[0]);
    }
  }
  const completionCards = h.state.outbox.filter(
    (task) => task.payload.chat_id === '20' && task.payload.text?.includes('🎉'),
  );
  assert.equal(completionCards.length, 1);
  assert.match(completionCards[0].payload.text!, /Проверочная завершена/u);
  assert.match(completionCards[0].payload.text!, /Всего:/u);
  assert.ok(
    completionCards[0].payload
      .reply_markup!.inline_keyboard!.flat()
      .some((button) => button.callback_data === 'home'),
  );
  h.click(20, `h:${task.id}`);
  assert.match(h.last().text!, /Твой ответ/u);
  assert.equal(h.state.users['20'].activeAttempt, null);
  h.click(21, `h:${task.id}`);
  assert.match(h.last(21).text!, /недоступно/u);
});
