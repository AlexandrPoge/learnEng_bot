import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: adjectives. Порядок курса задан в school-junior.ts. */
export const adjectivesLesson = schoolUnit(
  'adjectives',
  'Прилагательные: какой предмет?',
  'A1',
  [2, 3, 4, 5],
  'modifiers',
  '🎨',
  'Опиши предмет и правильно поставь прилагательное.',
  'a green bag · the bag is green',
  [
    'Прилагательное описывает человека или предмет: small, kind, green.',
    'Перед существительным прилагательное обычно стоит до него: a red kite.',
    'После be оно может описывать подлежащее: The kite is red.',
    'Прилагательное не получает -s во множественном числе.',
  ],
  [
    'A small dog is here. — Здесь маленькая собака.',
    'The dog is small. — Собака маленькая.',
    'These bags are heavy. — Эти сумки тяжёлые.',
    'She is kind. — Она добрая.',
    'We have two green chairs. — У нас два зелёных стула.',
    'The room looks bright. — Комната выглядит светлой.',
  ],
  [
    '❌ greens chairs → ✅ green chairs.',
    '❌ a bag green → ✅ a green bag в обычном описании.',
    'Не забывай be: The bag is heavy.',
  ],
  [
    choice(
      'Выбери описание.',
      ['a blue car', 'a car blue', 'a blues car'],
      'a blue car',
      'Прилагательное перед существительным.',
    ),
    gap('Two ___ bags. (heavy)', 'heavy', 'Прилагательное не получает -s.'),
    gap('The room ___ clean. (be)', 'is', 'Связка be: the room is clean.'),
    choice(
      'Что описывает прилагательное?',
      ['Предмет или человека', 'Только время', 'Всегда число предметов'],
      'Предмет или человека',
      'Прилагательное отвечает на «какой?».',
    ),
    choice(
      'Во множественном числе:',
      ['The cats are small.', 'The cats are smalls.', 'The cats small is.'],
      'The cats are small.',
      'Small не меняется по числу.',
    ),
  ],
);
