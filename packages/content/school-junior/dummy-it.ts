import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: dummy-it. Порядок курса задан в school-junior.ts. */
export const dummyItLesson = schoolUnit(
  'dummy-it',
  'It: погода, время и расстояние',
  'A1',
  [2, 3, 4],
  'sentences',
  '🌦',
  'Построй предложение о погоде и времени.',
  'It is cold · It is six · It is far',
  [
    'В английском предложению обычно нужно подлежащее, даже если по-русски его нет.',
    'Для погоды удобно it: It is windy.',
    'Для времени тоже it: It is half past five.',
    'It может вводить оценку расстояния: It is far from here. Это не указание на вещь.',
  ],
  [
    'It is sunny. — Солнечно.',
    'It is cold today. — Сегодня холодно.',
    'It is seven o’clock. — Сейчас семь часов.',
    'It is getting dark. — Темнеет.',
    'It is far from here. — Отсюда далеко.',
    'Is it warm outside? — На улице тепло?',
  ],
  [
    '❌ Is cold → ✅ It is cold.',
    'Не используй he для погоды.',
    'В вопросе is выходит перед it: Is it late?',
  ],
  [
    gap('___ is raining.', 'it', 'Для погоды используется it.'),
    choice(
      'Скажи «сейчас поздно».',
      ['It is late.', 'Is late.', 'He is late weather.'],
      'It is late.',
      'Нужно подлежащее it.',
    ),
    gap('It ___ sunny. (be)', 'is', 'It требует is.'),
    choice(
      'Выбери вопрос.',
      ['Is it cold?', 'It cold is?', 'Does it is cold?'],
      'Is it cold?',
      'Is перед it.',
    ),
    gap('___ is ten o’clock.', 'it', 'It используется, когда называем время.'),
  ],
);
