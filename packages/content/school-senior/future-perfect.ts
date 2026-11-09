import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: future-perfect. Порядок курса задан в school-senior.ts. */
export const futurePerfectLesson = schoolUnit(
  'future-perfect',
  'Future Perfect: закончим к определённому моменту',
  'B2',
  [9, 10, 11],
  'tenses',
  '🏁',
  'Назови результат, который будет готов к сроку.',
  'will have + третья форма · by Friday',
  [
    'Future Perfect смотрит назад из будущей точки: к этому моменту действие завершится.',
    'Для всех лиц — will have + третья форма.',
    'By обозначает «к определённому сроку»; until обычно значит продолжение до момента.',
    'После by the time во временной части обычно настоящее, не will.',
  ],
  [
    'By Friday, I will have finished. — К пятнице я закончу.',
    'She will have arrived by noon. — К полудню она уже приедет.',
    'We will have built the model by Monday. — К понедельнику мы соберём модель.',
    'They won’t have left by then. — К тому моменту они ещё не уйдут.',
    'Will you have read it by tomorrow? — Ты прочитаешь это к завтра?',
    'By the time you arrive, I will have cooked dinner. — К твоему приходу я уже приготовлю ужин.',
  ],
  [
    '❌ will have went → ✅ will have gone.',
    'Не путай процесс will be doing и результат will have done.',
    'By Friday — к пятнице; until Friday — до пятницы по длительности.',
  ],
  [
    gap('By noon, she will ___ arrived.', 'have', 'Will have + V3.'),
    gap('They will have ___ the house. (build)', 'built', 'Build–built–built.'),
    choice(
      'К пятнице:',
      ['by Friday', 'until Friday всегда о готовом результате', 'since Friday о будущем результате'],
      'by Friday',
      'By — к сроку.',
    ),
    gap(
      'By the time he ___, we will have finished. (arrive)',
      'arrives',
      'Present Simple после by the time.',
    ),
    choice(
      'Результат к сроку:',
      ['I will have written it by six.', 'I will be write it by six.', 'I will have wrote it by six.'],
      'I will have written it by six.',
      'Will have + третья форма written.',
    ),
  ],
);
