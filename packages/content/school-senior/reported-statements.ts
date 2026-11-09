import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: reported-statements. Порядок курса задан в school-senior.ts. */
export const reportedStatementsLesson = schoolUnit(
  'reported-statements',
  'Косвенная речь: передаём слова',
  'B1',
  [8, 9, 10, 11],
  'sentences',
  '🗣',
  'Передай чужое сообщение своими словами.',
  'said (that) · told someone (that)',
  [
    'Косвенная речь передаёт смысл сообщения без цитаты.',
    'После прошедшего said/told время часто сдвигается назад: am → was, have done → had done.',
    'Местоимения меняются по тому, кто говорит и о ком: I может стать he или she.',
    'Say не требует получателя; tell обычно требует: told me. Если факт остаётся верным, сдвиг времени может не понадобиться.',
  ],
  [
    '“I am tired,” Leo said. → Leo said he was tired. — Лео сказал, что устал.',
    '“We live here.” → They said they lived there. — Они сказали, что живут там.',
    'She told me that she was busy. — Она сказала мне, что занята.',
    'He said that he had finished. — Он сказал, что закончил.',
    'They said they would help. — Они сказали, что помогут.',
    'The teacher said the Earth goes round the Sun. — Учитель сказал, что Земля вращается вокруг Солнца.',
  ],
  [
    '❌ said me → ✅ told me / said to me.',
    'Не меняй все местоимения механически: учитывай участников.',
    'Today / here меняются только если изменились день или место сообщения.',
  ],
  [
    gap('She ___ me she was busy. (said/told)', 'told', 'Перед me здесь tell → told.'),
    choice(
      'Передай I am tired после He said; используй сдвиг.',
      ['He said he was tired.', 'He said I is tired.', 'He told was tired.'],
      'He said he was tired.',
      'I → he; am → was.',
    ),
    gap('They said they ___ help. (will; со сдвигом)', 'would', 'Will → would.'),
    choice(
      'Правильно:',
      [
        'He said to me that he was ready.',
        'He said me that he was ready.',
        'He told that he was ready без получателя.',
      ],
      'He said to me that he was ready.',
      'Say to me / tell me.',
    ),
    gap('She said she had ___. (finish)', 'finished', 'В Past Perfect — had finished.'),
  ],
);
