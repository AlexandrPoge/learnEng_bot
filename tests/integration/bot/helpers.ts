import { emptyState } from '../../../apps/bot/src/store.js';
import { handleUpdate } from '../../../apps/bot/src/handler.js';

/** Общие данные и Telegram-действия для сценариев этого набора. */
export function harness() {
  const state = emptyState();
  let updateId = 0;
  const text = (id: number, body: string) => {
    const update = {
      update_id: updateId++,
      message: { from: { id, first_name: `User ${id}` }, chat: { id, type: 'private' }, text: body },
    };
    handleUpdate(state, update, ['10', '11']);
    return update;
  };
  const action = (id: number, data: string) =>
    handleUpdate(
      state,
      {
        update_id: updateId++,
        callback_query: {
          id: `cb${updateId}`,
          from: { id },
          message: { chat: { id, type: 'private' } },
          data,
        },
      },
      ['10', '11'],
    );
  const click = (id: number, attemptId: string, index: number, option: number) =>
    action(id, `a:${attemptId}:${index}:${option}`);
  return { state, text, click, action };
}
