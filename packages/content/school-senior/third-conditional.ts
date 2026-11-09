import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: third-conditional. Порядок курса задан в school-senior.ts. */
export const thirdConditionalLesson = schoolUnit(
  'third-conditional',
  'Third Conditional: если бы в прошлом',
  'B2',
  [9, 10, 11],
  'sentences',
  '🔙',
  'Представь другой результат уже завершённой ситуации.',
  'if + had + V3 → would have + V3',
  [
    'Third conditional описывает нереальное изменение прошлого.',
    'В if-части — Past Perfect.',
    'Результат строится с would have + третья форма.',
    'Ситуация уже завершилась; предложение выражает предположение или сожаление, а не возможность изменить прошлое.',
  ],
  [
    'If I had left earlier, I would have caught the bus. — Если бы я вышел раньше, я бы успел на автобус.',
    'She would have helped if she had known. — Она бы помогла, если бы знала тогда.',
    'If we had checked, we wouldn’t have got lost. — Если бы мы проверили, мы бы не заблудились.',
    'If it hadn’t rained, we would have played. — Если бы не дождь, мы бы поиграли.',
    'Would you have come if I had invited you? — Ты бы пришёл, если бы я пригласил?',
    'If he had studied, he might have passed. — Если бы он готовился, он, возможно, сдал бы; might выражает менее уверенный результат.',
  ],
  [
    '❌ if I would have left → ✅ if I had left в базовой схеме.',
    '❌ would have went → ✅ would have gone.',
    'Second — воображаемое настоящее/будущее; third — альтернативное прошлое.',
  ],
  [
    gap('If I had ___, I would have passed. (study)', 'studied', 'Had + третья форма.'),
    gap('We would ___ caught the bus.', 'have', 'Would have + V3.'),
    choice(
      'Про нереальное прошлое:',
      ['If I had known, I would have called.', 'If I know, I call.', 'If I will know, I called.'],
      'If I had known, I would have called.',
      'Past Perfect и would have.',
    ),
    gap('She would have ___. (go)', 'gone', 'Третья форма gone.'),
    choice(
      'Можно ли этим предложением изменить прошлое?',
      ['Нет, это воображаемый вариант', 'Да, событие обязательно повторится', 'Да, это приказ'],
      'Нет, это воображаемый вариант',
      'Речь об уже завершённой ситуации.',
    ),
  ],
);
