import { expectValue, expectText, expectInlineKeyboard } from '../../helpers/expectations.js';
import { harness } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../../../packages/content/catalog.js';

test('every published topic can be completed through the actual bot handler', () => {
  const { state, text, click } = harness();
  for (const lesson of lessons) {
    text(20, `/practice ${lesson.id}`);
    const id = expectValue(state.users['20'].activeAttempt);
    assert.equal(state.attempts[id].lesson.id, lesson.id);
    for (const [index, question] of lesson.questions.entries()) {
      if (question.type === 'choice')
        click(20, id, index, expectValue(question.options).indexOf(question.accepted[0]));
      else text(20, question.accepted[0]);
    }
    assert.equal(state.users['20'].activeAttempt, null, lesson.id);
    assert.ok(state.attempts[id].completedAt, lesson.id);
    assert.equal(
      state.attempts[id].answers.every((answer) => answer.correct),
      true,
      lesson.id,
    );
  }
  for (const task of state.outbox) {
    if (task.method !== 'sendMessage') continue;
    assert.ok(expectText(task.payload).length <= 4096);
    for (const row of task.payload.reply_markup?.inline_keyboard ?? []) {
      for (const button of row) assert.ok(Buffer.byteLength(expectValue(button.callback_data)) <= 64);
    }
  }
  text(20, '/topics A1');
  assert.ok(expectInlineKeyboard(expectValue(state.outbox.at(-1)).payload)[0][0].text.startsWith('✅'));
});
