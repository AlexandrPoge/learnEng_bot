import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: would-like. Порядок курса задан в school-junior.ts. */
export const wouldLikeLesson = schoolUnit(
  'would-like',
  'Would like: вежливо говорим о желании',
  'A1',
  [3, 4, 5],
  'verbs',
  '☕',
  'Попроси что-то и предложи угощение.',
  'I’d like + предмет · I’d like to + действие',
  [
    'Would like помогает вежливо выразить желание сейчас.',
    'I would like сокращается до I’d like.',
    'Перед действием нужен to: I’d like to visit.',
    'Would you like ...? — вежливое предложение; ответ: Yes, please / No, thank you.',
  ],
  [
    'I’d like some juice. — Я бы хотел немного сока.',
    'I’d like to rest. — Я бы хотел отдохнуть.',
    'Would you like a sandwich? — Хочешь сэндвич?',
    'Yes, please. — Да, пожалуйста.',
    'No, thank you. — Нет, спасибо.',
    'We’d like to see the menu. — Мы хотели бы посмотреть меню.',
  ],
  [
    '❌ I’d like go → ✅ I’d like to go.',
    'Не путай I like tea — люблю чай вообще — и I’d like tea — хочу чай сейчас.',
    'После would не добавляй -s: she would like.',
  ],
  [
    gap('I’d like ___ swim. (to/for)', 'to', 'Перед действием — to swim.'),
    choice(
      'Предложи чай.',
      ['Would you like some tea?', 'Do you would like tea?', 'Would you likes tea?'],
      'Would you like some tea?',
      'В вопросе would стоит перед you.',
    ),
    choice(
      'I’d like означает:',
      ['I would like', 'I did like всегда', 'I am like'],
      'I would like',
      'Здесь ’d — would.',
    ),
    gap('She would ___ a sandwich. (like)', 'like', 'После would — like.'),
    choice(
      'Вежливо откажись.',
      ['No, thank you.', 'No, I wouldn’t tea.', 'Not like.'],
      'No, thank you.',
      'Так можно ответить на предложение.',
    ),
  ],
);
