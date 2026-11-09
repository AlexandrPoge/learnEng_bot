import { wordUnit } from '../course-builder.js';

/** Учебная тема: greetings. Порядок курса задан в course-a1.ts. */
export const greetingsLesson = wordUnit(
  'greetings',
  'Знакомство и вежливые фразы',
  'A1',
  '👋',
  'Поздоровайся, представься и поблагодари.',
  [
    ['hello', 'привет', 'Hello, Anna!', 'Привет, Анна!'],
    ['goodbye', 'до свидания', 'Goodbye, see you tomorrow!', 'До свидания, увидимся завтра!'],
    ['please', 'пожалуйста в просьбе', 'A pencil, please.', 'Карандаш, пожалуйста.'],
    ['thank you', 'спасибо', 'Thank you for your help.', 'Спасибо за помощь.', ['thank you', 'thanks']],
    ['sorry', 'извини', 'Sorry, I am late.', 'Извини, я опоздал.'],
    ['nice to meet you', 'приятно познакомиться', 'Nice to meet you, Ben.', 'Приятно познакомиться, Бен.'],
  ],
  ['Thank you — благодарность; you’re welcome — ответ на благодарность.'],
  'foundation',
);
