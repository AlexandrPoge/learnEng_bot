import { expectValue } from '../../helpers/expectations.js';
import { harness } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleUpdate } from '../../../apps/bot/src/handler.js';

test('private templates, saved drafts and image uploads respect roles and survive JSON persistence', () => {
  const h = harness();
  const t = h.makeHomework();
  h.send(11, `/edit_homework ${t.id}`);
  assert.match(h.last(11).text!, /не найдено/u);
  h.click(11, `work:send:${t.id}`);
  assert.match(h.last(11).text!, /недоступно/u);
  h.send(20, `/lesson ${t.id}`);
  assert.match(h.last(20).text!, /не найдена/u);
  h.send(10, `/edit_homework ${t.id}`);
  h.press(10, 'Своя картинка');
  const restored = harness(JSON.parse(JSON.stringify(h.state)));
  handleUpdate(
    restored.state,
    {
      update_id: restored.state.offset,
      message: {
        from: { id: 10 },
        chat: { id: 10, type: 'private' },
        photo: [
          { file_id: 'small', width: 10, height: 10 },
          { file_id: 'large', width: 1080, height: 1300 },
        ],
      },
    },
    ['10'],
    ['99'],
  );
  restored.press(10, 'Опубликовать');
  assert.equal(restored.state.homeworkTemplates![t.id].lesson.rulePhoto, 'large');
  assert.equal(restored.state.homeworkTemplates![t.id].lesson.version, 2);
  restored.send(10, '/my_homework');
  restored.press(10, 'Первое своё');
  restored.press(10, 'Назначить');
  restored.state.users['20'].teacherId = '10'; // picker was empty before linking
  restored.click(10, `work:targets:${restored.state.users['10'].workspace!.nonce}:0`);
  restored.press(10, 'User 20');
  restored.press(10, 'Через 7');
  restored.press(10, 'Тренировка');
  restored.press(10, 'Назначить');
  const a = Object.values(restored.state.assignments!)[0];
  restored.click(20, `h:${a.id}`);
  restored.click(20, `image:${t.id}:0`);
  assert.equal(restored.state.outbox.at(-1)!.payload.photo, 'large');
  restored.click(21, `image:${t.id}:0`);
  assert.match(restored.last(21).text!, /недоступна/u);
  for (const task of restored.state.outbox)
    for (const b of task.payload.reply_markup?.inline_keyboard?.flat() ?? []) {
      if (b.callback_data) assert.ok(Buffer.byteLength(expectValue(b.callback_data)) <= 64, b.callback_data);
    }
});
