import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: present-continuous. Порядок курса задан в a1.ts. */
export const presentContinuousLesson = lesson(
  'present-continuous',
  'Present Continuous',
  'A1',
  [
    'Для действия прямо сейчас: am / is / are + глагол с -ing.',
    'Отрицание: She is not reading. Вопрос: Is she reading?',
    'В этой теме тренируем действия в момент речи. Некоторые глаголы состояния, например know, обычно не используют в Continuous.',
  ],
  ['I am cooking now. — Я сейчас готовлю.', 'They are playing outside. — Они играют на улице.'],
  ['Не пропускай be: I am working, а не I working.', 'Make → making, run → running.'],
  [
    choice(
      'Look! She ___ a book.',
      ['reads', 'is reading', 'read'],
      'is reading',
      'Действие сейчас: is + reading.',
    ),
    gap('Впиши am / is / are: They ___ watching TV now.', 'are', 'С they используем are.'),
    choice(
      'Выбери вопрос о действии сейчас.',
      ['Are you working?', 'Do you working?', 'You are work?'],
      'Are you working?',
      'В вопросе are ставим перед you.',
    ),
    gap('Напиши -ing форму make: ___', 'making', 'Убираем немое e перед -ing.'),
    choice(
      'Выбери обычную форму: «Я знаю ответ».',
      ['I am knowing the answer.', 'I know the answer.', 'I knowing the answer.'],
      'I know the answer.',
      'Know в этом значении обычно не используют в Continuous.',
    ),
  ],
);
