import type { BotCommand, TelegramApi } from '../../../packages/domain/types.js';
export const publicCommands: BotCommand[] = [
  { command: 'menu', description: '🏠 Главное меню' },
  { command: 'start', description: 'Начать обучение' },
  { command: 'topics', description: 'Темы английского по уровням' },
  { command: 'search', description: '🔎 Найти тему по названию' },
  { command: 'practice', description: 'Начать или продолжить практику' },
  { command: 'continue', description: '📍 Продолжить с места остановки' },
  { command: 'progress', description: 'Мои результаты' },
  { command: 'homework', description: 'Назначенные домашние задания' },
  { command: 'classes', description: '🏫 Классы, темы и домашние задания' },
  { command: 'join_class', description: 'Вступить в класс по коду' },
  { command: 'cancel_setup', description: 'Закрыть настройку класса или назначения' },
  { command: 'cancel', description: 'Отменить текущую попытку' },
  { command: 'whoami', description: 'Мой Telegram ID и роль' },
  { command: 'help', description: 'Помощь и команды' },
  { command: 'mode', description: '⚙️ Подача для детей или взрослых' },
];

export async function configureProfile(api: TelegramApi, adminIds: string[]) {
  await api('setMyName', { name: 'English · Уроки и практика' });
  await api('setMyDescription', { description: 'Английский для детей и взрослых: темы A1–A2, понятные объяснения, примеры, ловушки и практика. Репетитор может создавать уроки и получать ответы учеников. Нажми «Начать», затем выбери тему.' });
  await api('setMyShortDescription', { short_description: 'Английский A1–A2: темы, упражнения и обратная связь. Практика самостоятельно или с репетитором.' });
  await api('setMyCommands', { commands: publicCommands });
  for (const id of adminIds) {
    await api('setMyCommands', { scope: { type: 'chat', chat_id: id }, commands: [
      ...publicCommands,
      { command: 'admin', description: 'Управление и роли' },
      { command: 'editor', description: 'Редактор учебных материалов' },
      { command: 'teacher', description: '👩‍🏫 Кабинет репетитора' },
      { command: 'my_homework', description: '📝 Создать и назначить своё ДЗ' },
      { command: 'new_class', description: '🏫 Создать класс или группу' },
      { command: 'sent_homework', description: '📤 Сдача работ, ответы и время' },
      { command: 'invite', description: 'Пригласить ученика' },
      { command: 'results', description: 'Работы учеников' },
    ] });
  }
}
