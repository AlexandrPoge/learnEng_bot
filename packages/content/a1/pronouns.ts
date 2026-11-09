import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: pronouns. Порядок курса задан в a1.ts. */
export const pronounsLesson = lesson(
  'pronouns',
  'Местоимения: I / me / my / mine',
  'A1',
  [
    'Подлежащее: I, you, he, she, it, we, they. Дополнение: me, you, him, her, it, us, them.',
    'Перед существительным: my, your, his, her, its, our, their.',
    'Без существительного: mine, yours, his, hers, ours, theirs.',
  ],
  ['She knows me. — Она меня знает.', 'This is my book. This book is mine. — Это моя книга.'],
  [
    'My book, но This book is mine: после mine существительное не ставим.',
    'Its = его/её (о предмете или животном); it’s = it is или it has.',
  ],
  [
    choice('Anna is my friend. ___ is kind.', ['He', 'She', 'Her'], 'She', 'Анна — подлежащее: she.'),
    gap('Впиши местоимение: I like Tom. I like ___.', 'him', 'После like нужен объект: him.'),
    choice('This is ___ bag. It belongs to me.', ['mine', 'my', 'me'], 'my', 'Перед bag используем my.'),
    gap(
      'Впиши местоимение: This pen belongs to me. It is ___.',
      'mine',
      'Без существительного используем mine.',
    ),
    choice(
      'The cat is eating ___ food.',
      ['its', 'it’s', 'it'],
      'its',
      'Its food — его еда. Апостроф не нужен.',
    ),
  ],
);
