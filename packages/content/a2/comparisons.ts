import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: comparisons. Порядок курса задан в a2.ts. */
export const comparisonsLesson = lesson(
  'comparisons',
  'Сравнительная и превосходная степень',
  'A2',
  [
    'Короткие прилагательные: small → smaller → the smallest.',
    'Длинные прилагательные: interesting → more interesting → the most interesting.',
    'Неправильные: good → better → the best; bad → worse → the worst. Сравнение: than.',
  ],
  [
    'This bag is cheaper than that one. — Эта сумка дешевле той.',
    'She is the tallest person in the room. — Она самая высокая в комнате.',
  ],
  ['Не more better: better уже сравнительная степень.', 'Big → bigger, happy → happier.'],
  [
    choice(
      'My room is ___ than yours.',
      ['small', 'smaller', 'smallest'],
      'smaller',
      'Сравнение двух комнат: smaller than.',
    ),
    gap('Напиши сравнительную степень good: ___', 'better', 'Неправильная форма: better.'),
    choice(
      'This is ___ interesting book in the library.',
      ['more', 'the most', 'most than'],
      'the most',
      'Превосходная степень длинного прилагательного: the most.',
    ),
    gap('Напиши сравнительную степень big: ___', 'bigger', 'Удваиваем g: bigger.'),
    choice(
      'Choose the correct sentence.',
      ['She is more better now.', 'She is better now.', 'She is best than now.'],
      'She is better now.',
      'Better не требует more.',
    ),
  ],
);
