import { harness } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { availableLessons } from '../../../apps/bot/src/editor.js';

test('visible Telegram journey: class → own homework → class assignment → test → teacher report', () => {
  const h = harness();
  const { state, send, press, click, last } = h;
  const c = h.makeClass();
  assert.deepEqual(c.studentIds, ['20', '21']);
  assert.deepEqual(c.lessonIds, ['present-simple']);
  send(20, '/classes');
  press(20, '3 класс');
  press(20, 'Темы класса');
  press(20, 'Present Simple');
  assert.ok(
    last(20)
      .reply_markup?.inline_keyboard?.flat()
      .some((b) => b.text === '🏫 Темы класса'),
  );
  const template = h.makeHomework();
  assert.equal(
    availableLessons(state).some((l) => l.id === template.id),
    false,
  );
  press(10, 'Назначить');
  press(10, '3 класс');
  press(10, 'Через 3');
  press(10, 'Проверочная');
  const confirm = last(10).reply_markup!.inline_keyboard![0][0].callback_data!;
  press(10, 'Назначить');
  click(10, confirm);
  const tasks = Object.values(state.assignments!);
  assert.equal(tasks.length, 2);
  assert.ok(tasks.every((a) => a.classId === c.id && a.mode === 'test'));
  assert.equal(new Set(tasks.map((a) => a.id)).size, 2);
  assert.equal(tasks[0].batchId, tasks[1].batchId);
  // Editing the reusable template leaves all sent work unchanged.
  send(99, `/edit_homework ${template.id}`);
  send(99, '/title Новое название');
  send(99, '/publish');
  assert.equal(tasks[0].lesson.title, 'Первое своё задание');
  assert.equal(state.homeworkTemplates![template.id].ownerId, '10');
  const task = tasks.find((a) => a.studentId === '20')!;
  click(21, `h:${task.id}`);
  assert.equal(state.users['21'].activeAttempt, null);
  click(20, `h:${task.id}`);
  const attempt = state.attempts[state.users['20'].activeAttempt!];
  assert.equal(attempt.teacherId, '10');
  assert.equal(
    last(20)
      .reply_markup?.inline_keyboard?.flat()
      .some((b) => b.text.includes('Подсказка')),
    false,
  );
  const before = state.outbox.length;
  click(20, `hint:${attempt.id}:0`);
  click(20, `review:${attempt.id}`);
  click(20, `a:${attempt.id}:0:0`); // wrong; do not reveal the key
  const response = state.outbox
    .slice(before)
    .filter((t) => t.payload.chat_id === '20')
    .map((t) => t.payload.text)
    .join('\n');
  assert.doesNotMatch(response, /Правильный ответ|She → is|Правильно: is/u);
  assert.equal(attempt.answers.length, 1);
  assert.equal(attempt.hintsUsed, undefined);
  send(20, 'am');
  assert.ok(task.completedAt);
  assert.equal(task.attemptId, attempt.id);
  assert.ok(
    h
      .payloads(10)
      .some(
        (p) =>
          p.text?.includes('Новое выполненное') &&
          p.text.includes('Между действиями') &&
          !p.text.includes('Ответ:'),
      ),
  );
  send(10, '/sent_homework');
  press(10, 'Первое своё задание');
  press(10, 'User 20');
  assert.match(last(10).text!, /Результат: 1\/2/u);
  assert.match(last(10).text!, /She → is/u);
  click(11, `work:result:${task.id}`);
  assert.match(last(11).text!, /Нет доступа/u);
  send(20, '/classes');
  press(20, '3 класс');
  press(20, 'Задания класса');
  assert.match(last(20).reply_markup!.inline_keyboard![0][0].text, /✅/u);
  press(20, 'Первое своё задание');
  assert.match(last(20).text!, /Правильно: is/u);
  assert.equal(state.attempts[attempt.id].answers.length, 2);
});
