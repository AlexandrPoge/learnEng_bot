import { recordId, past, future, harness, assignment, completedAttempt } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('teacher batch filters retain page when returning, hide unfinished scores and enforce current roles', () => {
  const h = harness();
  const batchId = recordId(100);
  const tasks = Array.from({ length: 9 }, (_, index) => {
    const studentId = String(20 + index);
    h.state.users[studentId] = { id: studentId, name: `Pupil ${index}`, activeAttempt: null };
    return assignment(h.state, index + 1, { studentId, batchId, deadline: index < 6 ? past : future });
  });
  const finished = completedAttempt(h.state, 20, 'finished', [true], { studentId: tasks[8].studentId });
  tasks[8].completedAt = finished.completedAt;
  tasks[8].attemptId = finished.id;
  const active = completedAttempt(h.state, 21, 'active', [false], {
    studentId: tasks[0].studentId,
    completedAt: null,
    assignmentId: tasks[0].id,
  });
  h.state.users[tasks[0].studentId].activeAttempt = active.id;

  h.click(10, `work:batch:${batchId}:0`); // old callback
  assert.match(h.last(10).text!, /Сдано: 1 из 9/u);
  assert.match(h.last(10).text!, /Не сдали: 8/u);
  assert.match(h.last(10).text!, /Просрочено: 6/u);
  h.press('Не сдали', 10);
  h.press('Дальше', 10);
  assert.match(h.last(10).text!, /Не сдали · Страница 2 из 2/u);
  h.press('Pupil 5', 10);
  h.press('К работе', 10);
  assert.match(h.last(10).text!, /Не сдали · Страница 2 из 2/u);
  h.press('Просрочено', 10);
  h.press('Pupil 0', 10);
  assert.doesNotMatch(h.last(10).text!, /Ответ:|Результат:|saved-answer/u);
  h.press('К работе', 10);
  assert.match(h.last(10).text!, /Просрочено · Страница 1 из 2/u);

  h.click(10, `work:result:${tasks[8].id}`); // old callback
  assert.match(h.last(10).text!, /Результат: 1\/1/u);
  assert.equal(h.state.outbox.at(-1)!.requiredTeacher, true);
  h.click(11, `work:result:${tasks[8].id}:0:submitted`);
  assert.match(h.last(11).text!, /Нет доступа/u);
  h.click(20, `work:batch:${batchId}:0:all`);
  assert.match(h.last(20).text!, /доступно репетитору/u);
  h.click(99, `work:batch:${batchId}:0:submitted`);
  assert.match(h.last(99).text!, /Сдали · Страница 1 из 1/u);

  h.send(99, '/remove_teacher 10');
  h.click(10, `work:result:${tasks[8].id}`);
  assert.match(h.last(10).text!, /доступно репетитору/u);
  h.click(10, `work:batch:${batchId}:0:all`);
  assert.match(h.last(10).text!, /доступно репетитору/u);
});
