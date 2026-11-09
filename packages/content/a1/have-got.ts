import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: have-got. Порядок курса задан в a1.ts. */
export const haveGotLesson = lesson(
  'have-got',
  'Have got / has got',
  'A1',
  [
    'Для обладания: I / you / we / they have got; he / she / it has got.',
    'Вопрос: Have you got ...? Has she got ...? Отрицание: haven’t got / hasn’t got.',
    'Также можно: Do you have a bike? У этой конструкции своя форма вопроса.',
  ],
  ['She has got a bike. — У неё есть велосипед.', 'Have you got a pen? — У тебя есть ручка?'],
  [
    'Не Does she has got? Выбери Has she got? или Does she have?',
    'Has got — не форма для описания привычных действий вроде have breakfast.',
  ],
  [
    choice('He ___ got a dog.', ['have', 'has', 'is'], 'has', 'С he используем has got.'),
    gap('Впиши have или has: We ___ got a garden.', 'have', 'С we используем have got.'),
    choice('___ she got a brother?', ['Does', 'Have', 'Has'], 'Has', 'Вопрос: Has she got ...?'),
    gap('Впиши have или has: I ___ not got a car.', 'have', 'I have not got = I haven’t got.'),
    choice(
      'Выбери правильный вопрос.',
      ['Does he have a bike?', 'Does he has a bike?', 'Do he has got a bike?'],
      'Does he have a bike?',
      'После does — начальная форма have.',
    ),
  ],
);
