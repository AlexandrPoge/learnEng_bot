import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: quantifiers. Порядок курса задан в a2.ts. */
export const quantifiersLesson = lesson(
  'quantifiers',
  'Some / any / much / many',
  'A2',
  [
    'Many — с исчисляемыми во множественном числе; much — с неисчисляемыми.',
    'Some часто в утверждениях; any — в вопросах и отрицаниях.',
    'Some также бывает в предложениях и просьбах, когда ожидается согласие: Would you like some tea?',
  ],
  [
    'How many apples? How much water?',
    'There are some apples. There isn’t any milk.',
    'A few friends — несколько друзей; a little water — немного воды.',
  ],
  [
    'Money, advice, information в этих значениях неисчисляемые.',
    'В обычных утверждениях a lot of часто естественнее, чем much: I have a lot of time.',
  ],
  [
    choice('How ___ money do you need?', ['many', 'much', 'a few'], 'much', 'Money — неисчисляемое.'),
    gap('Впиши much или many: How ___ books have you got?', 'many', 'Books можно посчитать.'),
    choice(
      'Would you like ___ tea?',
      ['some', 'many', 'a few'],
      'some',
      'В предложении напитка естественно some.',
    ),
    gap('Впиши some или any: There isn’t ___ milk left.', 'any', 'В отрицании обычно any.'),
    choice('I need ___ advice.', ['an', 'some', 'many'], 'some', 'Advice — неисчисляемое: some advice.'),
  ],
);
