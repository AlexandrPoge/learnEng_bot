export function readConfig(env = process.env) {
  const token = env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token || !/^\d+:[A-Za-z0-9_-]+$/u.test(token)) {
    throw new Error('Укажите TELEGRAM_BOT_TOKEN из @BotFather в .env.');
  }
  const teacherIds = (env.TEACHER_IDS ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  const adminIds = (env.ADMIN_IDS ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  if ([...teacherIds, ...adminIds].some((id) => !/^[1-9]\d*$/u.test(id))) {
    throw new Error('TEACHER_IDS и ADMIN_IDS должны содержать положительные числовые ID через запятую.');
  }
  return { token, teacherIds, adminIds, dataFile: env.BOT_DATA_FILE || './data/bot.json' };
}
