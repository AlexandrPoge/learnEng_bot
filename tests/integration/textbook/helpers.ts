import assert from 'node:assert/strict';
import { emptyState } from '../../../apps/bot/src/store.js';
import { handleUpdate } from '../../../apps/bot/src/handler.js';

/** Общие данные и Telegram-действия для сценариев этого набора. */
export function harness() {
  const state = emptyState();
  const send = (id: number, text: string) =>
    handleUpdate(
      state,
      { update_id: state.offset, message: { from: { id }, chat: { id, type: 'private' }, text } },
      ['10'],
      ['99'],
    );
  const click = (id: number, data: string) =>
    handleUpdate(
      state,
      {
        update_id: state.offset,
        callback_query: {
          id: `cb-${state.offset}`,
          from: { id },
          message: { message_id: 100, chat: { id, type: 'private' } },
          data,
        },
      },
      ['10'],
      ['99'],
    );
  const last = (id = 20) =>
    state.outbox.filter((t) => t.method === 'sendMessage' && t.payload.chat_id === String(id)).at(-1)!
      .payload;
  const press = (label: string, id = 20) => {
    const b = last(id)
      .reply_markup?.inline_keyboard?.flat()
      .find((b) => b.text.includes(label));
    assert.ok(b?.callback_data, `No visible button: ${label} in ${last(id).text}`);
    click(id, b.callback_data);
  };
  return { state, send, click, last, press };
}
