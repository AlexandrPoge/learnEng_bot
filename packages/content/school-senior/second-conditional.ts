import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: second-conditional. Порядок курса задан в school-senior.ts. */
export const secondConditionalLesson = schoolUnit(
  'second-conditional',
  'Second Conditional: представляем другую ситуацию',
  'B1',
  [8, 9, 10, 11],
  'sentences',
  '💭',
  'Расскажи о воображаемом настоящем или будущем.',
  'if + Past Simple → would + глагол',
  [
    'Second conditional описывает воображаемую или маловероятную ситуацию сейчас или в будущем.',
    'В if-части — Past Simple, хотя смысл может относиться к настоящему.',
    'В результате — would + начальная форма.',
    'В формальном воображаемом условии с be можно использовать were для всех лиц: If I were you.',
  ],
  [
    'If I had wings, I would fly. — Если бы у меня были крылья, я бы летал.',
    'If she knew, she would tell us. — Если бы она знала, она бы сказала.',
    'I would help if I had time. — Я бы помог, если бы было время.',
    'If I were you, I would ask. — На твоём месте я бы спросил.',
    'What would you do if you won? — Что бы ты сделал, если бы выиграл?',
    'If we lived closer, we would meet more often. — Если бы мы жили ближе, мы встречались бы чаще.',
  ],
  [
    '❌ If I would have → ✅ If I had в базовой схеме.',
    'Past Simple в условии не обязательно означает прошлое.',
    'Не путай реальную будущую возможность first с воображаемой second.',
  ],
  [
    gap('If I ___ more time, I would read. (have)', 'had', 'В if-части Past Simple.'),
    gap('She would ___ us. (help)', 'help', 'Would + начальная форма.'),
    choice(
      'Совет:',
      ['If I were you, I would call.', 'If I would be you, I call.', 'If I am you, I called.'],
      'If I were you, I would call.',
      'Стандартная формула совета.',
    ),
    choice(
      'If I had wings относится к:',
      ['Воображаемой ситуации', 'Обязательному факту вчера', 'Приказу'],
      'Воображаемой ситуации',
      'Речь об альтернативной реальности.',
    ),
    gap('If he knew, he ___ tell us. (would/will)', 'would', 'В базовой second conditional — would.'),
  ],
);
