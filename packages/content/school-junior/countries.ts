import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: countries. Порядок курса задан в school-junior.ts. */
export const countriesLesson = schoolUnit(
  'countries',
  'Страны, языки и национальности',
  'A1',
  [3, 4, 5],
  'nouns',
  '🌍',
  'Расскажи, откуда человек и на каком языке говорит.',
  'France → French · Japan → Japanese',
  [
    'Страна, язык и национальность — не всегда одно и то же слово.',
    'Названия стран, языков и национальностей пишутся с заглавной буквы.',
    'I am from + страна; I speak + язык.',
    'Прилагательное национальности не требует a: She is French.',
  ],
  [
    'I am from Belarus. — Я из Беларуси.',
    'She is from France. — Она из Франции.',
    'She speaks French. — Она говорит по-французски.',
    'He is Japanese. — Он японец.',
    'We are learning English. — Мы учим английский.',
    'They live in Spain and speak Spanish. — Они живут в Испании и говорят по-испански.',
  ],
  [
    '❌ I speak France → ✅ I speak French.',
    '❌ She is a French → ✅ She is French, когда используем прилагательное.',
    'В английском English начинается с большой буквы.',
  ],
  [
    gap('I am ___ Belarus. (from/to)', 'from', 'Происхождение: from.'),
    gap('Язык Франции в словаре урока: ___', 'French', 'France — страна, French — язык.'),
    choice('Человек из Японии:', ['Japanese', 'Japanish', 'Japanly'], 'Japanese', 'Japan → Japanese.'),
    choice(
      'Выбери правильную фразу.',
      ['She is Spanish.', 'She is a Spanish.', 'She speaks Spain.'],
      'She is Spanish.',
      'Spanish здесь прилагательное национальности.',
    ),
    gap(
      'Название английского языка: ___',
      'English',
      'Языки пишутся с заглавной буквы; регистр в тесте не влияет на оценку.',
    ),
  ],
  'vocabulary',
);
