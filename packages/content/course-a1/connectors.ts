import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: connectors. Порядок курса задан в course-a1.ts. */
export const connectorsLesson = unit(
  'connectors',
  'And / but / because / so',
  'A1',
  '🔗',
  'Соедини мысли и объясни причину.',
  'and — и · but — но · because — потому что · so — поэтому',
  [
    'And добавляет похожую мысль.',
    'But показывает противопоставление.',
    'Because вводит причину; so вводит результат.',
    'Для учебной фразы выбери одно направление: результат because причина; причина so результат.',
  ],
  [
    'I like apples and pears. — Я люблю яблоки и груши.',
    'It is small but comfortable. — Он маленький, но удобный.',
    'I am tired because I worked hard. — Я устал, потому что много работал.',
    'It is raining, so we are inside. — Идёт дождь, поэтому мы внутри.',
    'She can sing and dance. — Она умеет петь и танцевать.',
    'I wanted to play, but I had homework. — Я хотел поиграть, но были уроки.',
  ],
  [
    'Не соединяй одну и ту же причину конструкцией because … so без необходимости.',
    'Because — причина, не просто любое слово между предложениями.',
    'But не означает «и»: он показывает разницу или неожиданность.',
  ],
  [
    gap('I like cats ___ dogs. (и)', 'and', 'And добавляет второй пункт.'),
    choice('Для противопоставления:', ['but', 'and', 'because'], 'but', 'But = но.'),
    gap('I am happy ___ it is my birthday. (потому что)', 'because', 'Because вводит причину.'),
    choice('It is cold, ___ I wear a coat.', ['so', 'because', 'but'], 'so', 'Вторая часть — результат: so.'),
    gap('I like tea, ___ I don’t like coffee. (но)', 'but', 'But противопоставляет две мысли.'),
  ],
);
