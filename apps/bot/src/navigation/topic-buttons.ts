import type { Lesson, ReplyMarkup } from '../../../../packages/domain/types.js';

/** Действия карточки темы. */
export function topicButtons(lesson: Lesson, page?: number, backData?: string): ReplyMarkup {
  const rows = [
    [
      { text: '📖 Правило', callback_data: `s:${lesson.id}:rule:0` },
      { text: '💡 Примеры', callback_data: `s:${lesson.id}:examples:0` },
    ],
    [{ text: '🖼 Правило на картинке', callback_data: `image:${lesson.id}:0` }],
    [
      { text: '⚠️ Ловушки', callback_data: `s:${lesson.id}:traps:0` },
      { text: '✏️ Практика', callback_data: `p:${lesson.id}` },
    ],
    [{ text: '🎬 Видео и источники', callback_data: `sources:${lesson.id}` }],
    [
      {
        text:
          backData?.startsWith('class:') || backData?.startsWith('school:')
            ? '🏫 Темы класса'
            : `📚 Темы ${lesson.level}`,
        callback_data: backData ?? `l:${lesson.level}:${page ?? 0}`,
      },
      { text: '🏠 Меню', callback_data: 'home' },
    ],
  ];
  return { inline_keyboard: rows };
}
