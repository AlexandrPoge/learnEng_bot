import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: imperatives. Порядок курса задан в course-a1.ts. */
export const imperativesLesson = unit(
  'imperatives',
  'Просьбы и инструкции',
  'A1',
  '📣',
  'Попроси, дай инструкцию или предупреди.',
  'Open … · Please … · Don’t …',
  [
    'Инструкция начинается с начальной формы глагола: Open your book.',
    'Обычно you не требуется: адресат понятен.',
    'Отрицательная инструкция: Don’t + глагол.',
    'Please делает просьбу вежливее; интонация тоже важна.',
  ],
  [
    'Close the door, please. — Закрой дверь, пожалуйста.',
    'Listen carefully. — Слушай внимательно.',
    'Don’t run here. — Не бегай здесь.',
    'Please sit down. — Пожалуйста, садись.',
    'Turn left at the shop. — Поверни налево у магазина.',
    'Be careful. — Будь осторожен.',
  ],
  [
    '❌ Don’t runs → ✅ Don’t run.',
    'Don’t be late, а не Don’t late: для «быть» нужен be.',
    'Короткая инструкция может звучать резко без контекста; добавь please.',
  ],
  [
    gap('___ your book, please. (открой)', 'open', 'Инструкция начинается с open.'),
    choice(
      'Запрет бегать:',
      ['Don’t run.', 'Don’t runs.', 'Not running you.'],
      'Don’t run.',
      'Don’t + начальная форма.',
    ),
    gap('___ careful! (будь)', 'be', 'Be careful — будь осторожен.'),
    choice(
      'Как смягчить просьбу?',
      ['please', 'never', 'yesterday'],
      'please',
      'Please означает пожалуйста в просьбе.',
    ),
    gap('Don’t ___ late. (быть)', 'be', 'Don’t be late — не опаздывай.'),
  ],
);
