import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: prepositions-place. Порядок курса задан в a1.ts. */
export const prepositionsPlaceLesson = lesson(
  'prepositions-place',
  'Предлоги места',
  'A1',
  [
    'In — внутри; on — на поверхности; under — под; next to — рядом с; between — между.',
    'At часто обозначает точку или место деятельности: at the bus stop, at school.',
  ],
  [
    'The book is on the desk. — Книга на столе.',
    'The cat is under the table. — Кошка под столом.',
    'The keys are in the bag. — Ключи внутри сумки.',
  ],
  [
    'On the wall — на стене, in the room — в комнате.',
    'Для положения между двумя объектами используем between.',
  ],
  [
    choice(
      'The keys are inside the bag. They are ___ the bag.',
      ['on', 'in', 'under'],
      'in',
      'Внутри сумки — in.',
    ),
    gap('Переведи только предлог: под столом → ___ the table.', 'under', 'Под — under.'),
    choice('The picture hangs ___ the wall.', ['in', 'under', 'on'], 'on', 'На поверхности стены — on.'),
    gap('Впиши предлог: B is ___ A and C.', 'between', 'Между двумя объектами — between.'),
    choice(
      'The bus will stop here. Wait ___ the bus stop.',
      ['at', 'under', 'between'],
      'at',
      'Остановка как точка ожидания — at the bus stop.',
    ),
  ],
);
