import { wordUnit } from '../course-builder.js';

/** Учебная тема: family. Порядок курса задан в course-a1.ts. */
export const familyLesson = wordUnit(
  'family',
  'Семья и друзья',
  'A1',
  '👪',
  'Назови близких людей и расскажи о семье.',
  [
    ['mother', 'мама', 'My mother is kind.', 'Моя мама добрая.', ['mother', 'mum', 'mom']],
    ['father', 'папа', 'My father likes books.', 'Мой папа любит книги.', ['father', 'dad']],
    ['sister', 'сестра', 'My sister is five.', 'Моей сестре пять.'],
    ['brother', 'брат', 'My brother can swim.', 'Мой брат умеет плавать.'],
    ['friend', 'друг', 'This is my friend.', 'Это мой друг.'],
    ['cousin', 'двоюродный брат или сестра', 'My cousin lives nearby.', 'Мой двоюродный брат живёт рядом.'],
  ],
  ['В английском cousin не указывает пол сам по себе.'],
);
