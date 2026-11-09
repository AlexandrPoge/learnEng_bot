import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: have-to. Порядок курса задан в school-junior.ts. */
export const haveToLesson = schoolUnit(
  'have-to',
  'Have to: нужно по обстоятельствам',
  'A2',
  [5, 6, 7],
  'verbs',
  '📋',
  'Расскажи об обязанностях сейчас и раньше.',
  'have to · has to · had to',
  [
    'Have to часто выражает необходимость по обстоятельствам или внешним правилам.',
    'С he/she/it в настоящем — has to.',
    'Вопросы и отрицания строятся с do/does: Does she have to ...?',
    'В прошлом — had to; в отрицании didn’t have to — необходимости не было.',
  ],
  [
    'I have to leave now. — Мне нужно уходить сейчас.',
    'She has to wear a uniform. — Она должна носить форму.',
    'Do you have to work today? — Тебе нужно работать сегодня?',
    'He doesn’t have to hurry. — Ему необязательно спешить.',
    'We had to walk home. — Нам пришлось идти домой пешком.',
    'They didn’t have to pay. — Им не пришлось платить.',
  ],
  [
    '❌ Does she has to? → ✅ Does she have to?',
    'Don’t have to — не запрет.',
    'После didn’t используй have, не had.',
  ],
  [
    gap('He ___ to get up early. (have/has)', 'has', 'He → has to.'),
    gap('Does she ___ to come?', 'have', 'После does — have.'),
    choice(
      'Прошлая необходимость:',
      ['We had to wait.', 'We have must waited.', 'We did had to wait.'],
      'We had to wait.',
      'В прошлом had to.',
    ),
    gap('We didn’t ___ to pay.', 'have', 'После didn’t — have.'),
    choice(
      'Doesn’t have to означает:',
      ['Необязательно', 'Запрещено', 'Всегда должен'],
      'Необязательно',
      'Необходимости нет.',
    ),
  ],
);
