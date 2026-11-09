import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: past-simple-continuous. Порядок курса задан в school-junior.ts. */
export const pastSimpleContinuousLesson = schoolUnit(
  'past-simple-continuous',
  'Past Simple или Past Continuous?',
  'A2',
  [6, 7, 8],
  'tenses',
  '🎬',
  'Различай фон и событие в рассказе.',
  'was reading → процесс · called → событие',
  [
    'Past Continuous описывает процесс в определённый момент прошлого.',
    'Past Simple может обозначать отдельное завершённое событие.',
    'Процесс часто служит фоном для события: I was cooking when she called.',
    'When и while помогают связать части, но форму выбираем по смыслу ситуации.',
  ],
  [
    'I was drawing when the bell rang. — Я рисовал, когда прозвенел звонок.',
    'She called me at six. — Она позвонила мне в шесть.',
    'At six, I was walking home. — В шесть я шёл домой.',
    'While we were eating, it started to rain. — Пока мы ели, начался дождь.',
    'He opened the window and sat down. — Он открыл окно и сел.',
    'They were talking while I was reading. — Они разговаривали, пока я читал.',
  ],
  [
    '❌ I was drew → ✅ I was drawing.',
    'Не ставь Continuous везде только потому, что предложение о прошлом.',
    'После did используем начальную форму, а не вторую.',
  ],
  [
    gap('I was ___ when she called. (read)', 'reading', 'Фон — was reading.'),
    choice(
      'Звонок как отдельное событие:',
      ['The phone rang.', 'The phone was rang.', 'The phone ringed.'],
      'The phone rang.',
      'Past Simple; ring → rang.',
    ),
    gap('While they ___ eating, I arrived. (be)', 'were', 'They → were eating.'),
    choice(
      'В шесть процесс ещё шёл:',
      ['I was doing my homework at six.', 'I dided homework at six.', 'I was do homework at six.'],
      'I was doing my homework at six.',
      'Процесс в момент прошлого — was doing.',
    ),
    gap('Did you ___ the noise? (hear)', 'hear', 'После did — hear.'),
  ],
);
