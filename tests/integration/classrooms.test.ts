import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyState } from '../../apps/bot/src/store.js';
import { handleUpdate } from '../../apps/bot/src/handler.js';
import { availableLessons } from '../../apps/bot/src/editor.js';
import type { BotState } from '../../packages/domain/types.js';

function harness(initial: BotState = emptyState()) {
  const state = initial;
  const send = (id: number, text: string) => handleUpdate(state, { update_id: state.offset, message: { from: { id, first_name: `User ${id}` }, chat: { id, type: 'private' }, text } }, ['10', '11'], ['99']);
  const click = (id: number, data: string) => handleUpdate(state, { update_id: state.offset, callback_query: { id: `cb-${state.offset}`, from: { id, first_name: `User ${id}` }, message: { message_id: state.offset + 1, chat: { id, type: 'private' } }, data } }, ['10', '11'], ['99']);
  const payloads = (id: number) => state.outbox.filter(t => t.payload.chat_id === String(id)).map(t => t.payload);
  const last = (id: number) => payloads(id).filter(p => p.text).at(-1)!;
  const press = (id: number, label: string) => {
    const b = last(id).reply_markup?.inline_keyboard?.flat().find(b => b.text.includes(label));
    assert.ok(b?.callback_data, `No visible button «${label}» in ${last(id).text}`);
    click(id, b.callback_data);
  };
  const seek = (id: number, label: string) => {
    for (let i = 0; i < 20; i++) {
      if (last(id).reply_markup?.inline_keyboard?.flat().some(b => b.text.includes(label))) return press(id, label);
      press(id, 'Дальше');
    }
    assert.fail(`No item ${label}`);
  };
  const makeClass = () => {
    send(10, '/classes'); press(10, 'Создать класс'); send(10, '3 класс'); press(10, 'A1');
    const c = Object.values(state.classes!)[0];
    press(10, 'Добавить темы'); seek(10, 'Present Simple'); press(10, 'Готово');
    press(10, 'Приглашение');
    const code = Object.keys(state.classInvites!)[0];
    for (const sid of [20, 21]) { send(sid, `/join_class ${code}`); press(sid, 'Вступить'); }
    return c;
  };
  const makeHomework = () => {
    send(10, '/my_homework'); press(10, 'Создать своё ДЗ'); send(10, 'Первое своё задание');
    press(10, 'Вопрос'); press(10, 'Варианты ответа'); send(10, 'She ___ happy.'); send(10, 'am\nis\nare'); send(10, '2'); send(10, 'She → is.');
    press(10, 'Вопрос'); press(10, 'Вписать ответ'); send(10, 'I ___ a pupil.'); send(10, 'am'); send(10, 'I → am.');
    press(10, 'Опубликовать');
    return Object.values(state.homeworkTemplates!)[0];
  };
  return { state, send, click, press, seek, payloads, last, makeClass, makeHomework };
}

test('visible Telegram journey: class → own homework → class assignment → test → teacher report', () => {
  const h = harness(); const { state, send, press, click, last } = h;
  const c = h.makeClass();
  assert.deepEqual(c.studentIds, ['20', '21']); assert.deepEqual(c.lessonIds, ['present-simple']);
  send(20, '/classes'); press(20, '3 класс'); press(20, 'Темы класса'); press(20, 'Present Simple');
  assert.ok(last(20).reply_markup?.inline_keyboard?.flat().some(b => b.text === '🏫 Темы класса'));
  const template = h.makeHomework();
  assert.equal(availableLessons(state).some(l => l.id === template.id), false);
  press(10, 'Назначить'); press(10, '3 класс'); press(10, 'Через 3'); press(10, 'Проверочная');
  const confirm = last(10).reply_markup!.inline_keyboard![0][0].callback_data!;
  press(10, 'Назначить'); click(10, confirm);
  const tasks = Object.values(state.assignments!);
  assert.equal(tasks.length, 2); assert.ok(tasks.every(a => a.classId === c.id && a.mode === 'test'));
  assert.equal(new Set(tasks.map(a => a.id)).size, 2);
  assert.equal(tasks[0].batchId, tasks[1].batchId);
  // Editing the reusable template leaves all sent work unchanged.
  send(99, `/edit_homework ${template.id}`); send(99, '/title Новое название'); send(99, '/publish');
  assert.equal(tasks[0].lesson.title, 'Первое своё задание');
  assert.equal(state.homeworkTemplates![template.id].ownerId, '10');
  const task = tasks.find(a => a.studentId === '20')!;
  click(21, `h:${task.id}`); assert.equal(state.users['21'].activeAttempt, null);
  click(20, `h:${task.id}`);
  const attempt = state.attempts[state.users['20'].activeAttempt!];
  assert.equal(attempt.teacherId, '10');
  assert.equal(last(20).reply_markup?.inline_keyboard?.flat().some(b => b.text.includes('Подсказка')), false);
  const before = state.outbox.length;
  click(20, `hint:${attempt.id}:0`);
  click(20, `review:${attempt.id}`);
  click(20, `a:${attempt.id}:0:0`); // wrong; do not reveal the key
  const response = state.outbox.slice(before).filter(t => t.payload.chat_id === '20').map(t => t.payload.text).join('\n');
  assert.doesNotMatch(response, /Правильный ответ|She → is|Правильно: is/u);
  assert.equal(attempt.answers.length, 1); assert.equal(attempt.hintsUsed, undefined);
  send(20, 'am');
  assert.ok(task.completedAt); assert.equal(task.attemptId, attempt.id);
  assert.ok(h.payloads(10).some(p => p.text?.includes('Ответ: am') && p.text.includes('Между действиями')));
  send(10, '/sent_homework'); press(10, 'Первое своё задание'); press(10, 'User 20');
  assert.match(last(10).text!, /Результат: 1\/2/u); assert.match(last(10).text!, /She → is/u);
  click(11, `work:result:${task.id}`); assert.match(last(11).text!, /Нет доступа/u);
  send(20, '/classes'); press(20, '3 класс'); press(20, 'Задания класса');
  assert.match(last(20).reply_markup!.inline_keyboard![0][0].text, /✅/u);
  press(20, 'Первое своё задание'); assert.match(last(20).text!, /Правильно: is/u);
  assert.equal(state.attempts[attempt.id].answers.length, 2);
});

