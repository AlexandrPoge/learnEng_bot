import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: purpose-infinitive. Порядок курса задан в school-junior.ts. */
export const purposeInfinitiveLesson = schoolUnit(
  'purpose-infinitive',
  'To + глагол: зачем мы это делаем',
  'A1',
  [3, 4, 5],
  'verbs',
  '🎯',
  'Объясни цель действия.',
  'действие + to + цель',
  [
    'Инфинитив с to может отвечать на вопрос «зачем?».',
    'Сначала назови действие, затем цель: I went out to play.',
    'После to нужна начальная форма: to buy, to learn.',
    'Не каждое to означает цель: to school — направление, а не действие.',
  ],
  [
    'I use a pen to write. — Я использую ручку, чтобы писать.',
    'She went out to play. — Она вышла поиграть.',
    'We stopped to rest. — Мы остановились, чтобы отдохнуть.',
    'He called to say hello. — Он позвонил, чтобы поздороваться.',
    'I study to learn new things. — Я учусь, чтобы узнавать новое.',
    'They went to the shop to buy bread. — Они пошли в магазин купить хлеб.',
  ],
  [
    '❌ to learning → ✅ to learn, когда объясняем цель.',
    '❌ for buy bread → ✅ to buy bread.',
    'Различай направление to the park и цель to play.',
  ],
  [
    gap('I came here ___ help. (to/for)', 'to', 'Цель — to help.'),
    choice(
      'Зачем: «чтобы читать».',
      ['to read', 'for read', 'to reading'],
      'to read',
      'Инфинитив цели: to + read.',
    ),
    gap('She went out to ___. (play)', 'play', 'После to — начальная форма.'),
    choice(
      'Где названа цель?',
      ['I called to ask a question.', 'I went to school.', 'I listened to music.'],
      'I called to ask a question.',
      'To ask отвечает на «зачем позвонил?».',
    ),
    gap('We use a key ___ open the door.', 'to', 'Цель использования ключа — открыть дверь.'),
  ],
);
