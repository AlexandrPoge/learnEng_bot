import { readConfig } from '../apps/bot/src/config.mjs';
import { telegramClient } from '../apps/bot/src/telegram.mjs';
import { configureProfile } from '../apps/bot/src/profile.mjs';

try {
  const config = readConfig();
  const api = telegramClient(config.token);
  const me = await api('getMe');
  // Команды в личном чате доступны после первого /start. Общий профиль
  // настраивается и без него; повторите setup после /start для меню админа.
  try { await configureProfile(api, config.adminIds); }
  catch (error) { if (error.code !== 400) throw error; console.log('Профиль обновлён; персональное меню требует первого /start администратором.'); }
  console.log(`Telegram подключён: @${me.username}`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
