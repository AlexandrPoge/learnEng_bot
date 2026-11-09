import { wordUnit } from '../course-builder.js';

/** Учебная тема: clothes. Порядок курса задан в course-a1.ts. */
export const clothesLesson = wordUnit(
  'clothes',
  'Одежда',
  'A1',
  '👕',
  'Опиши одежду и её цвет.',
  [
    ['shirt', 'рубашка', 'His shirt is blue.', 'Его рубашка синяя.'],
    ['dress', 'платье', 'This dress is green.', 'Это платье зелёное.'],
    ['coat', 'пальто', 'Put on your coat.', 'Надень пальто.'],
    ['hat', 'шляпа', 'I like your hat.', 'Мне нравится твоя шляпа.'],
    ['shoes', 'туфли', 'My shoes are clean.', 'Мои туфли чистые.'],
    ['trousers', 'брюки', 'These trousers are new.', 'Эти брюки новые.'],
  ],
  ['Shoes и trousers требуют are, когда речь об этих формах множественного числа.'],
);
