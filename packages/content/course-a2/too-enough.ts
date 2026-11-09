import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: too-enough. Порядок курса задан в course-a2.ts. */
export const tooEnoughLesson = unit(
  'too-enough',
  'Too / enough',
  'A2',
  '🌡',
  'Различай «слишком» и «достаточно».',
  'too hot · warm enough · enough water',
  [
    'Too + прилагательное: слишком, больше нужной меры.',
    'Прилагательное + enough: достаточно по качеству.',
    'Enough + существительное: достаточно вещей или количества.',
    'После конструкции можно объяснить цель: old enough to ride.',
  ],
  [
    'The soup is too hot. — Суп слишком горячий.',
    'This bag is big enough. — Эта сумка достаточно большая.',
    'We have enough chairs. — У нас достаточно стульев.',
    'I don’t have enough time. — У меня недостаточно времени.',
    'He is old enough to go. — Он достаточно взрослый, чтобы пойти.',
    'The music is too loud. — Музыка слишком громкая.',
  ],
  [
    '❌ enough big → ✅ big enough.',
    '❌ chairs enough → ✅ enough chairs.',
    'Too обычно содержит идею проблемы; very просто усиливает признак.',
  ],
  [
    gap('This tea is ___ hot to drink. (слишком)', 'too', 'Too = слишком.'),
    choice(
      'Выбери «достаточно большой».',
      ['big enough', 'enough big', 'too enough big'],
      'big enough',
      'Enough после прилагательного.',
    ),
    gap('We have ___ food. (достаточно)', 'enough', 'Enough перед существительным.'),
    choice(
      'Выбери правильную фразу.',
      ['enough books', 'books enough', 'too enough books'],
      'enough books',
      'Перед существительным — enough.',
    ),
    gap('She is old enough ___ travel. (to/for)', 'to', 'Далее инфинитив цели: to travel.'),
  ],
);
