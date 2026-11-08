import { readConfig } from '../apps/bot/src/config.js';
import { telegramClient } from '../apps/bot/src/telegram.js';
import { handleUpdate } from '../apps/bot/src/handler.js';
import { emptyState } from '../apps/bot/src/store.js';
import { mainMenu } from '../apps/bot/src/navigation.js';

// Only administrator previews; no changes to the live state or student work.
try {
  const config = readConfig();
  const api = telegramClient(config.token);
  for (const id of config.adminIds) {
    await api('sendMessage', { chat_id: id, text: '📚 Обновил учебник\n\nТеперь выбирай «По школьным классам» или «По уровням A1–A2». Группу учеников создавать не нужно.\n\n📊 Результаты учеников сохраняются автоматически. Репетитору приходит только краткое уведомление с кнопкой открытия работы. В /notifications можно включить тихий режим.', reply_markup: mainMenu({ teacher: true, admin: true }) });
    const state = emptyState();
    handleUpdate(state, { update_id: 0, message: { from: { id: Number(id) }, chat: { id: Number(id), type: 'private' }, text: '/textbook' } }, config.teacherIds, config.adminIds);
    for (const task of state.outbox) if (task.method === 'sendMessage') {
      const sent = await api('sendMessage', task.payload);
      console.log(`Учебник доставлен администратору; message_id=${sent.message_id}`);
    }
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
