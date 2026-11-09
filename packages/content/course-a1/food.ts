import { wordUnit } from '../course-builder.js';

/** Учебная тема: food. Порядок курса задан в course-a1.ts. */
export const foodLesson = wordUnit(
  'food',
  'Еда и напитки',
  'A1',
  '🥗',
  'Назови еду и попроси напиток.',
  [
    ['bread', 'хлеб', 'I eat bread for breakfast.', 'Я ем хлеб на завтрак.'],
    ['cheese', 'сыр', 'This cheese is tasty.', 'Этот сыр вкусный.'],
    ['juice', 'сок', 'Can I have some juice?', 'Можно мне немного сока?'],
    ['water', 'вода', 'I drink water.', 'Я пью воду.'],
    ['apple', 'яблоко', 'I have an apple.', 'У меня есть яблоко.'],
    ['rice', 'рис', 'We have rice for lunch.', 'У нас рис на обед.'],
  ],
  ['Bread и rice в этих значениях неисчисляемые.'],
);
