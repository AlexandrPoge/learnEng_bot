import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: used-to. Порядок курса задан в school-senior.ts. */
export const usedToLesson = schoolUnit(
  'used-to',
  'Used to: раньше было, теперь изменилось',
  'B1',
  [7, 8, 9, 10],
  'tenses',
  '🕰',
  'Расскажи о прежней привычке или состоянии.',
  'used to do · didn’t use to do · Did you use to ...?',
  [
    'Used to описывает привычку или состояние в прошлом, которые теперь изменились.',
    'После used to нужна начальная форма: used to live.',
    'С did / didn’t используем use to без -d.',
    'Be used to doing — другая конструкция: быть привыкшим; не смешивай её с used to do.',
  ],
  [
    'I used to cycle to school. — Раньше я ездил в школу на велосипеде.',
    'She used to live here. — Раньше она жила здесь.',
    'We didn’t use to have a car. — Раньше у нас не было машины.',
    'Did you use to play chess? — Ты раньше играл в шахматы?',
    'There used to be a shop here. — Раньше здесь был магазин.',
    'I am used to getting up early. — Я привык рано вставать; это другая конструкция.',
  ],
  [
    '❌ didn’t used to → ✅ didn’t use to.',
    '❌ used to lived → ✅ used to live.',
    'Used to do и be used to doing имеют разные значения.',
  ],
  [
    gap('I used to ___ here. (live)', 'live', 'После used to — live.'),
    gap('Did you ___ to swim here?', 'use', 'После did — use.'),
    choice(
      'Раньше не было:',
      ['We didn’t use to have a car.', 'We didn’t used to have a car.', 'We not used have a car.'],
      'We didn’t use to have a car.',
      'Didn’t use to.',
    ),
    choice(
      'Что может описывать used to?',
      ['Прежнюю привычку или состояние', 'Только завтрашний план', 'Только действие прямо сейчас'],
      'Прежнюю привычку или состояние',
      'Контраст прошлого и настоящего.',
    ),
    gap(
      'She is used to ___ early. (get up; только глагол)',
      'getting up',
      'После be used to здесь нужна -ing форма.',
    ),
  ],
);
