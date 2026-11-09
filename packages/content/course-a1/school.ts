import { wordUnit } from '../course-builder.js';

/** Учебная тема: school. Порядок курса задан в course-a1.ts. */
export const schoolLesson = wordUnit(
  'school',
  'Школа и учебные предметы',
  'A1',
  '🏫',
  'Попроси вещь на уроке и пойми инструкцию.',
  [
    ['pencil', 'карандаш', 'Can I borrow a pencil?', 'Можно одолжить карандаш?'],
    ['notebook', 'тетрадь', 'Write in your notebook.', 'Пиши в тетради.'],
    ['teacher', 'учитель', 'Our teacher is friendly.', 'Наш учитель дружелюбный.'],
    ['lesson', 'урок', 'The lesson starts at nine.', 'Урок начинается в девять.'],
    [
      'homework',
      'домашнее задание',
      'I do my homework after school.',
      'Я делаю домашнее задание после школы.',
    ],
    ['classroom', 'классная комната', 'We are in the classroom.', 'Мы в классе.'],
  ],
  ['Homework обычно неисчисляемое: some homework, не a homework.'],
);
