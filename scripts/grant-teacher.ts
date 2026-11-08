import { readConfig } from '../apps/bot/src/config.js';
import { openStore } from '../apps/bot/src/store.js';
import { telegramClient } from '../apps/bot/src/telegram.js';

const id = process.argv[2];
if (!/^[1-9]\d*$/u.test(id ?? '')) throw new Error('Укажите числовой Telegram ID. Сначала остановите бот.');
const config = readConfig();
const store = await openStore(config.dataFile);
try {
  const next = structuredClone(store.state);
  next.teacherIds = [...new Set([...(next.teacherIds ?? []), id])];
  next.revokedTeacherIds = (next.revokedTeacherIds ?? []).filter((value) => value !== id);
  next.teacherWelcome ??= {};
  next.teacherWelcome[id] = true;
  await store.commit(next);
  console.log(`Права репетитора сохранены: ${id}`);
  try {
    const api = telegramClient(config.token);
    const message = await api('sendMessage', {
      chat_id: id,
      text: 'Вам выданы права репетитора в English · Уроки и практика 👩‍🏫\n\n/editor — создавать и исправлять уроки\n/invite — пригласить ученика\n/students — ваши ученики\n/results — ответы и результаты\n\nНачните с /start. Для правки темы: /edit present-simple, затем /preview. Изменения видны ученикам после /publish.',
    });
    const notified = structuredClone(store.state);
    delete notified.teacherWelcome?.[id];
    await store.commit(notified);
    console.log(`Уведомление доставлено: message_id=${message.message_id}`);
  } catch (error) {
    console.log(`Уведомление пока не доставлено (${error.message}). Оно сохранено для первого /start.`);
  }
} finally { await store.close(); }
