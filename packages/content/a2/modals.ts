import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: modals. Порядок курса задан в a2.ts. */
export const modalsLesson = lesson(
  'modals',
  'Should / must / have to',
  'A2',
  [
    'Should + глагол — совет. Must + глагол — сильная необходимость; have to + глагол — необходимость по обстоятельствам или правилам.',
    'Mustn’t — запрещено; don’t have to — не обязательно.',
    'В прошлом для необходимости обычно had to. Для вопросов с have to: Do you have to ...?',
  ],
  [
    'You should rest. — Тебе стоит отдохнуть.',
    'You mustn’t smoke here. — Здесь нельзя курить.',
    'You don’t have to come. — Тебе не обязательно приходить.',
  ],
  ['Mustn’t и don’t have to не синонимы.', 'После should / must нет to, но have to содержит to.'],
  [
    choice(
      'Скажи «Тебе стоит отдохнуть». You ___ rest.',
      ['should', 'should to', 'shoulds'],
      'should',
      'Совет: should + глагол.',
    ),
    gap('Впиши must или have: We ___ to wear a uniform at school.', 'have', 'Have to + глагол.'),
    choice(
      '«Входить запрещено»: You ___ enter.',
      ['mustn’t', 'don’t have to', 'should to'],
      'mustn’t',
      'Mustn’t означает запрет.',
    ),
    gap('Впиши форму have: Yesterday I ___ to work late.', 'had', 'Необходимость в прошлом: had to.'),
    choice(
      '«Приходить не обязательно»: You ___ come.',
      ['mustn’t', 'don’t have to', 'doesn’t have to'],
      'don’t have to',
      'Don’t have to — нет необходимости.',
    ),
  ],
);
