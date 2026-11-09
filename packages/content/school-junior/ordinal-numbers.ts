import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: ordinal-numbers. Порядок курса задан в school-junior.ts. */
export const ordinalNumbersLesson = schoolUnit(
  'ordinal-numbers',
  'Порядковые числительные: first, second, third',
  'A1',
  [3, 4, 5],
  'modifiers',
  '🥇',
  'Назови место в очереди и этаж.',
  'one → first · two → second · three → third',
  [
    'Количественное числительное отвечает «сколько?», порядковое — «который?».',
    'Первые три формы особые: first, second, third.',
    'У многих остальных есть -th: fourth, sixth. Есть изменения: fifth, ninth, twelfth.',
    'Для конкретного места часто нужен the: the first lesson. После my артикля нет: my first lesson.',
  ],
  [
    'This is my first lesson. — Это мой первый урок.',
    'She came second. — Она пришла второй.',
    'We live on the third floor. — Мы живём на третьем этаже.',
    'Take the fifth card. — Возьми пятую карточку.',
    'It is his ninth birthday. — Это его девятый день рождения.',
    'The twenty-first page is missing. — Не хватает двадцать первой страницы.',
  ],
  [
    '❌ on the three floor → ✅ on the third floor.',
    'Five → fifth, а не fiveth.',
    'У составного числа меняется последняя часть: twenty-one → twenty-first.',
  ],
  [
    gap('Порядковое от one: ___', 'first', 'One → first.'),
    gap('Порядковое от three: ___', 'third', 'Three → third.'),
    choice('Пятый:', ['fifth', 'fiveth', 'fiveths'], 'fifth', 'Особая форма fifth.'),
    gap('The twenty-___ page. (первый)', 'first', 'Порядковой становится последняя часть.'),
    choice(
      'Выбери верную фразу.',
      ['my first book', 'my the first book', 'my one-th book'],
      'my first book',
      'После my артикль the не ставим.',
    ),
  ],
);
