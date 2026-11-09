import { wordUnit } from '../course-builder.js';

/** Учебная тема: animals. Порядок курса задан в course-a1.ts. */
export const animalsLesson = wordUnit(
  'animals',
  'Животные',
  'A1',
  '🐾',
  'Назови животных и расскажи, что они умеют.',
  [
    ['cat', 'кошка', 'The cat is sleeping.', 'Кошка спит.'],
    ['dog', 'собака', 'The dog can run.', 'Собака умеет бегать.'],
    ['bird', 'птица', 'A bird is in the tree.', 'Птица на дереве.'],
    ['fish', 'рыба', 'The fish is in the water.', 'Рыба в воде.'],
    ['horse', 'лошадь', 'I can see a horse.', 'Я вижу лошадь.'],
    ['rabbit', 'кролик', 'The rabbit has long ears.', 'У кролика длинные уши.'],
  ],
);
