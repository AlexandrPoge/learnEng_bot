import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: telling-time. Порядок курса задан в course-a1.ts. */
export const tellingTimeLesson = unit(
  'telling-time',
  'Который час?',
  'A1',
  '🕰',
  'Спроси время и пойми часы.',
  'past — минут после часа · to — минут до часа',
  [
    'Спросить время: What time is it? Ответ начинается с It’s.',
    'Можно назвать цифры: 6:20 — six twenty. O’clock используется для ровного часа.',
    'Half past seven — 7:30; a quarter past seven — 7:15; a quarter to eight — 7:45.',
    'A.m. — до полудня, p.m. — после полудня. 12 noon — полдень, midnight — полночь.',
  ],
  [
    'It’s three o’clock. — Сейчас ровно три.',
    'It’s half past four. — Половина пятого, 4:30.',
    'It’s a quarter past nine. — Четверть десятого, 9:15.',
    'It’s a quarter to six. — Без четверти шесть, 5:45.',
    'The lesson is at two. — Урок в два.',
    'It’s seven twenty. — Сейчас 7:20.',
  ],
  [
    'Half past four — 4:30, не 3:30: считаем минуты после четырёх.',
    'At нужен для времени события, а не после It’s: It’s five; at five.',
    'В английской записи дата и часы могут выглядеть иначе. Для встреч уточняй день и часовой пояс.',
  ],
  [
    choice('Half past two — это:', ['2:30', '1:30', '2:15'], '2:30', 'Half past — полчаса после двух.'),
    choice('A quarter to five — это:', ['4:45', '5:15', '5:45'], '4:45', 'До пяти осталось 15 минут.'),
    gap('Впиши слово: It’s six ___. (6:00)', 'o’clock', 'Ровный час: six o’clock.'),
    choice(
      'Как спросить время?',
      ['What time is it?', 'How many time?', 'What old is it?'],
      'What time is it?',
      'Это стандартный вопрос о времени.',
    ),
    gap('Впиши at / on / in: The train leaves ___ ten.', 'at', 'Перед временем события — at.'),
  ],
  'foundation',
);
