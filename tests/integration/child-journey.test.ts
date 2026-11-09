import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleUpdate } from '../../apps/bot/src/handler.js';
import { emptyState } from '../../apps/bot/src/store.js';

test('child follows visible buttons, finds a topic, makes a mistake, uses a hint and finishes', () => {
  const state = emptyState();
  const text = (value) =>
    handleUpdate(state, {
      update_id: state.offset,
      message: { from: { id: 30 }, chat: { id: 30, type: 'private' }, text: value },
    });
  const action = (data) =>
    handleUpdate(state, {
      update_id: state.offset,
      callback_query: {
        id: `child-${state.offset}`,
        from: { id: 30 },
        message: { message_id: 44, chat: { id: 30, type: 'private' } },
        data,
      },
    });
  const last = () => state.outbox.at(-1).payload;
  const button = (label) => {
    const option = last()
      .reply_markup?.inline_keyboard?.flat()
      .find((item) => item.text.includes(label));
    assert.ok(option, `Visible button not found: ${label}`);
    action(option.callback_data);
  };
  text('/start');
  button('Для детей');
  text('📚 Темы');
  button('A1');
  button('Выбрать раздел');
  button('Грамматика');
  button('To be');
  button('Правило');
  assert.match(last().text, /Простыми словами/u);
  assert.ok(last().entities.length > 0);
  button('Разделы темы');
  button('Примеры');
  assert.match(last().text, /Перевод/u);
  button('Практика');
  const attempt = state.attempts[state.users['30'].activeAttempt];
  const wrong = attempt.lesson.questions[0].options.findIndex(
    (value) => !attempt.lesson.questions[0].accepted.includes(value),
  );
  action(`a:${attempt.id}:0:${wrong}`);
  assert.ok(state.outbox.some((item) => item.payload.text?.includes('Давай разберёмся')));
  button('Подсказка');
  button('Вернуться к вопросу');
  assert.equal(attempt.answers.length, 1);
  for (let index = 1; index < attempt.lesson.questions.length; index++) {
    const question = attempt.lesson.questions[index];
    if (question.type === 'choice')
      action(`a:${attempt.id}:${index}:${question.options.indexOf(question.accepted[0])}`);
    else text(question.accepted[0]);
  }
  assert.ok(attempt.completedAt);
  button('Повторить только ошибки');
  const retry = state.attempts[state.users['30'].activeAttempt];
  assert.equal(retry.lesson.questions.length, 1);
  const question = retry.lesson.questions[0];
  action(`a:${retry.id}:0:${question.options.indexOf(question.accepted[0])}`);
  assert.equal(retry.answers[0].correct, true);
});

test('search cancels cleanly and filtered catalog returns to the same section', () => {
  const state = emptyState();
  const text = (value) =>
    handleUpdate(state, {
      update_id: state.offset,
      message: { from: { id: 30 }, chat: { id: 30, type: 'private' }, text: value },
    });
  const action = (data) =>
    handleUpdate(state, {
      update_id: state.offset,
      callback_query: {
        id: 'search',
        from: { id: 30 },
        message: { chat: { id: 30, type: 'private' } },
        data,
      },
    });
  text('🔎 Найти тему');
  text('семья');
  assert.ok(
    state.outbox
      .at(-1)
      .payload.reply_markup.inline_keyboard.flat()
      .some((button) => button.callback_data === 't:family'),
  );
  action('g:A1:vocabulary:1');
  action('t:family');
  assert.ok(
    state.outbox
      .at(-1)
      .payload.reply_markup.inline_keyboard.flat()
      .some((button) => button.callback_data === 'g:A1:vocabulary:1'),
  );
  text('🔎 Найти тему');
  action('home');
  assert.equal(state.users['30'].searching, false);
});