test('class consent, membership privacy, revocation and administrator access', () => {
  const h = harness(); const { state, send, click, press, last } = h;
  send(10, '/new_class'); send(10, 'Взрослые'); press(10, 'A2'); const c = Object.values(state.classes!)[0];
  press(10, 'Приглашение'); const oldCode = Object.keys(state.classInvites!)[0];
  send(20, '/start'); state.users['20'].teacherId = '11';
  send(20, `/join_class ${oldCode}`);
  assert.match(last(20).text!, /Ответы|ответы/u); assert.equal(c.studentIds.length, 0);
  press(20, 'Вступить'); assert.deepEqual(c.studentIds, ['20']); assert.equal(state.users['20'].teacherId, '11');
  click(20, `class:accept:${oldCode}`); assert.equal(c.studentIds.length, 1);
  click(21, `class:students:${c.id}:0`); assert.match(last(21).text!, /недоступен/u);
  click(20, `class:invite:${c.id}`); assert.match(last(20).text!, /Настройки доступны/u);
  click(11, `class:view:${c.id}`); assert.match(last(11).text!, /недоступен/u);
  click(99, `class:students:${c.id}:0`); assert.ok(last(99).reply_markup!.inline_keyboard!.flat().some(b => b.text.includes('User 20')));
  click(10, `class:invite:${c.id}`); assert.notEqual(Object.keys(state.classInvites!)[0], oldCode);
  send(21, `/join_class ${oldCode}`); assert.match(last(21).text!, /недействительно/u);
  click(99, `class:remove:${c.id}:20`); assert.equal(c.studentIds.length, 1);
  press(99, 'Убрать из класса'); assert.equal(c.studentIds.length, 0);
  send(99, '/remove_teacher 10'); const newCode = Object.keys(state.classInvites!)[0];
  send(21, `/join_class ${newCode}`); assert.match(last(21).text!, /недействительно/u);
  click(10, `class:pick:${c.id}:0`); assert.match(last(10).text!, /недоступен/u);
});

test('changing recipients, expired deadline, stale callbacks and revoked roles cannot assign', () => {
  const h = harness(); const { state, send, press, click, last } = h; const c = h.makeClass();
  send(10, '/my_homework'); press(10, 'тему учебника'); h.seek(10, 'To be');
  press(10, '3 класс'); press(10, 'Через 1'); press(10, 'Тренировка');
  const confirm = last(10).reply_markup!.inline_keyboard![0][0].callback_data!;
  c.studentIds.pop(); press(10, 'Назначить'); assert.equal(Object.values(state.assignments ?? {}).length, 0);
  click(10, confirm); assert.equal(Object.values(state.assignments ?? {}).length, 0);
  send(10, '/my_homework'); press(10, 'тему учебника'); h.seek(10, 'To be');
  press(10, 'User 20'); send(10, '2099-02-30T18:00+03:00'); assert.match(last(10).text!, /Нужна будущая дата/u);
  send(10, '2099-11-20T18:00+03:00'); press(10, 'Тренировка');
  const pending = state.users['10'].workspace;
  assert.equal(pending?.kind, 'assign'); if (pending?.kind === 'assign') pending.deadline = '2000-01-01T00:00:00.000Z';
  press(10, 'Назначить'); assert.equal(Object.values(state.assignments ?? {}).length, 0);
  send(10, '/my_homework'); press(10, 'тему учебника'); h.seek(10, 'To be'); press(10, 'User 20'); press(10, 'Через 3'); press(10, 'Тренировка');
  const nextConfirm = last(10).reply_markup!.inline_keyboard![0][0].callback_data!;
  send(99, '/remove_teacher 10'); click(10, nextConfirm); assert.equal(Object.values(state.assignments ?? {}).length, 0);
});

