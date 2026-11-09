import { wordUnit } from '../course-builder.js';

/** Учебная тема: directions. Порядок курса задан в course-a2.ts. */
export const directionsLesson = wordUnit(
  'directions',
  'Как пройти?',
  'A2',
  '🧭',
  'Спроси дорогу и пойми простую инструкцию.',
  [
    ['turn left', 'поверни налево', 'Turn left at the corner.', 'Поверни налево на углу.'],
    ['turn right', 'поверни направо', 'Turn right after the shop.', 'Поверни направо после магазина.'],
    [
      'go straight',
      'иди прямо',
      'Go straight to the bridge.',
      'Иди прямо до моста.',
      ['go straight', 'go straight on'],
    ],
    ['opposite', 'напротив', 'The bank is opposite the park.', 'Банк напротив парка.'],
    ['next to', 'рядом с', 'The café is next to the shop.', 'Кафе рядом с магазином.'],
    ['cross', 'пересечь', 'Cross the street at the crossing.', 'Перейди улицу по переходу.'],
  ],
  ['Инструкции по карте — языковая практика; в реальном движении соблюдай дорожные правила.'],
  'situations',
);
