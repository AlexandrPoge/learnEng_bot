import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: past-simple. Порядок курса задан в a2.ts. */
export const pastSimpleLesson = lesson(
  'past-simple',
  'Past Simple',
  'A2',
  [
    'Завершённые события в прошлом: yesterday, last week, in 2020.',
    'Правильный глагол + -ed; неправильный — вторая форма: go → went.',
    'Вопрос: Did you go? Отрицание: I didn’t go. Be: was / were, без did.',
  ],
  ['She visited her friend yesterday. — Она навестила друга вчера.', 'We went home. — Мы пошли домой.'],
  [
    'После did / didn’t используем начальную форму: didn’t go, а не didn’t went.',
    'Вопрос с be: Were you tired?, а не Did you be tired?',
  ],
  [
    choice(
      'Yesterday I ___ to the park.',
      ['go', 'went', 'gone'],
      'went',
      'Go → went: завершённое действие вчера.',
    ),
    gap('Впиши форму visit: She ___ us last week.', 'visited', 'Visit — правильный глагол: visited.'),
    choice('Did he ___ the film?', ['saw', 'seen', 'see'], 'see', 'После did — начальная форма see.'),
    gap('Впиши was или were: They ___ at home yesterday.', 'were', 'С they в прошлом используем were.'),
    choice(
      'Выбери отрицание.',
      ['I didn’t went.', 'I didn’t go.', 'I don’t went.'],
      'I didn’t go.',
      'Didn’t + начальная форма.',
    ),
  ],
);