test('private templates, saved drafts and image uploads respect roles and survive JSON persistence', () => {
  const h = harness(); const t = h.makeHomework();
  h.send(11, `/edit_homework ${t.id}`); assert.match(h.last(11).text!, /не найдено/u);
  h.click(11, `work:send:${t.id}`); assert.match(h.last(11).text!, /недоступно/u);
  h.send(20, `/lesson ${t.id}`); assert.match(h.last(20).text!, /не найдена/u);
  h.send(10, `/edit_homework ${t.id}`); h.press(10, 'Своя картинка');
  const restored = harness(JSON.parse(JSON.stringify(h.state)));
  handleUpdate(restored.state, { update_id: restored.state.offset, message: { from: { id: 10 }, chat: { id: 10, type: 'private' }, photo: [{ file_id: 'small', width: 10, height: 10 }, { file_id: 'large', width: 1080, height: 1300 }] } }, ['10'], ['99']);
  restored.press(10, 'Опубликовать'); assert.equal(restored.state.homeworkTemplates![t.id].lesson.rulePhoto, 'large');
  assert.equal(restored.state.homeworkTemplates![t.id].lesson.version, 2);
  restored.send(10, '/my_homework'); restored.press(10, 'Первое своё'); restored.press(10, 'Назначить');
  restored.state.users['20'].teacherId = '10'; // picker was empty before linking
  restored.click(10, `work:targets:${restored.state.users['10'].workspace!.nonce}:0`);
  restored.press(10, 'User 20'); restored.press(10, 'Через 7'); restored.press(10, 'Тренировка'); restored.press(10, 'Назначить');
  const a = Object.values(restored.state.assignments!)[0]; restored.click(20, `h:${a.id}`);
  restored.click(20, `image:${t.id}:0`);
  assert.equal(restored.state.outbox.at(-1)!.payload.photo, 'large');
  restored.click(21, `image:${t.id}:0`); assert.match(restored.last(21).text!, /недоступна/u);
  for (const task of restored.state.outbox) for (const b of task.payload.reply_markup?.inline_keyboard?.flat() ?? []) {
    if (b.callback_data) assert.ok(Buffer.byteLength(b.callback_data) <= 64, b.callback_data);
  }
});

test('class corrections, homework level and question editing work through buttons', () => {
  const h = harness(); const { state, send, press } = h;
  const c = h.makeClass();
  send(10, '/classes'); press(10, '3 класс'); press(10, 'Название класса'); send(10, 'Подростки');
  assert.equal(c.name, 'Подростки'); press(10, 'Уровень класса'); press(10, 'A2');
  assert.equal(c.level, 'A2'); assert.deepEqual(c.lessonIds, ['present-simple']);
  press(10, 'Добавить темы'); press(10, 'Present Simple'); assert.deepEqual(c.lessonIds, []);
  const t = h.makeHomework(); send(10, `/edit_homework ${t.id}`);
  press(10, 'Уровень'); press(10, 'A2'); press(10, 'Изменить вопросы'); press(10, 'She ___');
  press(10, 'Заменить вопрос'); press(10, 'Вписать ответ'); send(10, 'He ___ happy.'); send(10, 'is'); send(10, 'He → is.');
  press(10, 'Изменить вопросы'); press(10, 'I ___'); press(10, 'Удалить из черновика'); press(10, 'Опубликовать');
  const updated = state.homeworkTemplates![t.id].lesson;
  assert.equal(updated.level, 'A2'); assert.equal(updated.questions.length, 1); assert.equal(updated.questions[0].prompt, 'He ___ happy.');
  press(10, 'Назначить'); press(10, 'Себе'); press(10, 'Через 1'); press(10, 'Тренировка'); press(10, 'Назначить');
  assert.equal(Object.values(state.assignments!)[0].studentId, '10');
});
