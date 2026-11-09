import { enqueue, send } from '../ui/messages.js';
import { accessibleLesson } from '../catalog/access.js';
import { showSources } from '../catalog/sources.js';
import type { CallbackContext } from '../routing/context.js';
import { randomUUID } from 'node:crypto';
import { ruleImagePages } from '../rule-layout.js';

export function handleMediaCallback(request: CallbackContext): boolean {
  const { state, id, user, data, messageId } = request;
  const sourceMatch = /^sources:([a-z0-9-]{1,40})$/u.exec(data);
  if (sourceMatch) {
    showSources(state, user, sourceMatch[1], messageId);
    return true;
  }
  const imageMatch = /^image:([a-z0-9-]{1,40}):(\d+)$/u.exec(data);
  if (imageMatch) {
    const lesson = accessibleLesson(state, user, imageMatch[1]);
    const page = Number(imageMatch[2]);
    const pages = lesson?.rulePhoto ? 1 : lesson ? ruleImagePages(lesson).length : 0;
    if (!lesson || !Number.isInteger(page) || page < 0 || page >= pages) {
      send(state, id, 'Карточка недоступна. /topics');
      return true;
    }
    if (messageId)
      enqueue(state, 'editMessageReplyMarkup', {
        chat_id: id,
        message_id: messageId,
        reply_markup: { inline_keyboard: [] },
      });
    const arrows = [];
    if (page > 0) arrows.push({ text: '⬅️ Назад', callback_data: `image:${lesson.id}:${page - 1}` });
    if (page + 1 < pages) arrows.push({ text: 'Дальше ➡️', callback_data: `image:${lesson.id}:${page + 1}` });
    state.outbox.push({
      id: randomUUID(),
      method: 'sendPhoto',
      requiredTeacher: false,
      payload: {
        chat_id: id,
        ...(lesson.rulePhoto ? { photo: lesson.rulePhoto } : {}),
        caption: `🖼 ${lesson.title}\n🌱 ${lesson.level} · ${page + 1}/${pages}`,
        reply_markup: {
          inline_keyboard: [
            ...(arrows.length ? [arrows] : []),
            [
              { text: '📖 Правило текстом', callback_data: `s:${lesson.id}:rule:0` },
              { text: '🗂 К теме', callback_data: `t:${lesson.id}` },
            ],
          ],
        },
      },
      ...(lesson.rulePhoto ? {} : { ruleCard: { lesson: structuredClone(lesson), page } }),
    });
    return true;
  }
  return false;
}
