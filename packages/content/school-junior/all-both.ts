import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: all-both. Порядок курса задан в school-junior.ts. */
export const allBothLesson = schoolUnit(
  'all-both',
  'All / both / neither / none',
  'A2',
  [5, 6, 7],
  'nouns',
  '👥',
  'Скажи «оба», «все» и «никто».',
  'both — оба · neither — ни один из двух · all — все',
  [
    'Both относится к двум: both hands — обе руки.',
    'Neither тоже относится к двум, но отрицает оба варианта.',
    'All относится ко всей группе; none — ни один из этой группы.',
    'Перед конкретным определителем часто нужен of: both of my friends; all of these books.',
  ],
  [
    'Both sisters can swim. — Обе сестры умеют плавать.',
    'Neither answer is right. — Ни один из двух ответов не верен.',
    'All five pupils are here. — Все пять учеников здесь.',
    'None of the three keys fits. — Ни один из трёх ключей не подходит.',
    'Both of my hands are cold. — Обе мои руки холодные.',
    'All of these cards are blue. — Все эти карточки синие.',
  ],
  [
    'Для двух используй both, когда важно «оба».',
    '❌ both of hands → ✅ both hands / both of my hands.',
    'Neither — два варианта; none — группа любого размера, часто больше двух.',
  ],
  [
    gap('___ hands: обе руки. (both/all)', 'both', 'Рук две → both.'),
    choice('Ни один из двух:', ['neither', 'both', 'every'], 'neither', 'Neither отрицает оба варианта.'),
    gap('Both ___ my friends are here.', 'of', 'Перед my friends используем both of.'),
    choice('Все пять:', ['all five', 'both five', 'neither five'], 'all five', 'Группа из пяти — all.'),
    choice(
      'Ни один из трёх:',
      ['none of the three', 'neither of the three', 'both of the three'],
      'none of the three',
      'Для трёх здесь подходит none.',
    ),
  ],
);
