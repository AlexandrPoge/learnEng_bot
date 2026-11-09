import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: for-since. Порядок курса задан в course-a2.ts. */
export const forSinceLesson = unit(
  'for-since',
  'For / since / ago',
  'A2',
  '⏱',
  'Различай длительность, начало и «назад».',
  'for two days · since Monday · two days ago',
  [
    'For + промежуток времени: for a week.',
    'Since + начальная точка: since Friday.',
    'Ago означает «назад» и обычно связано с завершённым прошлым.',
    'Если ситуация началась раньше и продолжается сейчас, часто нужен Present Perfect с for/since.',
  ],
  [
    'I have lived here for a year. — Я живу здесь год.',
    'She has known him since May. — Она знает его с мая.',
    'We met two days ago. — Мы встретились два дня назад.',
    'He has been here since noon. — Он здесь с полудня.',
    'They played for an hour yesterday. — Вчера они играли час. For возможно и с Past Simple.',
    'I have had this bag for months. — Эта сумка у меня уже несколько месяцев.',
  ],
  [
    'For не всегда требует Present Perfect: важен смысл всего предложения.',
    'Since Monday — с понедельника, не на протяжении понедельника.',
    'Ago стоит после промежутка: a week ago.',
  ],
  [
    gap('I have lived here ___ two years.', 'for', 'Two years — длительность.'),
    gap('I have known her ___ 2020.', 'since', '2020 — начальная точка.'),
    choice('Two days ___ = два дня назад.', ['ago', 'since', 'for'], 'ago', 'Ago стоит после промежутка.'),
    choice(
      'С законченной встречей «вчера»:',
      ['We met yesterday.', 'We have met yesterday.', 'We have meet yesterday.'],
      'We met yesterday.',
      'Yesterday — завершённое время.',
    ),
    gap('She has been here ___ Monday.', 'since', 'Monday — точка начала.'),
  ],
);
