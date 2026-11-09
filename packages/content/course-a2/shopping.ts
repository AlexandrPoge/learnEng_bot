import { wordUnit } from '../course-builder.js';

/** Учебная тема: shopping. Порядок курса задан в course-a2.ts. */
export const shoppingLesson = wordUnit(
  'shopping',
  'Покупки и цены',
  'A2',
  '🛍',
  'Спроси цену, размер и способ оплаты.',
  [
    ['price', 'цена', 'What is the price?', 'Какова цена?'],
    ['size', 'размер', 'Do you have a smaller size?', 'У вас есть размер поменьше?'],
    ['receipt', 'чек', 'Can I have a receipt?', 'Можно чек?'],
    ['cash', 'наличные', 'Can I pay in cash?', 'Можно заплатить наличными?'],
    ['card', 'карта', 'Can I pay by card?', 'Можно заплатить картой?'],
    ['change', 'сдача', 'Here is your change.', 'Вот ваша сдача.'],
  ],
  ['How much is it? — сколько это стоит. Здесь much, а не many.'],
  'situations',
);
