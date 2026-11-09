import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: articles. Порядок курса задан в a1.ts. */
export const articlesLesson = lesson(
  'articles',
  'Артикли: a / an / the',
  'A1',
  [
    'A / an: один из многих, впервые упоминаемый исчисляемый предмет в единственном числе.',
    'A перед согласным звуком; an перед гласным звуком. The — когда ясно, какой именно предмет.',
    'Общие понятия во множественном числе или с неисчисляемым существительным часто без артикля: Cats sleep. Water is important.',
  ],
  ['I see a dog. The dog is black. — Вижу собаку. Эта собака чёрная.', 'An apple, an hour, a university.'],
  [
    'Важен звук: an hour (h не произносится), a university (начинается с /j/).',
    'Нельзя a water в значении воды вообще.',
  ],
  [
    choice('I have ___ apple.', ['a', 'an', 'the'], 'an', 'Apple начинается с гласного звука.'),
    gap('Впиши a или an: It takes ___ hour.', 'an', 'Hour начинается с гласного звука.'),
    choice(
      'I bought a book. ___ book is interesting.',
      ['A', 'An', 'The'],
      'The',
      'Речь об уже упомянутой книге.',
    ),
    gap('Впиши a или an: She studies at ___ university.', 'a', 'University начинается со звука /j/.'),
    choice(
      'Выбери фразу: «Вода важна» (вода вообще).',
      ['A water is important.', 'Water is important.', 'An water is important.'],
      'Water is important.',
      'Water — неисчисляемое существительное; здесь артикль не нужен.',
    ),
  ],
);
