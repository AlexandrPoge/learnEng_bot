import { past, harness, assignment } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { homeworkStatus } from '../../../packages/domain/homework.js';

test('homework uses one message, five-item pages, deadline order, states and safe stale pages', () => {
  const h = harness();
  const pending = Array.from({ length: 7 }, (_, index) =>
    assignment(h.state, index + 1, {
      deadline: `2099-01-${String(7 - index).padStart(2, '0')}T00:00:00Z`,
    }),
  );
  const late = assignment(h.state, 8, { deadline: past, completedAt: '2001-01-01T00:00:00Z' });
  const submitted = assignment(h.state, 9, { completedAt: '2020-01-01T00:00:00Z' });
  const foreign = assignment(h.state, 10, { studentId: '21' });
  const before = h.state.outbox.length;
  h.send(20, '/homework');
  assert.equal(h.state.outbox.slice(before).filter((task) => task.method === 'sendMessage').length, 1);
  assert.equal(h.buttons().filter((button) => button.callback_data?.startsWith('h:')).length, 5);
  assert.equal(
    h.buttons().find((button) => button.callback_data?.startsWith('h:'))!.callback_data,
    `h:${pending[6].id}`,
  );
  assert.match(h.last().text!, /Не начато/u);
  h.press('Дальше');
  assert.match(h.last().text!, /Страница 2 из 2/u);
  assert.match(h.last().text!, /Сдано с опозданием/u);
  assert.match(h.last().text!, /✅ Сдано ·/u);
  h.press('Сданы');
  assert.deepEqual(
    h
      .buttons()
      .filter((button) => button.callback_data?.startsWith('h:'))
      .map((button) => button.callback_data),
    [`h:${submitted.id}`, `h:${late.id}`],
  );

  h.click(20, `h:${foreign.id}`);
  assert.equal(h.state.users['20'].activeAttempt, null);
  assert.match(h.last().text!, /недоступно/u);
  h.click(20, 'homework:pending:9999');
  assert.match(h.last().text!, /Страница 2 из 2/u);

  h.click(20, `h:${pending[0].id}`);
  assert.equal(homeworkStatus(h.state, pending[0]), 'active');
  h.send(20, '/homework');
  h.press('Дальше');
  assert.match(h.last().text!, /В процессе/u);
  h.send(20, '/cancel');
  assert.equal(homeworkStatus(h.state, pending[0]), 'new');
  pending[0].deadline = past;
  assert.equal(homeworkStatus(h.state, pending[0]), 'overdue');
});
