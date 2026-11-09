import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: modal-deductions. Порядок курса задан в school-senior.ts. */
export const modalDeductionsLesson = schoolUnit(
  'modal-deductions',
  'Must / might / can’t: делаем вывод',
  'B2',
  [9, 10, 11],
  'verbs',
  '🔍',
  'Различай уверенный вывод и предположение.',
  'must be — наверняка · might be — возможно · can’t be — не может быть',
  [
    'Must может означать уверенный вывод по признакам, а не обязанность.',
    'Might / may / could выражают возможность без уверенности.',
    'Can’t выражает уверенный отрицательный вывод.',
    'О прошлом: модальный глагол + have + третья форма. Отличай вывод от установленного факта.',
  ],
  [
    'She has run ten kilometres. She must be tired. — Она пробежала десять километров; должно быть, устала.',
    'He might be at home. — Возможно, он дома.',
    'It can’t be Anna: she is abroad. — Это не может быть Анна: она за границей.',
    'They may have missed the bus. — Возможно, они пропустили автобус.',
    'He must have forgotten. — Должно быть, он забыл.',
    'She can’t have seen me: I was hidden. — Она не могла меня увидеть: я был спрятан.',
  ],
  [
    'Вывод must не равен стопроцентно проверенному факту.',
    '❌ must have saw → ✅ must have seen.',
    'Для отрицательного вывода обычно can’t, а не mustn’t, которое часто выражает запрет.',
  ],
  [
    choice(
      'Возможно, он дома:',
      ['He might be at home.', 'He mustn’t home.', 'He might to be at home.'],
      'He might be at home.',
      'Might be — возможность.',
    ),
    gap('She must have ___ it. (see)', 'seen', 'После have — третья форма.'),
    choice(
      'Уверенный отрицательный вывод:',
      ['It can’t be true.', 'It mustn’t be true как запрет.', 'It may be true.'],
      'It can’t be true.',
      'Can’t be — это не может быть правдой.',
    ),
    gap('He ___ have forgotten. (must; уверенный вывод)', 'must', 'Must have + V3.'),
    choice(
      'Might означает:',
      ['Возможность без уверенности', 'Доказанный факт всегда', 'Всегда запрет'],
      'Возможность без уверенности',
      'Это степень уверенности говорящего.',
    ),
  ],
);
