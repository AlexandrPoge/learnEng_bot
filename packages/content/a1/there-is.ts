import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: there-is. Порядок курса задан в a1.ts. */
export const thereIsLesson = lesson(
  'there-is',
  'There is / there are',
  'A1',
  [
    'Чтобы сказать, что где-то что-то есть: there is + единственное число или неисчисляемое; there are + множественное.',
    'Вопросы: Is there ...? Are there ...? Отрицания: There isn’t ... / There aren’t ...',
  ],
  [
    'There is a cat on the chair. — На стуле кошка.',
    'There are two books on the desk. — На столе две книги.',
  ],
  [
    'There is water, а не There are water.',
    'There описывает наличие, а it может указывать на уже известный предмет.',
  ],
  [
    choice('There ___ a shop near my house.', ['is', 'are', 'am'], 'is', 'A shop — единственное число.'),
    gap('Впиши is или are: There ___ three chairs.', 'are', 'Three chairs — множественное число.'),
    choice('___ there any milk in the fridge?', ['Are', 'Is', 'Do'], 'Is', 'Milk — неисчисляемое: Is there.'),
    gap('Впиши is или are: There ___ not any buses today.', 'are', 'Buses — множественное число.'),
    choice(
      'Выбери вопрос про два окна.',
      ['Is there two windows?', 'Are there two windows?', 'Do there two windows?'],
      'Are there two windows?',
      'Для множественного числа: Are there ...?',
    ),
  ],
);
