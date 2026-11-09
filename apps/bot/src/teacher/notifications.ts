import { send, panel } from '../ui/messages.js';
import type { BotState, User, Access } from '../../../../packages/domain/types.js';

/** Настройка кратких уведомлений о сдаче. */
export function showNotifications(state: BotState, user: User, access: Access, messageId?: number) {
  if (!access.teacher) return send(state, user.id, 'Настройка доступна репетитору и администратору.');
  panel(
    state,
    user,
    `🔔 Результаты учеников\n\nСейчас: ${user.resultNotifications === 'off' ? '🔕 уведомления выключены' : '🔔 короткие уведомления'}.\n\n🔔 Коротко — одно сообщение после сдачи: имя, задание, оценка и время. Ответы открываются по кнопке.\n\n🔕 Тихо — бот сохраняет работы без уведомлений. Смотри их в кабинете → «📊 Работы учеников».`,
    {
      inline_keyboard: [
        [{ text: '🔔 Короткие уведомления', callback_data: 'notify:compact' }],
        [{ text: '🔕 Без уведомлений', callback_data: 'notify:off' }],
        [{ text: '📊 Работы учеников', callback_data: 'results:0' }],
      ],
    },
    messageId,
  );
}
