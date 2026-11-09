import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: polite-requests. Порядок курса задан в course-a2.ts. */
export const politeRequestsLesson = unit(
  'polite-requests',
  'Вежливые просьбы и предложения',
  'A2',
  '🤝',
  'Попроси помощь, разрешение или предложи что-то.',
  'Could you …? · Can I …? · Would you like …?',
  [
    'Could you + глагол — вежливая просьба о действии.',
    'Can I / Could I + глагол — просьба о разрешении.',
    'Would you like + существительное или to + глагол — предложение.',
    'Отказ тоже может быть вежливым: No, thank you. I’m sorry, I can’t.',
  ],
  [
    'Could you help me, please? — Не могли бы вы помочь?',
    'Can I borrow your ruler? — Можно одолжить линейку?',
    'Could I sit here? — Можно мне здесь сесть?',
    'Would you like some tea? — Хотите чаю?',
    'Would you like to join us? — Хотите присоединиться?',
    'No, thank you. — Нет, спасибо.',
  ],
  [
    'После could/can не ставим to.',
    'Would you like to go, но Would you like some water: разные продолжения.',
    'Could в вежливой просьбе не обязательно обозначает прошлое.',
  ],
  [
    gap('___ you help me, please? (Could/Do)', 'could', 'Could you ...? — вежливая просьба.'),
    choice('Would you like ___ join us?', ['to', 'for', 'at'], 'to', 'Перед действием нужен to.'),
    choice(
      'Спросить разрешение:',
      ['Can I sit here?', 'Can I to sit here?', 'Do I can sit here?'],
      'Can I sit here?',
      'Can I + начальная форма.',
    ),
    gap('No, thank ___.', 'you', 'No, thank you — вежливый отказ.'),
    choice('Could you ___ the door?', ['open', 'to open', 'opens'], 'open', 'После could — начальная форма.'),
  ],
  'situations',
);
