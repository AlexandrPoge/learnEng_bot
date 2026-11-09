import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: adverb-position. Порядок курса задан в school-junior.ts. */
export const adverbPositionLesson = schoolUnit(
  'adverb-position',
  'Где поставить наречие?',
  'A2',
  [5, 6, 7],
  'modifiers',
  '📍',
  'Размести often, never и carefully в предложении.',
  'often plays · is often late · plays carefully',
  [
    'Наречие частоты обычно ставим перед смысловым глаголом: often reads.',
    'После be: is often busy.',
    'При вспомогательном глаголе частотность часто стоит после первого вспомогательного: has never seen.',
    'Наречие образа действия обычно не разрывает глагол и прямое дополнение: reads the letter carefully.',
  ],
  [
    'I often walk here. — Я часто здесь гуляю.',
    'She is always ready. — Она всегда готова.',
    'We have never met. — Мы никогда не встречались.',
    'He reads the instructions carefully. — Он внимательно читает инструкции.',
    'They usually eat at home. — Они обычно едят дома.',
    'She speaks clearly. — Она говорит ясно.',
  ],
  [
    '❌ She always is ready → ✅ She is always ready в нейтральном порядке.',
    '❌ reads carefully the letter → ✅ reads the letter carefully в обычном порядке.',
    'Never уже содержит отрицание: I never go, не I don’t never go.',
  ],
  [
    choice(
      'Выбери нейтральный порядок.',
      ['She is often late.', 'She often late is.', 'She often is lateness.'],
      'She is often late.',
      'Наречие после be.',
    ),
    gap('I ___ read before bed. (often)', 'often', 'Often перед смысловым read.'),
    choice(
      'Выбери фразу.',
      ['He opened the box carefully.', 'He opened carefully the box.', 'He carefully the box openedly.'],
      'He opened the box carefully.',
      'Carefully не разрывает opened и the box.',
    ),
    gap('I have ___ seen snow. (никогда; never)', 'never', 'Never после have.'),
    choice(
      'Правильное отрицание:',
      ['I never swim here.', 'I don’t never swim here.', 'I no never swim here.'],
      'I never swim here.',
      'Never уже отрицательное.',
    ),
  ],
);
