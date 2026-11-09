import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: word-order. Порядок курса задан в course-a1.ts. */
export const wordOrderLesson = unit(
  'word-order',
  'Порядок слов в предложении',
  'A1',
  '🧱',
  'Собери понятное утверждение и вопрос.',
  'кто → действие → что → где / когда',
  [
    'В обычном утверждении сначала ставится тот, кто действует, затем глагол.',
    'Дополнение обычно идёт после глагола: I read books.',
    'Прилагательное ставится перед существительным: a red bag.',
    'Для вопроса с обычным глаголом часто нужно do/does. С be меняем порядок be и подлежащего.',
  ],
  [
    'We play football after school. — Мы играем в футбол после школы.',
    'She likes this song. — Ей нравится эта песня.',
    'I have a small dog. — У меня маленькая собака.',
    'Are you ready? — Ты готов?',
    'Do they know you? — Они тебя знают?',
    'He is in the garden. — Он в саду.',
  ],
  [
    '❌ a bag red → ✅ a red bag.',
    'В английском обычно нельзя опустить подлежащее: It is cold, а не Is cold.',
    'Не переставляй слова по русскому порядку автоматически.',
  ],
  [
    choice(
      'Выбери правильную фразу.',
      ['a green hat', 'a hat green', 'green a hat'],
      'a green hat',
      'Прилагательное перед существительным.',
    ),
    choice(
      'Выбери утверждение.',
      ['She reads books.', 'Reads she books.', 'Books reads she.'],
      'She reads books.',
      'Кто → действие → что.',
    ),
    gap('Впиши подлежащее: ___ is raining. (о погоде)', 'it', 'Для погоды используем it.'),
    choice(
      'Вопрос с be:',
      ['Are they here?', 'They are here?', 'Do they are here?'],
      'Are they here?',
      'В обычном вопросе are ставится первым.',
    ),
    gap('Впиши do / does: ___ your sister like music?', 'does', 'Your sister = she, нужен does.'),
  ],
);
