import { wordUnit } from '../course-builder.js';

/** Учебная тема: hobbies. Порядок курса задан в course-a1.ts. */
export const hobbiesLesson = wordUnit(
  'hobbies',
  'Увлечения и свободное время',
  'A1',
  '⚽',
  'Расскажи, чем нравится заниматься.',
  [
    ['reading', 'чтение', 'Reading is my hobby.', 'Чтение — моё увлечение.'],
    ['swimming', 'плавание', 'I like swimming.', 'Я люблю плавать.'],
    ['drawing', 'рисование', 'She enjoys drawing.', 'Ей нравится рисовать.'],
    [
      'cycling',
      'езда на велосипеде',
      'We go cycling on Sundays.',
      'По воскресеньям мы катаемся на велосипедах.',
    ],
    ['music', 'музыка', 'I listen to music.', 'Я слушаю музыку.'],
    ['football', 'футбол', 'They play football.', 'Они играют в футбол.'],
  ],
  ['Play football, но listen to music: у разных занятий разные сочетания.'],
);
