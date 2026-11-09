import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: plurals. Порядок курса задан в a1.ts. */
export const pluralsLesson = lesson(
  'plurals',
  'Множественное число существительных',
  'A1',
  [
    'Обычно добавляем -s: book → books. После -s, -sh, -ch, -x часто -es: box → boxes.',
    'Согласная + y: city → cities; гласная + y: boy → boys.',
    'Есть неправильные формы: child → children, person → people, man → men, foot → feet.',
  ],
  ['One bus → two buses.', 'One child → three children.'],
  [
    'Не childrens: children уже множественное число.',
    'Money не имеет обычной формы множественного числа в значении «деньги».',
  ],
  [
    gap('Напиши множественное число: book → ___', 'books', 'Обычно добавляем -s.'),
    choice(
      'One city → two ___.',
      ['citys', 'cities', 'cityes'],
      'cities',
      'После согласной y заменяем на -ies.',
    ),
    gap('Напиши множественное число: child → ___', 'children', 'Это неправильная форма: children.'),
    choice(
      'One boy → three ___.',
      ['boies', 'boys', 'boyes'],
      'boys',
      'Перед y стоит гласная, просто добавляем -s.',
    ),
    gap('Напиши множественное число: box → ___', 'boxes', 'После x добавляем -es.'),
  ],
);
