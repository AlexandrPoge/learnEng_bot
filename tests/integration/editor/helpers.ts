import { expectValue, expectText } from '../../helpers/expectations.js';
import { emptyState } from '../../../apps/bot/src/store.js';
import { handleUpdate } from '../../../apps/bot/src/handler.js';

/** Общие данные и Telegram-действия для сценариев этого набора. */
export function setup() {
  const state = emptyState();
  let index = 0;
  const send = (id: number, text: string) =>
    handleUpdate(
      state,
      {
        update_id: index++,
        message: { from: { id, first_name: `User ${id}` }, chat: { id, type: 'private' }, text },
      },
      [],
      ['10'],
    );
  return { state, send, last: () => expectText(expectValue(state.outbox.at(-1)).payload) };
}
