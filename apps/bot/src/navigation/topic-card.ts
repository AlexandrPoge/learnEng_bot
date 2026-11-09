import { richText } from '../format.js';
import type { Lesson } from '../../../../packages/domain/types.js';

/** Вводная карточка темы. */
export function topicCard(lesson: Lesson, child: boolean, path?: string) {
  return richText()
    .add(`${lesson.icon ?? '📘'} ${lesson.title}`, 'bold')
    .add(
      `\n\n${path ? `${path}\n` : ''}🌱 Уровень ${lesson.level}\n⏱ Около ${lesson.estimatedMinutes} минут`,
    )
    .add('\n\n🎯 Чему научимся\n', 'bold')
    .add(lesson.goal ?? 'Разберись с темой и потренируйся.')
    .add('\n\n🧭 Порядок урока\n', 'bold')
    .add('1. 📖 Правило\n2. 💡 Примеры\n3. ⚠️ Ловушки\n4. ✏️ Практика')
    .add(child ? '\n\nНачни с правила. Не спеши — шаги короткие.' : '\n\nВыбери раздел на кнопках ниже.')
    .build();
}
