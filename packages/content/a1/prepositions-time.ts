import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: prepositions-time. Порядок курса задан в a1.ts. */
export const prepositionsTimeLesson = lesson(
  'prepositions-time',
  'Предлоги времени: in / on / at',
  'A1',
  [
    'In — месяцы, годы, сезоны и части дня: in May, in 2026, in winter, in the morning.',
    'On — дни и даты: on Monday, on 5 May. At — время на часах: at 9 o’clock; at night.',
    'С next, last, this, every обычно без предлога: next Monday, every day.',
  ],
  ['I work at nine. — Я работаю в девять.', 'We meet on Friday. — Мы встречаемся в пятницу.'],
  ['At night, но in the morning.', 'On Monday morning, потому что назван конкретный день.'],
  [
    choice('We meet ___ Monday.', ['in', 'on', 'at'], 'on', 'Перед днём недели ставим on.'),
    gap('Впиши in / on / at: The lesson starts ___ 10:00.', 'at', 'Перед временем на часах — at.'),
    choice('My birthday is ___ June.', ['at', 'on', 'in'], 'in', 'Перед названием месяца — in.'),
    gap('Впиши in / on / at: I sleep ___ night.', 'at', 'Устойчивое сочетание: at night.'),
    choice(
      'Выбери правильную фразу.',
      ['on next Monday', 'next Monday', 'at next Monday'],
      'next Monday',
      'Перед next Monday предлог не нужен.',
    ),
  ],
);
