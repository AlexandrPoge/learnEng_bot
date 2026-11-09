import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: was-were. Порядок курса задан в course-a2.ts. */
export const wasWereLesson = unit(
  'was-were',
  'Was / were: быть в прошлом',
  'A2',
  '🕰',
  'Расскажи, где ты был и каким было событие.',
  'I / he / she / it was · you / we / they were',
  [
    'Was и were — прошедшие формы be.',
    'С I/he/she/it используем was; с you/we/they — were.',
    'Отрицание: wasn’t / weren’t. Вопрос: Was he ...? Were they ...?',
    'Не добавляй did в обычный вопрос с was/were.',
  ],
  [
    'I was at home yesterday. — Вчера я был дома.',
    'You were right. — Ты был прав.',
    'The film was funny. — Фильм был смешным.',
    'We weren’t tired. — Мы не устали.',
    'Was your friend there? — Твой друг был там?',
    'Were the shops open? — Магазины были открыты?',
  ],
  [
    '❌ You was → ✅ You were.',
    '❌ Did she was here? → ✅ Was she here?',
    'Форма was/were сама показывает прошлое.',
  ],
  [
    gap('I ___ at the park yesterday.', 'was', 'С I — was.'),
    gap('They ___ happy yesterday.', 'were', 'С they — were.'),
    choice(
      'Выбери вопрос.',
      ['Was she at home?', 'Did she was at home?', 'Were she at home?'],
      'Was she at home?',
      'Was ставится перед she.',
    ),
    choice('Краткое отрицание were not:', ['weren’t', 'wasn’t', 'didn’t'], 'weren’t', 'Were not = weren’t.'),
    gap('___ you at school yesterday?', 'were', 'You требует were.'),
  ],
);
