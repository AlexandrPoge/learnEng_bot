import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyState } from '../../apps/bot/src/store.js';
import { handleUpdate } from '../../apps/bot/src/handler.js';
import { lessons } from '../../packages/content/catalog.js';
import { lessonSections, sectionPages } from '../../packages/content/presentation.js';

function harness() {
  const state = emptyState();
  const text = (id, value) => handleUpdate(state, { update_id: state.offset, message: { from: { id }, chat: { id, type: 'private' }, text: value } }, ['20'], ['10']);
  const click = (id, data) => handleUpdate(state, { update_id: state.offset, callback_query: { id: `cb-${state.offset}`, from: { id }, message: { message_id: 50, chat: { id, type: 'private' } }, data } }, ['20'], ['10']);
  return { state, text, click, last: () => state.outbox.at(-1) };
}

test('all 106 topics have icons, simple explanations, and separate short sections', () => {
  assert.equal(lessons.length, 106);
  assert.deepEqual([...new Set(lessons.map((item) => item.level))], ['A1', 'A2', 'B1', 'B2']);
  for (const lesson of lessons) {
    assert.ok(lesson.icon && lesson.goal && lesson.memory && lesson.childIntro, lesson.id);
    const sections = lessonSections(lesson);
    for (const section of ['rule', 'examples', 'traps']) {
      assert.ok(sections[section].length, `${lesson.id}/${section}`);
      assert.ok(sectionPages(lesson, section).every((page) => page.length <= 650), lesson.id);
    }
  }
});

test('child or adult mode changes presentation, never permissions or answers', () => {
  const { state, text, click, last } = harness();
  text(30, '/start');
  assert.equal(last().payload.reply_markup.inline_keyboard[0][0].callback_data, 'mode:child');
  click(30, 'mode:child');
  assert.equal(state.users['30'].learningMode, 'child');
  click(30, 's:to-be:rule:0');
  assert.match(last().payload.text, /слово-связка/u);
  click(30, 'mode:adult');
  click(30, 's:to-be:rule:0');
  assert.equal(last().payload.text.includes('слово-связка'), false);
  text(30, '🛠 Админ');
  assert.match(last().payload.text, /администратору/u);
  assert.equal(Object.hasOwn(state.users['30'], 'birthday'), false);
});

test('inline navigation sends a new card at the bottom and retires the previous controls', () => {
  const { state, text, click, last } = harness();
  text(30, '/lesson articles');
  assert.equal(last().method, 'sendMessage');
  assert.equal(last().payload.text.includes('I see a dog'), false);
  click(30, 's:articles:examples:0');
  assert.equal(last().method, 'sendMessage');
  assert.ok(state.outbox.some((task) => task.method === 'editMessageReplyMarkup' && task.payload.message_id === 50));
  assert.ok(state.outbox.some((task) => task.method === 'answerCallbackQuery' && task.payload.text.includes('внизу')));
  assert.match(last().payload.text, /I see a dog/u);
  assert.equal(Object.keys(state.attempts).length, 0);
  click(30, 's:articles:examples:999');
  assert.match(last().payload.text, /недоступна/u);
  click(30, 't:articles');
  assert.ok(last().payload.reply_markup.inline_keyboard.some((row) => row.some((button) => button.text === '✏️ Практика')));
});

test('teacher buttons edit only their chosen section and enforce permissions', () => {
  const { state, text, click, last } = harness();
  text(20, '👩‍🏫 Кабинет');
  assert.ok(last().payload.reply_markup.keyboard.flat().includes('✏️ Редактор'));
  text(20, '✏️ Редактор');
  assert.ok(last().payload.reply_markup.inline_keyboard[0][0].callback_data.startsWith('edit:'));
  click(30, 'edit:articles');
  assert.match(last().payload.text, /доступен репетитору/u);
  click(20, 'edit:articles');
  const original = lessonSections(state.editors['20'].lesson);
  click(20, 'editor:examples');
  text(20, 'A cat. — Кошка.\nThe cat is small. — Эта кошка маленькая.');
  const updated = lessonSections(state.editors['20'].lesson);
  assert.deepEqual(updated.rule, original.rule);
  assert.deepEqual(updated.traps, original.traps);
  assert.equal(updated.examples.length, 2);
  click(20, 'editor:rule');
  text(20, '📚 Темы');
  assert.equal(state.editors['20'].inputField, 'rule');
  assert.deepEqual(lessonSections(state.editors['20'].lesson).rule, original.rule);
});

test('teacher welcome is delivered once on first start; unknown text is safe', () => {
  const { state, text, click } = harness();
  state.teacherWelcome = { '20': true };
  text(20, '/start');
  assert.equal(state.teacherWelcome['20'], undefined);
  assert.equal(state.outbox.filter((task) => task.payload.text?.includes('Вам выданы права')).length, 1);
  text(20, '/start');
  assert.equal(state.outbox.filter((task) => task.payload.text?.includes('Вам выданы права')).length, 1);
  text(30, 'constructor');
  text(30, 'toString');
  click(30, 'constructor');
});

test('answer review uses the attempt snapshot and is private to its student', () => {
  const { state, text, click, last } = harness();
  text(30, '/practice to-be');
  const attempt = state.attempts[state.users['30'].activeAttempt];
  for (const [index, question] of attempt.lesson.questions.entries()) {
    if (question.type === 'choice') click(30, `a:${attempt.id}:${index}:${question.options.indexOf(question.accepted[0])}`);
    else text(30, question.accepted[0]);
  }
  click(30, `review:${attempt.id}`);
  assert.equal(last().method, 'sendMessage');
  assert.match(last().payload.text, /Твой ответ: am/u);
  click(40, `review:${attempt.id}`);
  assert.match(last().payload.text, /твоей практики/u);
});
