import assert from 'node:assert/strict';
import { emptyState } from '../../../apps/bot/src/store.js';
import { handleUpdate } from '../../../apps/bot/src/handler.js';
import type { BotState } from '../../../packages/domain/types.js';

/** Общие данные и Telegram-действия для сценариев этого набора. */
export function harness(initial: BotState = emptyState()) {
  const state = initial;
  const send = (id: number, text: string) =>
    handleUpdate(
      state,
      {
        update_id: state.offset,
        message: { from: { id, first_name: `User ${id}` }, chat: { id, type: 'private' }, text },
      },
      ['10', '11'],
      ['99'],
    );
  const click = (id: number, data: string) =>
    handleUpdate(
      state,
      {
        update_id: state.offset,
        callback_query: {
          id: `cb-${state.offset}`,
          from: { id, first_name: `User ${id}` },
          message: { message_id: state.offset + 1, chat: { id, type: 'private' } },
          data,
        },
      },
      ['10', '11'],
      ['99'],
    );
  const payloads = (id: number) =>
    state.outbox.filter((t) => t.payload.chat_id === String(id)).map((t) => t.payload);
  const last = (id: number) =>
    payloads(id)
      .filter((p) => p.text)
      .at(-1)!;
  const press = (id: number, label: string) => {
    const b = last(id)
      .reply_markup?.inline_keyboard?.flat()
      .find((b) => b.text.includes(label));
    assert.ok(b?.callback_data, `No visible button «${label}» in ${last(id).text}`);
    click(id, b.callback_data);
  };
  const seek = (id: number, label: string) => {
    for (let i = 0; i < 20; i++) {
      if (
        last(id)
          .reply_markup?.inline_keyboard?.flat()
          .some((b) => b.text.includes(label))
      )
        return press(id, label);
      press(id, 'Дальше');
    }
    assert.fail(`No item ${label}`);
  };
  const makeClass = () => {
    send(10, '/classes');
    press(10, 'Создать группу');
    send(10, '3 класс');
    press(10, 'A1');
    const c = Object.values(state.classes!)[0];
    press(10, 'Добавить темы');
    seek(10, 'Present Simple');
    press(10, 'Готово');
    press(10, 'Приглашение');
    const code = Object.keys(state.classInvites!)[0];
    for (const sid of [20, 21]) {
      send(sid, `/join_class ${code}`);
      press(sid, 'Вступить');
    }
    return c;
  };
  const makeHomework = () => {
    send(10, '/my_homework');
    press(10, 'Создать своё ДЗ');
    send(10, 'Первое своё задание');
    press(10, 'Вопрос');
    press(10, 'Варианты ответа');
    send(10, 'She ___ happy.');
    send(10, 'am\nis\nare');
    send(10, '2');
    send(10, 'She → is.');
    press(10, 'Вопрос');
    press(10, 'Вписать ответ');
    send(10, 'I ___ a pupil.');
    send(10, 'am');
    send(10, 'I → am.');
    press(10, 'Опубликовать');
    return Object.values(state.homeworkTemplates!)[0];
  };
  return { state, send, click, press, seek, payloads, last, makeClass, makeHomework };
}
