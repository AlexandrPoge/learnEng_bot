import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyState } from '../../apps/bot/src/store.js';
import { handleUpdate } from '../../apps/bot/src/handler.js';

test('five individually assigned students produce five compact notices, with full work opened on demand', () => {
  const state = emptyState();
  const send = (id: number, text: string) => handleUpdate(state, { update_id: state.offset, message: { from: { id, first_name: `Ученик ${id}` }, chat: { id, type: 'private' }, text } }, ['10', '11'], ['99']);
  const click = (id: number, data: string) => handleUpdate(state, { update_id: state.offset, callback_query: { id: `cb-${state.offset}`, from: { id }, message: { chat: { id, type: 'private' } }, data } }, ['10', '11'], ['99']);
  const last = (id: number) => state.outbox.filter(t => t.method === 'sendMessage' && t.payload.chat_id === String(id)).at(-1)!.payload;
  const topics = ['to-be', 'present-simple', 'articles', 'past-simple', 'family'];
  const attempts: string[] = [];
  for (const [i, topic] of topics.entries()) {
    const sid = 20 + i; send(sid, '/start'); state.users[String(sid)].teacherId = '10';
    send(10, `/assign ${sid} ${topic} 2099-11-20T18:00+03:00`);
    const assignment = Object.values(state.assignments!).find(a => a.studentId === String(sid))!;
    click(sid, `h:${assignment.id}`);
    const attempt = state.attempts[state.users[String(sid)].activeAttempt!]; attempts.push(attempt.id);
    for (const [index, q] of attempt.lesson.questions.entries()) {
      if (q.type === 'choice') click(sid, `a:${attempt.id}:${index}:${q.options.indexOf(q.accepted[0])}`);
      else send(sid, q.accepted[0]);
    }
  }
  assert.equal(Object.values(state.assignments!).length, 5);
  assert.deepEqual(Object.values(state.assignments!).map(a => a.lesson.id), topics);
  const notices = state.outbox.filter(t => t.payload.chat_id === '10' && t.payload.text?.includes('Новое выполненное'));
  assert.equal(notices.length, 5);
  assert.ok(notices.every(n => n.requiredTeacher && n.payload.text!.length < 800 && !n.payload.text!.includes('Ответ:')));
  for (const notice of notices) assert.ok(notice.payload.reply_markup!.inline_keyboard!.flat().some(b => b.text === '🔎 Посмотреть работу'));
  send(10, '/results'); assert.equal(last(10).reply_markup!.inline_keyboard!.flat().filter(b => b.callback_data?.startsWith('report:')).length, 5);
  assert.doesNotMatch(last(10).text!, /Ответ:/u);
  click(10, `report:${attempts[0]}`); assert.match(last(10).text!, /Ответ: am/u);
  for (const id of [11, 21]) { click(id, `report:${attempts[0]}`); assert.match(last(id).text!, /Нет доступа/u); }
  click(99, `report:${attempts[0]}`); assert.match(last(99).text!, /Ответ: am/u);
  send(10, '/notifications'); click(10, 'notify:off');
  assert.equal(JSON.parse(JSON.stringify(state)).users['10'].resultNotifications, 'off');
  const before = state.outbox.length;
  send(20, '/practice to-be'); const quiet = state.attempts[state.users['20'].activeAttempt!];
  for (const [index, q] of quiet.lesson.questions.entries()) {
    if (q.type === 'choice') click(20, `a:${quiet.id}:${index}:${q.options.indexOf(q.accepted[0])}`);
    else send(20, q.accepted[0]);
  }
  assert.ok(quiet.completedAt);
  assert.equal(state.outbox.slice(before).filter(t => t.payload.chat_id === '10').length, 0);
  send(10, '/results'); assert.match(last(10).text!, /Сдано работ: 6/u);
  click(10, 'results:1'); assert.equal(last(10).reply_markup!.inline_keyboard!.flat().filter(b => b.callback_data?.startsWith('report:')).length, 1);
  click(20, 'notify:off'); assert.match(last(20).text!, /доступна репетитору/u);
  assert.equal(state.users['20'].resultNotifications, undefined);
  click(10, 'notify:compact'); assert.equal(state.users['10'].resultNotifications, 'compact');
});
