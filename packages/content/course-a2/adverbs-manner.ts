import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: adverbs-manner. Порядок курса задан в course-a2.ts. */
export const adverbsMannerLesson = unit(
  'adverbs-manner',
  'Как происходит действие?',
  'A2',
  '🐢',
  'Различай прилагательные и наречия.',
  'a slow car · drive slowly',
  [
    'Прилагательное описывает предмет: a quiet room.',
    'Наречие может описывать действие: speak quietly.',
    'Многие наречия образуются с -ly: careful → carefully. Happy → happily.',
    'Good → well. Fast и hard могут быть наречиями без -ly.',
  ],
  [
    'She speaks quietly. — Она говорит тихо.',
    'He is a careful driver. — Он осторожный водитель.',
    'He drives carefully. — Он водит осторожно.',
    'She sings well. — Она хорошо поёт.',
    'They run fast. — Они быстро бегают.',
    'The children smiled happily. — Дети радостно улыбнулись.',
  ],
  [
    '❌ He sings good → ✅ He sings well.',
    'Hard — усердно/тяжело; hardly — почти не. Это разные значения.',
    'После be для описания человека обычно прилагательное: She is happy.',
  ],
  [
    gap('Форма quiet для действия: speak ___.', 'quietly', 'Quiet → quietly.'),
    choice('She plays the piano ___.', ['well', 'good', 'goodly'], 'well', 'Для действия — well.'),
    gap('Форма happy для действия: smile ___.', 'happily', 'Happy → happily.'),
    choice(
      'Выбери описание человека.',
      ['She is careful.', 'She is carefully.', 'She careful isly.'],
      'She is careful.',
      'После be прилагательное careful.',
    ),
    gap('He runs ___. (быстро; слово fast)', 'fast', 'Fast не требует -ly.'),
  ],
);
