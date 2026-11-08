import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyState } from '../../apps/bot/src/store.js';
import { handleUpdate } from '../../apps/bot/src/handler.js';
import { lessons } from '../../packages/content/catalog.js';
import { lessonSections } from '../../packages/content/presentation.js';

function harness() {
  const state = emptyState();
  const text = (id, body) => handleUpdate(state, { update_id: state.offset, message: { from: { id }, chat: { id, type: 'private' }, text: body } }, [], ['10']);
  const click = (id, data) => handleUpdate(state, { update_id: state.offset, callback_query: { id: `c-${state.offset}`, from: { id }, message: { message_id: 77, chat: { id, type: 'private' } }, data } }, [], ['10']);
  return { state, text, click, last: () => state.outbox.at(-1).payload };
}

test('every A1-A2 topic has examples and labelled official resources or collections', () => {
  const allowed = ['learnenglish.britishcouncil.org', 'learnenglishkids.britishcouncil.org', 'learnenglishteens.britishcouncil.org'];
  for (const lesson of lessons) {
    const sections = lessonSections(lesson);
    assert.ok(sections.rule.length >= 4, lesson.id);
    assert.ok(sections.examples.length >= 6, lesson.id);
    assert.ok(sections.traps.length >= 3, lesson.id);
    assert.ok(lesson.resources.length >= 1, lesson.id);
    assert.ok(lesson.version >= 1);
    for (const resource of lesson.resources) {
      const url = new URL(resource.url);
      assert.equal(url.protocol, 'https:');
      assert.ok(allowed.includes(url.hostname));
      assert.ok(resource.note && resource.checkedAt && resource.provider);
    }
  }
});

test('reading position resumes and resets safely when the teacher changes the version', () => {
  const { state, text, click, last } = harness();
  click(20, 's:articles:examples:2');
  assert.equal(state.users['20'].reading.page, 2);
  text(20, '/continue');
  assert.match(last().text, /шаг 3 из/u);
  text(10, '/edit articles');
  text(10, '/examples A new example. — Новый пример.');
  text(10, '/publish');
  text(20, '📍 Продолжить');
  assert.match(last().text, /шаг 1 из/u);
  assert.match(last().text, /A new example/u);
});

test('resources show a labelled external page and return to the same topic', () => {
  const { click, last } = harness();
  click(20, 'sources:prepositions-place');
  assert.match(last().text, /Hero/u);
  assert.match(last().text, /английском/u);
  assert.ok(last().reply_markup.inline_keyboard.some((row) => row.some((button) => button.url?.endsWith('/heros-adventure'))));
  assert.ok(last().reply_markup.inline_keyboard.at(-1).some((button) => button.callback_data === 't:prepositions-place'));
});

test('hint never consumes an answer, and repetition uses only the original mistaken question', () => {
  const { state, text, click, last } = harness();
  text(20, '/practice present-simple');
  const attempt = state.attempts[state.users['20'].activeAttempt];
  click(20, `hint:${attempt.id}:0`);
  click(20, `hint:${attempt.id}:0`);
  assert.equal(attempt.answers.length, 0);
  assert.deepEqual(attempt.hintsUsed, [0]);
  for (const [index, question] of attempt.lesson.questions.entries()) {
    if (question.type === 'choice') click(20, `a:${attempt.id}:${index}:${index === 0 ? 0 : question.options.indexOf(question.accepted[0])}`);
    else text(20, question.accepted[0]);
  }
  text(10, '/edit present-simple'); text(10, '/remove_question q1'); text(10, '/publish');
  click(30, `repeat:${attempt.id}`);
  assert.match(last().text, /твоей завершённой/u);
  click(20, `repeat:${attempt.id}`);
  const retry = state.attempts[state.users['20'].activeAttempt];
  assert.equal(retry.reviewOf, attempt.id);
  assert.equal(retry.assignmentId, null);
  assert.equal(retry.lesson.questions.length, 1);
  assert.deepEqual(retry.lesson.questions[0], attempt.lesson.questions[0]);
  click(20, `a:${retry.id}:0:1`);
  assert.ok(retry.completedAt);
  assert.equal(attempt.answers[0].correct, false);
  assert.equal(retry.answers[0].correct, true);
});
