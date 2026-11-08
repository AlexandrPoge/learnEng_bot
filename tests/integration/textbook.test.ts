import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyState } from '../../apps/bot/src/store.js';
import { handleUpdate } from '../../apps/bot/src/handler.js';
import { mainMenu } from '../../apps/bot/src/navigation.js';
import { availableLessons } from '../../apps/bot/src/editor.js';
import { schoolYears, schoolLessons } from '../../packages/content/school.js';
import { lessons, validateCatalog } from '../../packages/content/catalog.js';

function harness() {
  const state = emptyState();
  const send = (id: number, text: string) => handleUpdate(state, { update_id: state.offset, message: { from: { id }, chat: { id, type: 'private' }, text } }, ['10'], ['99']);
  const click = (id: number, data: string) => handleUpdate(state, { update_id: state.offset, callback_query: { id: `cb-${state.offset}`, from: { id }, message: { message_id: 100, chat: { id, type: 'private' } }, data } }, ['10'], ['99']);
  const last = (id = 20) => state.outbox.filter(t => t.method === 'sendMessage' && t.payload.chat_id === String(id)).at(-1)!.payload;
  const press = (label: string, id = 20) => {
    const b = last(id).reply_markup?.inline_keyboard?.flat().find(b => b.text.includes(label));
    assert.ok(b?.callback_data, `No visible button: ${label} in ${last(id).text}`); click(id, b.callback_data);
  };
  return { state, send, click, last, press };
}

test('school selections contain real published topics, cover the library and include senior B1-B2 material', () => {
  const all = new Set<string>();
  for (const year of schoolYears) {
    assert.equal(new Set(year.lessonIds).size, year.lessonIds.length);
    assert.ok(year.lessonIds.every(id => lessons.some(l => l.id === id)));
    const items = schoolLessons(year.grade, lessons); assert.ok(items.length);
    items.forEach(l => all.add(l.id));
    if (year.grade >= 8) assert.ok(items.some(l => l.level === 'B1' || l.level === 'B2'));
  }
  assert.equal(all.size, lessons.length);
  const override = { ...lessons[0], schoolGrades: [7] };
  assert.equal(schoolLessons(1, [override]).length, 0); assert.equal(schoolLessons(7, [override]).length, 1);
  assert.equal(schoolLessons(1, [{ ...override, schoolGrades: [] }]).length, 0);
  assert.throws(() => validateCatalog([{ ...override, schoolGrades: [12] }]), /классы/u);
});

test('public textbook opens both routes without creating or joining a teacher group', () => {
  const h = harness(); h.send(20, '/start'); h.send(20, '📚 Учебник');
  h.press('По школьным классам'); h.press('3 класс'); h.press('Грамматика'); h.press('Времена'); h.press('Present Simple');
  assert.match(h.last().text!, /Учебник → 3 класс/u);
  h.press('Правило'); assert.match(h.last().text!, /Учебник → 3 класс/u);
  assert.equal(h.state.classes, undefined); assert.equal(h.state.invites && Object.keys(h.state.invites).length, 0);
  assert.equal(h.state.users['20'].teacherId, undefined); assert.equal(h.state.users['20'].activeAttempt, null);
  h.press('Темы класса'); h.press('Разделы 3 класса'); h.press('Другой класс'); h.press('По уровням'); h.press('A2');
  assert.equal(h.state.users['20'].schoolCatalog, undefined);
  assert.equal(h.state.users['20'].catalog?.level, 'A2');
  assert.ok(h.last().reply_markup?.inline_keyboard?.flat().some(b => b.callback_data === 't:past-simple'));
  assert.ok(mainMenu().keyboard!.flat().includes('📚 Учебник'));
  assert.equal(mainMenu().keyboard!.flat().includes('🏫 Мои классы'), false);
});

test('school reading retains the exact page and section, with honest revision labels and invalid-page handling', () => {
  const h = harness(); h.send(20, '/school 4'); h.press('Все темы класса'); h.press('Дальше');
  const saved = structuredClone(h.state.users['20'].schoolCatalog);
  const topic = h.last().reply_markup!.inline_keyboard![0][0]; h.click(20, topic.callback_data!);
  h.press('Правило'); h.send(20, '/continue'); h.press('Темы класса');
  assert.deepEqual(h.state.users['20'].schoolCatalog, saved);
  assert.match(h.last().text!, /Страница 2/u);
  h.send(20, '/school 11'); assert.match(h.last().text!, /B1–B2/u);
  h.click(20, 'school:0'); assert.match(h.last().text!, /не найден/u);
  h.click(20, 'school:4:all:999'); assert.match(h.last().text!, /не доступна/u);
  h.send(20, '/search family'); h.press('Семья'); assert.equal(h.state.users['20'].schoolCatalog, undefined);
});

test('teacher can reclassify a topic by school grade while its level and existing attempts are preserved', () => {
  const h = harness(); h.send(20, '/practice alphabet'); const attempt = h.state.attempts[h.state.users['20'].activeAttempt!];
  h.send(10, '/edit alphabet'); h.click(10, 'editor:grades'); h.send(10, '12');
  assert.equal(h.state.editors!['10'].inputField, 'school_grades');
  h.send(10, '5, 6'); h.send(10, '/publish');
  assert.deepEqual(h.state.lessonOverrides!.alphabet.schoolGrades, [5, 6]);
  assert.equal(schoolLessons(1, availableLessons(h.state)).some(l => l.id === 'alphabet'), false);
  assert.equal(schoolLessons(5, availableLessons(h.state)).some(l => l.id === 'alphabet'), true);
  assert.equal(h.state.lessonOverrides!.alphabet.level, 'A1'); assert.equal(attempt.lesson.schoolGrades, undefined);
  h.send(21, '/edit alphabet'); assert.match(h.last(21).text!, /доступен репетитору/u);
  h.send(10, '/edit alphabet'); h.send(10, '/school_grades 0'); h.send(10, '/publish');
  assert.equal(schoolYears.some(y => schoolLessons(y.grade, availableLessons(h.state)).some(l => l.id === 'alphabet')), false);
  assert.equal(availableLessons(h.state).find(l => l.id === 'alphabet')?.level, 'A1');
});

test('all school routes have usable callbacks and training marks the shared topic as completed', () => {
  const h = harness();
  for (const year of schoolYears) {
    h.send(20, `/school ${year.grade}`); h.press('Все темы класса');
    for (const b of h.last().reply_markup!.inline_keyboard!.flat()) if (b.callback_data) assert.ok(Buffer.byteLength(b.callback_data) <= 64);
  }
  h.send(20, '/school 1'); h.press('Все темы класса'); h.press('Алфавит'); h.press('Практика');
  const attempt = h.state.attempts[h.state.users['20'].activeAttempt!];
  for (const [i, q] of attempt.lesson.questions.entries()) {
    if (q.type === 'choice') h.click(20, `a:${attempt.id}:${i}:${q.options.indexOf(q.accepted[0])}`);
    else h.send(20, q.accepted[0]);
  }
  h.send(20, '/school 2'); assert.match(h.last().text!, /Пройдено тем: 1 из/u);
  h.press('Все темы класса'); assert.match(h.last().reply_markup!.inline_keyboard![0][0].text, /^✅/u);
  h.send(20, '👥 Учебные группы'); assert.match(h.last().text!, /Групп пока нет/u);
  h.send(20, '📚 Учебник'); h.press('По школьным классам'); h.press('2 класс');
  assert.equal(h.state.users['20'].classContext, undefined); assert.equal(h.state.users['20'].schoolCatalog?.grade, 2);
});
