import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: ed-ing-adjectives. Порядок курса задан в school-junior.ts. */
export const edIngAdjectivesLesson = schoolUnit(
  'ed-ing-adjectives',
  'Bored или boring: чувство и причина',
  'A2',
  [5, 6, 7],
  'modifiers',
  '🎭',
  'Различай своё чувство и то, что его вызывает.',
  'I am interested · the story is interesting',
  [
    'Прилагательные на -ed часто описывают чувство: I am excited.',
    'Прилагательные на -ing описывают то, что вызывает чувство: an exciting game.',
    'Человек тоже может быть interesting: он вызывает интерес у других.',
    'Выбирай по смыслу, а не только по тому, человек это или предмет.',
  ],
  [
    'The puzzle is interesting. — Головоломка интересная.',
    'I am interested in puzzles. — Я интересуюсь головоломками.',
    'The journey was tiring. — Поездка была утомительной.',
    'We were tired after it. — После неё мы устали.',
    'The noise was annoying. — Шум раздражал.',
    'She felt annoyed. — Она была раздражена.',
  ],
  [
    'I am boring — я скучный; I am bored — мне скучно.',
    '❌ I am interesting in art → ✅ I am interested in art.',
    'Не все слова с -ed описывают чувства; правило здесь о конкретных парах.',
  ],
  [
    choice('Мне скучно:', ['I am bored.', 'I am boring.', 'I am bore.'], 'I am bored.', 'Чувство — bored.'),
    gap('An ___ game. (excited/exciting)', 'exciting', 'Игра вызывает волнение.'),
    gap('I am ___ in music. (interested/interesting)', 'interested', 'Чувство интереса — interested.'),
    choice(
      'Утомительная работа:',
      ['tiring work', 'tired work', 'tire workly'],
      'tiring work',
      'Работа вызывает усталость.',
    ),
    gap('We felt ___. (tired/tiring)', 'tired', 'Мы испытывали усталость.'),
  ],
);
