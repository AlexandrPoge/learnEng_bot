import { emptyState } from '../apps/bot/src/store.js';
import { handleUpdate } from '../apps/bot/src/handler.js';
import { buildReport } from '../packages/domain/grading.js';
import { readConfig } from '../apps/bot/src/config.js';
import { telegramClient } from '../apps/bot/src/telegram.js';

// Только изолированные синтетические updates: в рабочий файл не записываются.
const state = emptyState();
let offset = 0;
function message(text: string) {
  handleUpdate(state, { update_id: offset++, message: {
    from: { id: 1, first_name: 'Демо-ученик' }, chat: { id: 1, type: 'private' }, text,
  } });
}
function answer(index: number, option: number) {
  const id = state.users['1'].activeAttempt;
  handleUpdate(state, { update_id: offset++, callback_query: {
    id: `demo-${offset}`, from: { id: 1 }, message: { chat: { id: 1, type: 'private' } }, data: `a:${id}:${index}:${option}`,
  } });
}
message('/practice present-simple');
answer(0, 1); answer(1, 2); message('plays'); answer(3, 1); message('watches');
const attempt = Object.values(state.attempts)[0];
const report = buildReport(attempt, 'Демо-ученик');
console.log(report);
if (process.argv.includes('--send-admin')) {
  try {
    const config = readConfig();
    if (!config.adminIds.length) throw new Error('Не настроен ADMIN_IDS.');
    const api = telegramClient(config.token);
    for (const id of config.adminIds) {
      const sent = await api('sendMessage', {
        chat_id: id,
        text: `ДЕМОНСТРАЦИЯ: синтетическое прохождение, не работа реального ученика. В прогресс не записано.\n\n${report}`,
      });
      console.log(`Демо доставлено администратору, message_id=${sent.message_id}`);
    }
  } catch (error) { console.error(`${error.message}. Для доставки администратор должен нажать /start у бота.`); process.exitCode = 1; }
}
