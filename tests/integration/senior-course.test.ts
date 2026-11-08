import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleUpdate } from '../../apps/bot/src/handler.js';
import { emptyState } from '../../apps/bot/src/store.js';
import { schoolJunior } from '../../packages/content/school-junior.js';
import { schoolSenior } from '../../packages/content/school-senior.js';
import { grammarStrands, lessonStrand, schoolLessons } from '../../packages/content/school.js';
import { lessons } from '../../packages/content/catalog.js';

function harness() {
  const state = emptyState();
  const send = (id: number, text: string) => handleUpdate(state, { update_id: state.offset, message: { from: { id }, chat: { id, type: 'private' }, text } }, ['10'], ['99']);
  const click = (id: number, data: string) => handleUpdate(state, { update_id: state.offset, callback_query: { id: `cb${state.offset}`, from: { id }, message: { message_id: 100, chat: { id, type: 'private' } }, data } }, ['10'], ['99']);
  const last = (id: number) => state.outbox.filter(t => t.method === 'sendMessage' && t.payload.chat_id === String(id)).at(-1)!.payload;
  const press = (id: number, label: string) => { const b = last(id).reply_markup?.inline_keyboard?.flat().find(b => b.text.includes(label)); assert.ok(b?.callback_data, `${label}: ${last(id).text}`); click(id, b.callback_data); };
  return { state, send, click, last, press };
}

test('school grammar chapters preserve return position and B2 level sections are reachable', () => {
  const h = harness(); h.send(20, '/school 10'); h.press(20, 'Грамматика'); h.press(20, 'Времена');
  const context = structuredClone(h.state.users['20'].schoolCatalog);
  assert.equal(context?.strand, 'tenses'); h.press(20, 'Future Perfect'); h.press(20, 'Правило'); h.send(20, '/continue'); h.press(20, 'Темы класса');
  assert.deepEqual(h.state.users['20'].schoolCatalog, context); h.press(20, 'Блоки грамматики'); h.press(20, 'Предложения'); h.press(20, 'Third Conditional');
  assert.equal(h.state.users['20'].selectedLesson, 'third-conditional');
  h.send(20, '/topics B2'); h.press(20, 'Выбрать раздел'); h.press(20, 'Грамматика');
  assert.equal(h.state.users['20'].catalog?.level, 'B2'); assert.equal(h.state.users['20'].schoolCatalog, undefined);
  h.send(20, '/lesson passive'); h.press(20, 'источники');
  assert.match(h.last(20).text!, /Фоксфорд/u); assert.ok(h.last(20).reply_markup!.inline_keyboard!.flat().some(b => b.url?.endsWith('glagoly-v-stradatelnom-zaloge-passive-voice')));
  h.send(20, '/lesson lets'); h.press(20, 'источники'); assert.match(h.last(20).text!, /общий каталог/u);
});

test('new topics are complete units with balanced choice keys and available school chapters', () => {
  const added = [...schoolJunior, ...schoolSenior]; assert.equal(added.length, 40);
  assert.equal(added.reduce((n, l) => n + l.questions.length, 0), 200);
  const positions = new Set<number>();
  for (const lesson of added) {
    assert.ok(lesson.schoolGrades.length); assert.ok(grammarStrands[lessonStrand(lesson)]);
    for (const grade of lesson.schoolGrades) assert.ok(schoolLessons(grade, lessons).some(l => l.id === lesson.id));
    for (const q of lesson.questions) if (q.type === 'choice') positions.add(q.options.indexOf(q.accepted[0]));
    assert.ok(lesson.resources.every(r => r.provider === 'Фоксфорд Учебник' && r.language === 'ru'));
  }
  assert.deepEqual([...positions].sort(), [0, 1, 2]);
});

test('teacher groups and private homework accept B1-B2 with unchanged role checks', () => {
  const h = harness(); h.send(10, '/new_class'); h.send(10, 'Старшие'); h.press(10, 'B2');
  const group = Object.values(h.state.classes!)[0]; assert.equal(group.level, 'B2');
  h.press(10, 'Добавить темы'); assert.ok(h.last(10).reply_markup!.inline_keyboard!.flat().some(b => b.text.includes('Third Conditional')));
  h.press(10, 'Third Conditional'); assert.deepEqual(group.lessonIds, ['third-conditional']);
  h.send(10, '/new_homework'); h.send(10, 'Проба B1'); h.press(10, 'Уровень'); h.press(10, 'B1');
  assert.equal(h.state.editors!['10'].lesson.level, 'B1');
  h.click(20, `class:pick:${group.id}:0`); assert.match(h.last(20).text!, /недоступен/u);
});
