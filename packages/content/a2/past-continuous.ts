import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: past-continuous. Порядок курса задан в a2.ts. */
export const pastContinuousLesson = lesson(
  'past-continuous',
  'Past Continuous',
  'A2',
  [
    'Процесс в определённый момент прошлого: was / were + -ing.',
    'Часто длительное действие — фон, а короткое событие — Past Simple: I was cooking when he called.',
  ],
  [
    'At eight yesterday I was reading. — Вчера в восемь я читал.',
    'They were sleeping when the phone rang. — Они спали, когда зазвонил телефон.',
  ],
  [
    'I / he / she / it was; you / we / they were.',
    'When и while сами по себе не определяют время: важен смысл ситуации.',
  ],
  [
    choice(
      'At 8 p.m. yesterday, she ___ dinner.',
      ['was cooking', 'is cooking', 'were cooking'],
      'was cooking',
      'Процесс в момент прошлого: she was cooking.',
    ),
    gap('Впиши was или were: We ___ walking when it started raining.', 'were', 'С we используется were.'),
    choice(
      'I was sleeping when the phone ___.',
      ['rings', 'rang', 'ringing'],
      'rang',
      'Короткое событие на фоне процесса: rang.',
    ),
    gap('Напиши -ing форму sit: ___', 'sitting', 'Sit → sitting: удваиваем t.'),
    choice(
      'Выбери вопрос о процессе в прошлом.',
      ['Did you sleeping?', 'Were you sleeping?', 'Was you sleeping?'],
      'Were you sleeping?',
      'You were → Were you ...?',
    ),
  ],
);
