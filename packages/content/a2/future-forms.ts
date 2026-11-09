import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: future-forms. Порядок курса задан в a2.ts. */
export const futureFormsLesson = lesson(
  'future-forms',
  'Будущее: will / going to / Continuous',
  'A2',
  [
    'Will + глагол: решение в момент речи, обещание, прогноз.',
    'Be going to + глагол: намерение или прогноз по наблюдаемым признакам.',
    'Present Continuous может описывать договорённость: I’m meeting Anna tomorrow.',
  ],
  [
    'The phone is ringing. I’ll answer it. — Телефон звонит. Я отвечу.',
    'Look at those clouds! It’s going to rain. — Посмотри на тучи! Будет дождь.',
  ],
  [
    'После will нет to: will help.',
    'Going to требует be: She is going to study.',
    'Будущие формы иногда взаимозаменяемы: здесь выбираем по указанному контексту.',
  ],
  [
    choice(
      'Впиши форму в обещание: I promise I ___ help you.',
      ['will', 'am', 'going'],
      'will',
      'Обещание: will + глагол.',
    ),
    gap('Впиши am / is / are: She ___ going to learn English.', 'is', 'She is going to ...'),
    choice(
      'Look! That glass is falling. It ___ break.',
      ['is going to', 'going to', 'is'],
      'is going to',
      'Прогноз по видимым признакам: is going to break.',
    ),
    gap('Впиши глагол: I will ___ (call) you tomorrow.', 'call', 'После will — начальная форма без to.'),
    choice(
      'Договорённость уже назначена. Выбери правильную форму.',
      ['I meeting Anna tomorrow.', 'I am meeting Anna tomorrow.', 'I am meet Anna tomorrow.'],
      'I am meeting Anna tomorrow.',
      'Present Continuous: am + meeting.',
    ),
  ],
);
