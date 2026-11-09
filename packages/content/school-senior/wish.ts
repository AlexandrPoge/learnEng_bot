import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: wish. Порядок курса задан в school-senior.ts. */
export const wishLesson = schoolUnit(
  'wish',
  'Wish / if only: хотелось бы иначе',
  'B2',
  [9, 10, 11],
  'sentences',
  '🌠',
  'Вырази сожаление о настоящем или прошлом.',
  'wish + Past Simple → сейчас · wish + Past Perfect → раньше',
  [
    'Wish + Past Simple выражает желание изменить настоящее: I wish I knew.',
    'Для сожаления о прошлом — wish + Past Perfect.',
    'Wish + would часто выражает недовольство поведением или желание изменения ситуации.',
    'If only усиливает желание или сожаление. Hope удобнее для реальной надежды на будущее.',
  ],
  [
    'I wish I knew the answer. — Хотелось бы знать ответ.',
    'She wishes she had more time. — Ей хотелось бы иметь больше времени.',
    'I wish I had called yesterday. — Жаль, что я не позвонил вчера.',
    'If only we had checked the map! — Если бы мы только проверили карту!',
    'I wish you would listen. — Хотелось бы, чтобы ты слушал.',
    'I hope the weather is good tomorrow. — Надеюсь, завтра будет хорошая погода.',
  ],
  [
    '❌ I wish I know → ✅ I wish I knew для нереального настоящего.',
    'Сожаление о вчерашнем обычно требует had + V3.',
    'Не заменяй hope словом wish в любой реальной надежде.',
  ],
  [
    gap('I wish I ___ the answer. (know)', 'knew', 'Нереальное настоящее — knew.'),
    gap('I wish I ___ called yesterday.', 'had', 'Сожаление о прошлом — had called.'),
    choice(
      'Реальная надежда на завтра:',
      ['I hope it is sunny tomorrow.', 'I wish it was sunny yesterday tomorrow.', 'I wish I know tomorrow.'],
      'I hope it is sunny tomorrow.',
      'Hope для реальной надежды.',
    ),
    gap('If ___ I had listened!', 'only', 'Усиление if only.'),
    choice(
      'I wish you would stop shouting выражает:',
      ['Желание изменить поведение', 'Точный факт вчера', 'Обязательную будущую победу'],
      'Желание изменить поведение',
      'Wish + would — желание изменения.',
    ),
  ],
);
