import { wordUnit } from '../course-builder.js';

/** Учебная тема: town. Порядок курса задан в course-a2.ts. */
export const townLesson = wordUnit(
  'town',
  'Город и общественные места',
  'A2',
  '🏙',
  'Пойми, куда идти в городе.',
  [
    ['library', 'библиотека', 'I borrow books from the library.', 'Я беру книги в библиотеке.'],
    ['station', 'станция', 'The train is at the station.', 'Поезд на станции.'],
    ['museum', 'музей', 'We visited a museum.', 'Мы посетили музей.'],
    ['bank', 'банк', 'The bank is next to the café.', 'Банк рядом с кафе.'],
    ['park', 'парк', 'We walk in the park.', 'Мы гуляем в парке.'],
    ['post office', 'почта', 'Where is the post office?', 'Где почта?'],
  ],
  ['Library — библиотека, не книжный магазин. Книжный магазин — bookshop.'],
);
