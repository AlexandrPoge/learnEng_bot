import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: frequency. Порядок курса задан в course-a1.ts. */
export const frequencyLesson = unit(
  'frequency',
  'Как часто? Always / usually / never',
  'A1',
  '🔄',
  'Расскажи о частоте привычки.',
  'always → usually → often → sometimes → never',
  [
    'Always — всегда; usually — обычно; often — часто; sometimes — иногда; never — никогда.',
    'Чаще ставим наречие перед обычным глаголом: I often read.',
    'После be: She is always kind.',
    'Never уже содержит отрицание: I never swim, без don’t.',
  ],
  [
    'I always brush my teeth. — Я всегда чищу зубы.',
    'We usually walk to school. — Мы обычно ходим в школу пешком.',
    'He often visits his gran. — Он часто навещает бабушку.',
    'I sometimes draw before bed. — Иногда я рисую перед сном.',
    'She is never late. — Она никогда не опаздывает.',
    'We play tennis twice a week. — Мы играем два раза в неделю.',
  ],
  [
    '❌ I don’t never read → ✅ I never read.',
    'Сравни: I always play; I am always ready. Место зависит от глагола.',
    'How often? — как часто, не как долго.',
  ],
  [
    choice('Never означает:', ['никогда', 'всегда', 'часто'], 'никогда', 'Never — никогда.'),
    choice(
      'Выбери порядок.',
      ['She often reads.', 'She reads often books.', 'Often reads she.'],
      'She often reads.',
      'Наречие обычно перед обычным глаголом.',
    ),
    gap('She is ___ late. (никогда)', 'never', 'После be можно поставить never.'),
    choice(
      '«Как часто?»',
      ['How often?', 'How old?', 'How much?'],
      'How often?',
      'How often задаёт вопрос о частоте.',
    ),
    gap('I ___ play football on Sundays. (обычно)', 'usually', 'Usually — обычно.'),
  ],
);
