import { wordUnit } from '../course-builder.js';

/** Учебная тема: health. Порядок курса задан в course-a2.ts. */
export const healthLesson = wordUnit(
  'health',
  'Самочувствие и просьба о помощи',
  'A2',
  '🩹',
  'Опиши самочувствие простыми словами.',
  [
    ['headache', 'головная боль', 'I have a headache.', 'У меня болит голова.'],
    ['cold', 'простуда', 'I have a cold.', 'У меня простуда.'],
    ['hurt', 'болеть', 'My feet hurt.', 'У меня болят ноги.'],
    ['help', 'помощь', 'I need help.', 'Мне нужна помощь.'],
    ['doctor', 'врач', 'I need to see a doctor.', 'Мне нужно к врачу.'],
    ['feel', 'чувствовать', 'I feel tired.', 'Я чувствую усталость.'],
  ],
  [
    'Это тренировка языка, не оценка здоровья. Ребёнок может использовать I need help, чтобы обратиться к взрослому.',
  ],
  'situations',
);
