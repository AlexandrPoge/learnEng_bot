import { readConfig } from '../apps/bot/src/config.js';
import { telegramClient } from '../apps/bot/src/telegram.js';
import { deliverTask } from '../apps/bot/src/delivery.js';
import { emptyState } from '../apps/bot/src/store.js';
import { mainMenu } from '../apps/bot/src/navigation.js';
import { getLesson } from '../packages/content/catalog.js';

// Sends only to configured administrators. Does not create students or assignments.
try {
  const config = readConfig();
  if (!config.adminIds.length) throw new Error('Не настроен ADMIN_IDS.');
  const api = telegramClient(config.token);
  for (const id of config.adminIds) {
    const menu = await api('sendMessage', { chat_id: id,
      text: '✅ Обновление бота\n\n🏫 Мои классы — создай класс, выбери темы и пригласи учеников.\n📝 Мои ДЗ — добавь свои вопросы и ключи, затем назначь ученику или классу.\n📤 Отправленные работы — сдача, ответы и время.\n\nОткрой «👩‍🏫 Кабинет». Для пробы при назначении выбери «🧪 Себе».\n\nНиже — пример правила на картинке. Это демонстрация, не назначенное ДЗ.', reply_markup: mainMenu({ teacher: true, admin: true }) });
    await deliverTask(emptyState(), { id: 'preview', method: 'sendPhoto', requiredTeacher: false,
      payload: { chat_id: id, caption: '🖼 Present Simple · пример карточки правила', reply_markup: { inline_keyboard: [
        [{ text: '🏫 Мои классы', callback_data: 'class:list:0' }, { text: '📝 Мои ДЗ', callback_data: 'work:list:0' }],
        [{ text: '📖 Правило текстом', callback_data: 's:present-simple:rule:0' }, { text: '🖼 Следующая страница', callback_data: 'image:present-simple:1' }],
      ] } }, ruleCard: { lesson: getLesson('present-simple')!, page: 0 },
    }, api);
    console.log(`Меню и пример PNG доставлены администратору; message_id=${menu.message_id}`);
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
