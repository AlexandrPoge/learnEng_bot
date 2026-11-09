import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: little-few. Порядок курса задан в school-junior.ts. */
export const littleFewLesson = schoolUnit(
  'little-few',
  'A little / a few: немного или почти нет',
  'A2',
  [5, 6, 7],
  'nouns',
  '🫘',
  'Различай количество для исчисляемого и неисчисляемого.',
  'a few books · a little water',
  [
    'A few — несколько исчисляемых предметов: a few coins.',
    'A little — немного неисчисляемого: a little juice.',
    'Few / little без a часто подчёркивают нехватку: почти нет.',
    'Сначала реши, можно ли посчитать существительное, затем выбери выражение.',
  ],
  [
    'I have a few coins. — У меня есть несколько монет.',
    'Add a little milk. — Добавь немного молока.',
    'We have few chairs. — Стульев у нас мало.',
    'There is little time. — Времени почти нет.',
    'She knows a few words. — Она знает несколько слов.',
    'We have a little time to talk. — У нас есть немного времени поговорить.',
  ],
  [
    '❌ a few water → ✅ a little water.',
    '❌ a little apples → ✅ a few apples.',
    'Наличие a меняет акцент: a little — немного есть; little — почти нет.',
  ],
  [
    gap('A ___ apples. (few/little)', 'few', 'Apples можно посчитать.'),
    gap('A ___ sugar. (few/little)', 'little', 'Sugar здесь неисчисляемое.'),
    choice(
      'Почти нет времени:',
      ['little time', 'few time', 'a few time'],
      'little time',
      'Little без a подчёркивает нехватку.',
    ),
    choice(
      'Несколько друзей:',
      ['a few friends', 'a little friends', 'little friends quantity'],
      'a few friends',
      'Friends — исчисляемое множественное.',
    ),
    gap('There is a ___ water left. (little/few)', 'little', 'Для water — a little.'),
  ],
);
