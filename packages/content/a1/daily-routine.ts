import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: daily-routine. Порядок курса задан в a1.ts. */
export const dailyRoutineLesson = lesson(
  'daily-routine',
  'Лексика: повседневные дела',
  'A1',
  [
    'Learn phrases: wake up — просыпаться; get up — вставать; have breakfast — завтракать; go to work — идти на работу.',
    'Do homework — делать домашнее задание; go to bed — ложиться спать.',
  ],
  ['I get up at seven. — Я встаю в семь.', 'We have breakfast at home. — Мы завтракаем дома.'],
  ['Do homework, а не make homework.', 'Go to bed — без the, когда речь о том, чтобы лечь спать.'],
  [
    choice(
      '«Просыпаться» по-английски:',
      ['wake up', 'go to bed', 'have lunch'],
      'wake up',
      'Wake up — просыпаться.',
    ),
    gap('Впиши do или make: I ___ my homework after school.', 'do', 'Устойчивое сочетание: do homework.'),
    choice(
      '«Завтракать» по-английски:',
      ['do breakfast', 'have breakfast', 'make homework'],
      'have breakfast',
      'Have breakfast — завтракать; make breakfast — готовить завтрак.',
    ),
    gap('Впиши предлог: I go ___ work by bus.', 'to', 'Go to work — ехать / идти на работу.'),
    choice(
      'Выбери «ложиться спать».',
      ['go to the bed', 'go to bed', 'go in bed'],
      'go to bed',
      'Go to bed — ложиться спать.',
    ),
  ],
  'vocabulary',
);
