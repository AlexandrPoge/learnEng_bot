import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: this-that. Порядок курса задан в course-a1.ts. */
export const thisThatLesson = unit(
  'this-that',
  'This / that / these / those',
  'A1',
  '👉',
  'Покажи на близкий или далёкий предмет.',
  'рядом: this / these · далеко: that / those',
  [
    'Один предмет рядом: this. Один предмет далеко: that.',
    'Несколько рядом: these. Несколько далеко: those.',
    'С this/that нужен is; с these/those — are.',
    'В вопросе меняется порядок be: Is this your bag? Are those your shoes?',
  ],
  [
    'This is my cup. — Это моя чашка рядом со мной.',
    'That is our school over there. — Вон там наша школа.',
    'These are my shoes here. — Вот мои ботинки рядом.',
    'Those are birds in the sky. — Вон там птицы в небе.',
    'Is this your pen? — Это твоя ручка?',
    'Are these your books? — Это твои книги рядом?',
  ],
  [
    '❌ These is → ✅ These are.',
    'These и this различаются не только написанием: они указывают разное количество.',
    'Далеко/близко зависит от ситуации и точки зрения говорящего.',
  ],
  [
    choice('Один предмет рядом: ___', ['this', 'these', 'those'], 'this', 'This = один рядом.'),
    choice(
      'Несколько предметов далеко: ___',
      ['those', 'that', 'this'],
      'those',
      'Those = несколько далеко.',
    ),
    gap('These ___ my socks.', 'are', 'These требует are.'),
    gap('That ___ my house.', 'is', 'That требует is.'),
    choice(
      'Выбери вопрос про одну сумку рядом.',
      ['Is this your bag?', 'Are these your bag?', 'Is those your bag?'],
      'Is this your bag?',
      'Одна рядом — this; вопрос с is.',
    ),
  ],
);
