import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: gerund-infinitive. Порядок курса задан в a2.ts. */
export const gerundInfinitiveLesson = lesson(
  'gerund-infinitive',
  'Герундий и инфинитив: базовые сочетания',
  'A2',
  [
    'После enjoy и finish используем -ing: enjoy reading, finish working.',
    'После want, decide, hope используем to + глагол: want to learn.',
    'После предлога обычно -ing: good at swimming. Like / love допускают обе формы во многих контекстах.',
  ],
  [
    'I enjoy reading. — Мне нравится читать.',
    'She decided to study. — Она решила учиться.',
    'He is good at cooking. — Он хорошо готовит.',
  ],
  [
    'Не enjoy to read: enjoy reading.',
    'Не все глаголы подчиняются одной схеме; некоторые меняют смысл в зависимости от формы.',
  ],
  [
    choice('I enjoy ___.', ['to read', 'reading', 'read'], 'reading', 'После enjoy — -ing.'),
    gap('Впиши to или at: She wants ___ learn English.', 'to', 'Want to + глагол.'),
    choice('He is good at ___.', ['swim', 'to swim', 'swimming'], 'swimming', 'После предлога at — -ing.'),
    gap('Впиши форму work: I finished ___ at six.', 'working', 'После finish — -ing.'),
    choice('We decided ___ home.', ['going', 'to go', 'go'], 'to go', 'После decide — to + глагол.'),
  ],
);
