import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: countable-nouns. Порядок курса задан в course-a1.ts. */
export const countableNounsLesson = unit(
  'countable-nouns',
  'Что можно посчитать?',
  'A1',
  '🥛',
  'Отличай предметы от массы и количества вещества.',
  'an apple · two apples · some water',
  [
    'Исчисляемые слова имеют единственное и множественное число: one chair, two chairs.',
    'Неисчисляемые в обычном значении не считаются как отдельные штуки: water, rice, information.',
    'Чтобы посчитать вещество, добавь меру: a glass of water, two glasses of water.',
    'A/an подходят к одному исчисляемому предмету; some — также к неисчисляемому количеству.',
  ],
  [
    'I have an orange. — У меня апельсин.',
    'There are three chairs. — Есть три стула.',
    'I need some rice. — Мне нужно немного риса.',
    'Two bottles of water, please. — Две бутылки воды, пожалуйста.',
    'This is useful information. — Это полезная информация.',
    'A piece of advice. — Один совет.',
  ],
  [
    '❌ an advice → ✅ some advice / a piece of advice.',
    'Слово может менять тип по смыслу: chicken — курица как еда или отдельная птица.',
    'Считаем bottles или glasses, а не превращаем water в waters в базовом значении.',
  ],
  [
    choice(
      'Обычно неисчисляемое слово:',
      ['water', 'chair', 'apple'],
      'water',
      'Water в значении вещества неисчисляемое.',
    ),
    gap('Вставь a или an: ___ orange.', 'an', 'Orange — исчисляемое единственное, первый звук гласный.'),
    choice(
      'Два стакана воды:',
      ['two glasses of water', 'two waters glasses', 'two water'],
      'two glasses of water',
      'Считаем glasses, вода остаётся water.',
    ),
    gap('Впиши much / many: How ___ rice?', 'much', 'Rice в этом значении неисчисляемое.'),
    choice(
      'Выбери правильную фразу.',
      ['some information', 'an information', 'many information'],
      'some information',
      'Information неисчисляемое.',
    ),
  ],
);
