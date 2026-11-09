import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: to-be. Порядок курса задан в a1.ts. */
export const toBeLesson = lesson(
  'to-be',
  'To be: am / is / are',
  'A1',
  [
    'Be связывает человека или предмет с описанием: кто он, какой он, где он.',
    'I am; he / she / it is; you / we / they are. Отрицание: добавить not.',
    'В вопросе be ставим перед подлежащим: Are you ready?',
  ],
  [
    'I am a student. — Я ученик / студент.',
    'She is at home. — Она дома.',
    'They are not tired. — Они не устали.',
  ],
  ['Нельзя пропускать be: She is happy, а не She happy.', 'Вопрос: Is he here? — без do / does.'],
  [
    choice('I ___ ready.', ['am', 'is', 'are'], 'am', 'С I используется am.'),
    choice('They ___ at school.', ['am', 'is', 'are'], 'are', 'С they используется are.'),
    gap('Впиши be: My sister ___ a doctor.', 'is', 'My sister = she: is.'),
    choice(
      'Выбери вопрос.',
      ['Do you are happy?', 'Are you happy?', 'You happy?'],
      'Are you happy?',
      'В вопросе are ставим перед you.',
    ),
    gap('Впиши be: We ___ not late.', 'are', 'We are not late — мы не опоздали.'),
  ],
);
