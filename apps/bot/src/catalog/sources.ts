import { send, panel } from '../ui/messages.js';
import { accessibleLesson } from './access.js';
import type { BotState, User } from '../../../../packages/domain/types.js';

/** Подписанные внешние учебные источники. */
export function showSources(state: BotState, user: User, id: string, messageId?: number) {
  const lesson = accessibleLesson(state, user, id);
  if (!lesson) return send(state, user.id, 'Тема не найдена. /topics');
  const resources = lesson.resources ?? [];
  const descriptions = resources.map(
    (item, index) =>
      `${index + 1}. ${item.kind === 'video' ? '🎬' : '📖'} ${item.title}\n${item.provider} · проверено ${item.checkedAt}\n${item.note}`,
  );
  panel(
    state,
    user,
    `📍 ${lesson.level} → ${lesson.title}\n🎬 Видео и источники\n\n${descriptions.join('\n\n') || 'К этой теме пока нет дополнительных ссылок.'}\n\n💡 Это внешние страницы на английском. Сначала прочитай правило здесь, затем найди 2–3 знакомые фразы в материале. После видео вернись к примерам или практике.`,
    {
      inline_keyboard: [
        ...resources.map((item, index) => [
          {
            text: `${item.kind === 'video' ? '🎬 Смотреть' : '📖 Читать'} ${index + 1}: ${item.title}`,
            url: item.url,
          },
        ]),
        [
          { text: '🗂 К теме', callback_data: `t:${id}` },
          { text: '✏️ Практика', callback_data: `p:${id}` },
        ],
      ],
    },
    messageId,
  );
}
