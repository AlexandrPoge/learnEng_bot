import { harness } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('class consent, membership privacy, revocation and administrator access', () => {
  const h = harness();
  const { state, send, click, press, last } = h;
  send(10, '/new_class');
  send(10, 'Взрослые');
  press(10, 'A2');
  const c = Object.values(state.classes!)[0];
  press(10, 'Приглашение');
  const oldCode = Object.keys(state.classInvites!)[0];
  send(20, '/start');
  state.users['20'].teacherId = '11';
  send(20, `/join_class ${oldCode}`);
  assert.match(last(20).text!, /Ответы|ответы/u);
  assert.equal(c.studentIds.length, 0);
  press(20, 'Вступить');
  assert.deepEqual(c.studentIds, ['20']);
  assert.equal(state.users['20'].teacherId, '11');
  click(20, `class:accept:${oldCode}`);
  assert.equal(c.studentIds.length, 1);
  click(21, `class:students:${c.id}:0`);
  assert.match(last(21).text!, /недоступен/u);
  click(20, `class:invite:${c.id}`);
  assert.match(last(20).text!, /Настройки доступны/u);
  click(11, `class:view:${c.id}`);
  assert.match(last(11).text!, /недоступен/u);
  click(99, `class:students:${c.id}:0`);
  assert.ok(
    last(99)
      .reply_markup!.inline_keyboard!.flat()
      .some((b) => b.text.includes('User 20')),
  );
  click(10, `class:invite:${c.id}`);
  assert.notEqual(Object.keys(state.classInvites!)[0], oldCode);
  send(21, `/join_class ${oldCode}`);
  assert.match(last(21).text!, /недействительно/u);
  click(99, `class:remove:${c.id}:20`);
  assert.equal(c.studentIds.length, 1);
  press(99, 'Убрать из класса');
  assert.equal(c.studentIds.length, 0);
  send(99, '/remove_teacher 10');
  const newCode = Object.keys(state.classInvites!)[0];
  send(21, `/join_class ${newCode}`);
  assert.match(last(21).text!, /недействительно/u);
  click(10, `class:pick:${c.id}:0`);
  assert.match(last(10).text!, /недоступен/u);
});
