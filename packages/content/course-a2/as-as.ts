import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: as-as. Порядок курса задан в course-a2.ts. */
export const asAsLesson = unit(
  'as-as',
  'Такой же: as … as',
  'A2',
  '🟰',
  'Скажи, что два предмета похожи по признаку.',
  'as + обычное прилагательное + as',
  [
    'As tall as — такой же высокий, как.',
    'Между as ставим обычную форму, не сравнительную.',
    'Not as ... as — не такой ..., как.',
    'Для количества: as many + исчисляемые; as much + неисчисляемые.',
  ],
  [
    'My bag is as heavy as yours. — Моя сумка такая же тяжёлая, как твоя.',
    'This book is as interesting as that one. — Эта книга такая же интересная, как та.',
    'I am not as tall as my brother. — Я не такой высокий, как брат.',
    'She runs as fast as Ben. — Она бегает так же быстро, как Бен.',
    'We have as many books as you. — У нас столько же книг, сколько у вас.',
    'I don’t have as much time as you. — У меня не столько времени, сколько у тебя.',
  ],
  [
    '❌ as taller as → ✅ as tall as.',
    'Не заменяй второе as словом than в этой конструкции.',
    'Отрицание not as ... as показывает разницу, а не равенство.',
  ],
  [
    gap('As ___ as: tall или taller?', 'tall', 'Нужна обычная форма tall.'),
    choice(
      'Выбери равенство.',
      ['as big as', 'as bigger than', 'as biggest as'],
      'as big as',
      'As + обычная форма + as.',
    ),
    gap('My bag is as heavy ___ yours.', 'as', 'Две части as ... as.'),
    choice(
      'As ___ books as you.',
      ['many', 'much', 'little'],
      'many',
      'Books исчисляемое во множественном числе.',
    ),
    gap('As ___ water as you. (much/many)', 'much', 'Water неисчисляемое.'),
  ],
);
