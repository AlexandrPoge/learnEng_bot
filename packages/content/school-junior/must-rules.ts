import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: must-rules. Порядок курса задан в school-junior.ts. */
export const mustRulesLesson = schoolUnit(
  'must-rules',
  'Must / mustn’t: правило и запрет',
  'A2',
  [4, 5, 6],
  'verbs',
  '🚦',
  'Различай обязанность и запрет.',
  'must do · mustn’t do',
  [
    'Must выражает сильную необходимость или правило.',
    'После must нужна начальная форма без to.',
    'Mustn’t означает запрет: делать нельзя.',
    'Отсутствие необходимости выражается don’t have to, а не mustn’t.',
  ],
  [
    'You must wear a helmet. — Нужно надеть шлем.',
    'We must be quiet here. — Здесь нужно вести себя тихо.',
    'You mustn’t touch this wire. — Этот провод нельзя трогать.',
    'She must finish today. — Ей нужно закончить сегодня.',
    'They must wait outside. — Им нужно ждать снаружи.',
    'You don’t have to come early. — Приходить рано необязательно.',
  ],
  [
    '❌ must to go → ✅ must go.',
    '❌ she musts → ✅ she must.',
    'Mustn’t — нельзя; don’t have to — не нужно / необязательно.',
  ],
  [
    gap('You must ___ here. (wait)', 'wait', 'После must — wait.'),
    choice(
      'Запрет:',
      ['You mustn’t enter.', 'You don’t have to enter.', 'You must to enter.'],
      'You mustn’t enter.',
      'Mustn’t — нельзя.',
    ),
    gap('She ___ wear a helmet. (must/musts)', 'must', 'Must не меняется по лицам.'),
    choice(
      'Необязательно:',
      ['You don’t have to go.', 'You mustn’t go.', 'You must go.'],
      'You don’t have to go.',
      'Don’t have to означает отсутствие необходимости.',
    ),
    choice(
      'Верная форма:',
      ['We must listen.', 'We must to listen.', 'We must listening.'],
      'We must listen.',
      'Начальная форма без to.',
    ),
  ],
);
