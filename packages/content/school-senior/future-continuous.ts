import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: future-continuous. Порядок курса задан в school-senior.ts. */
export const futureContinuousLesson = schoolUnit(
  'future-continuous',
  'Future Continuous: процесс в будущем',
  'B2',
  [9, 10, 11],
  'tenses',
  '🛫',
  'Расскажи, что будет происходить в момент будущего.',
  'will be + глагол-ing',
  [
    'Future Continuous показывает процесс в определённый момент будущего.',
    'Для всех лиц форма will be + -ing.',
    'Вопрос: Will you be working? Отрицание: won’t be working.',
    'Во временном придаточном после when обычно Present Simple, даже если речь о будущем.',
  ],
  [
    'At eight tomorrow, I will be travelling. — Завтра в восемь я буду в пути.',
    'She will be studying when you arrive. — Она будет заниматься, когда ты придёшь.',
    'We won’t be sleeping at six. — В шесть мы не будем спать.',
    'Will you be using the car tonight? — Ты будешь пользоваться машиной вечером?',
    'They will be waiting outside. — Они будут ждать снаружи.',
    'This time next week, I’ll be relaxing. — В это время на следующей неделе я буду отдыхать.',
  ],
  [
    '❌ will be work → ✅ will be working.',
    'Не теряй be.',
    '❌ when you will arrive в обычном временном придаточном → ✅ when you arrive.',
  ],
  [
    gap('I will ___ working.', 'be', 'Will be + -ing.'),
    gap('She will be ___. (read)', 'reading', 'Процесс — reading.'),
    choice(
      'Выбери процесс завтра в восемь.',
      ['I will be travelling at eight.', 'I will be travel at eight.', 'I will travelling at eight.'],
      'I will be travelling at eight.',
      'Will be travelling.',
    ),
    gap('I’ll be waiting when you ___. (arrive)', 'arrive', 'Во временном when — Present Simple.'),
    choice(
      'Отрицание:',
      ['won’t be sleeping', 'won’t sleeping be not', 'don’t will sleep'],
      'won’t be sleeping',
      'Won’t be + -ing.',
    ),
  ],
);
