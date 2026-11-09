import { past, harness, assignment } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { homeworkStatus } from '../../../packages/domain/homework.js';

test('continue prioritizes active work, then nearest homework, reading and textbook without starting homework', () => {
  const h = harness();
  assert.deepEqual(h.last().reply_markup!.keyboard![0], ['📚 Учебник', '📍 Продолжить']);
  h.send(20, '/continue');
  assert.ok(h.buttons().some((button) => button.callback_data === 'book'));

  h.click(20, 's:articles:examples:2');
  h.send(20, '/continue');
  assert.match(h.last().text!, /шаг 3 из/u);

  assignment(h.state, 1);
  const nearest = assignment(h.state, 2, { deadline: past });
  assignment(h.state, 3, { studentId: '21', deadline: '1999-01-01T00:00:00Z' });
  h.send(20, '📍 Продолжить');
  assert.match(h.last().text!, /Работа 2/u);
  assert.match(h.last().text!, /ещё можно сдать/u);
  assert.equal(h.state.users['20'].activeAttempt, null);
  assert.equal(Object.keys(h.state.attempts).length, 0);

  h.press('Открыть ДЗ');
  const attempt = h.state.attempts[h.state.users['20'].activeAttempt!];
  assert.equal(attempt.assignmentId, nearest.id);
  const question = attempt.lesson.questions[0];
  if (question.type === 'choice') {
    h.click(20, `a:${attempt.id}:0:${question.options.indexOf(question.accepted[0])}`);
  } else {
    h.send(20, question.accepted[0]);
  }
  h.click(20, 'continue');
  assert.match(h.last().text!, /Отвечено: 1 из/u);
  assert.equal(attempt.answers.length, 1);
  assert.equal(homeworkStatus(h.state, nearest), 'overdue');
});
