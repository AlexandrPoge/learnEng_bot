import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: zero-conditional. Порядок курса задан в course-a2.ts. */
export const zeroConditionalLesson = unit(
  'zero-conditional',
  'Если обычно: zero conditional',
  'A2',
  '🧊',
  'Расскажи об общем результате или привычке.',
  'if + Present Simple → Present Simple',
  [
    'Zero conditional описывает общий результат, правило или повторяющуюся связь.',
    'В обеих частях обычно Present Simple.',
    'If можно поставить в начале или середине.',
    'Если if-часть стоит первой, обычно нужна запятая между частями.',
  ],
  [
    'If I am tired, I go to bed early. — Если я устаю, ложусь рано.',
    'If it rains, the ground gets wet. — Если идёт дождь, земля намокает.',
    'I feel better if I sleep well. — Мне лучше, если я хорошо сплю.',
    'If you heat ice, it melts. — Если нагреть лёд, он тает.',
    'If she has time, she reads. — Если у неё есть время, она читает.',
    'When it is cold, we wear coats. — Когда холодно, мы носим пальто.',
  ],
  [
    'Не выбирай will автоматически после каждого if.',
    'Zero — про общую связь; first — про реальную будущую возможность.',
    'В третьем лице остаётся -s: if she reads.',
  ],
  [
    choice(
      'Общее правило: If you heat ice, it ___.',
      ['melts', 'will melted', 'melted'],
      'melts',
      'Для общего результата — Present Simple.',
    ),
    gap('If she ___ tired, she rests. (be)', 'is', 'She is в Present Simple.'),
    choice(
      'Обе части zero conditional обычно:',
      ['Present Simple', 'Past Simple', 'Present Perfect'],
      'Present Simple',
      'Это базовая схема общего результата.',
    ),
    gap('If he has time, he ___. (read)', 'reads', 'He → reads.'),
    choice(
      'Выбери общую привычку.',
      ['If I am tired, I go to bed.', 'If I was tired, I will went.', 'If I tired, go I bed.'],
      'If I am tired, I go to bed.',
      'Обе части в Present Simple.',
    ),
  ],
);
