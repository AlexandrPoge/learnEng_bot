import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: zero-article. Порядок курса задан в school-junior.ts. */
export const zeroArticleLesson = schoolUnit(
  'zero-article',
  'Нулевой артикль: когда a и the не нужны',
  'A1',
  [4, 5, 6],
  'nouns',
  '⭕',
  'Говори о предметах и веществах в целом.',
  'Cats like milk · I like music',
  [
    'Без артикля часто говорим о множестве в целом: Cats are animals.',
    'Неисчисляемое в общем значении тоже без артикля: Water is important.',
    'Языки и школьные предметы обычно без артикля: English, maths.',
    'Конкретное знакомое вещество или множество может требовать the: the water in this glass.',
  ],
  [
    'Dogs need exercise. — Собакам нужна активность.',
    'I like music. — Я люблю музыку.',
    'We study English. — Мы изучаем английский.',
    'Rice is easy to cook. — Рис легко готовить.',
    'The rice on my plate is hot. — Рис на моей тарелке горячий.',
    'Books can teach us a lot. — Книги могут многому научить.',
  ],
  [
    'Не ставь a перед обычным неисчисляемым: не a rice.',
    'Общее значение и конкретный предмет требуют разных решений.',
    'Единственное исчисляемое обычно требует определителя: a book / my book.',
  ],
  [
    choice(
      'О музыке вообще:',
      ['I like music.', 'I like a music.', 'I like an music.'],
      'I like music.',
      'Music неисчисляемое в общем значении.',
    ),
    choice(
      'Нужен ли артикль перед English в We study English?',
      ['Нет', 'Всегда a', 'Всегда the'],
      'Нет',
      'Названия языков обычно без артикля.',
    ),
    gap('Вставь the или —: ___ water in this bottle is cold.', 'the', 'Уточнение делает воду конкретной.'),
    choice(
      'О кошках вообще:',
      ['Cats sleep a lot.', 'A cats sleep a lot.', 'An cats sleep a lot.'],
      'Cats sleep a lot.',
      'Множественное число в общем значении — без артикля.',
    ),
    choice(
      'Выбери единственное исчисляемое с определителем.',
      ['I have a book.', 'I have book.', 'I have an books.'],
      'I have a book.',
      'Для одного book нужен определитель.',
    ),
  ],
);
