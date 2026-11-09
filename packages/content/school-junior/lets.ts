import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: lets. Порядок курса задан в school-junior.ts. */
export const letsLesson = schoolUnit(
  'lets',
  'Let’s: предлагаем сделать вместе',
  'A1',
  [2, 3, 4],
  'verbs',
  '🤝',
  'Предложи другу совместное действие.',
  'Let’s + глагол · Let’s not + глагол',
  [
    'Let’s — предложение сделать что-то вместе: говорящий тоже участвует.',
    'После let’s нужна начальная форма глагола без to.',
    'Let’s not — предложение чего-то не делать.',
    'Ответить можно: Good idea! — Хорошая идея! Или предложить другой вариант.',
  ],
  [
    'Let’s draw a map. — Давай нарисуем карту.',
    'Let’s sit here. — Давайте сядем здесь.',
    'Let’s help Anna. — Давайте поможем Анне.',
    'Let’s not run. — Давай не будем бежать.',
    'Let’s play after lunch. — Давай поиграем после обеда.',
    'Good idea! — Хорошая идея! Так можно согласиться.',
  ],
  [
    '❌ Let’s to play → ✅ Let’s play.',
    '❌ Let’s plays → ✅ Let’s play.',
    'Let’s — давай / давайте; lets без апострофа — форма глагола let с he/she/it.',
  ],
  [
    choice(
      'Предложи вместе почитать.',
      ['Let’s read.', 'Let’s to read.', 'Let’s reads.'],
      'Let’s read.',
      'После let’s — read без to.',
    ),
    gap('Let’s ___ a game. (play)', 'play', 'Нужна начальная форма play.'),
    choice(
      'Предложи не шуметь.',
      ['Let’s not shout.', 'Let’s don’t shout.', 'Let’s no shout.'],
      'Let’s not shout.',
      'Отрицание — let’s not.',
    ),
    gap('Вставь not: Let’s ___ run.', 'not', 'Let’s not run — давай не будем бежать.'),
    choice(
      'Кто участвует в Let’s draw?',
      ['Мы вместе с говорящим', 'Только он', 'Никто'],
      'Мы вместе с говорящим',
      'Это совместное предложение.',
    ),
  ],
);
