import { wordUnit } from '../course-builder.js';

/** Учебная тема: colours. Порядок курса задан в course-a1.ts. */
export const coloursLesson = wordUnit(
  'colours',
  'Цвета и описание',
  'A1',
  '🎨',
  'Назови цвет и поставь его перед предметом.',
  [
    ['red', 'красный', 'This is a red ball.', 'Это красный мяч.'],
    ['blue', 'синий', 'The sky is blue.', 'Небо синее.'],
    ['green', 'зелёный', 'I have a green bag.', 'У меня зелёная сумка.'],
    ['yellow', 'жёлтый', 'The pencil is yellow.', 'Карандаш жёлтый.'],
    ['white', 'белый', 'My cat is white.', 'Моя кошка белая.'],
    ['black', 'чёрный', 'These shoes are black.', 'Эти туфли чёрные.'],
  ],
  ['Цвет перед существительным: a blue bag. После be: the bag is blue.'],
);
