import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: possessive-s. Порядок курса задан в course-a1.ts. */
export const possessiveSLesson = unit(
  'possessive-s',
  'Чья вещь? Притяжательное ’s',
  'A1',
  '🔑',
  'Скажи, кому принадлежит предмет.',
  'Anna’s bag — сумка Анны',
  [
    'К имени владельца обычно добавляем ’s, потом называем вещь.',
    'Если владельцев несколько и слово уже заканчивается на -s, апостроф ставится после s: the girls’ room.',
    'Для неправильного множественного числа: children’s toys.',
    'Whose? означает «чей?». Who’s означает who is или who has в соответствующем контексте.',
  ],
  [
    'Ben’s bike is blue. — Велосипед Бена синий.',
    'My mum’s phone is here. — Телефон мамы здесь.',
    'The children’s books are new. — Книги детей новые.',
    'The teachers’ room is upstairs. — Учительская наверху.',
    'Whose pencil is this? — Чей это карандаш?',
    'It is Kate’s. — Он принадлежит Кейт.',
  ],
  [
    'Не путай ’s владельца и ’s = is: Anna’s bag; Anna’s happy.',
    'Апостроф нужен: Ben’s bag, не Bens bag.',
    'Для вещей часто подходит of: the end of the story. Не все сочетания строятся одинаково.',
  ],
  [
    choice(
      'Сумка Анны:',
      ['Anna’s bag', 'Anna bag', 'Bag Anna'],
      'Anna’s bag',
      'Добавляем ’s к имени владельца.',
    ),
    gap('Чей по-английски: ___', 'whose', 'Whose задаёт вопрос о владельце.'),
    choice(
      'Игрушки детей:',
      ['children’s toys', 'childrens toys', 'children toys'],
      'children’s toys',
      'Children — неправильное множественное; добавляем ’s.',
    ),
    choice(
      'Комната нескольких учителей:',
      ['the teachers’ room', 'the teacher room', 'the teachers room'],
      'the teachers’ room',
      'Teachers заканчивается на -s: апостроф после s.',
    ),
    gap(
      'Впиши имя с притяжательным окончанием: ___ bike. (Tom)',
      ['Tom’s', "Tom's"],
      'Один владелец: Tom’s.',
    ),
  ],
);
