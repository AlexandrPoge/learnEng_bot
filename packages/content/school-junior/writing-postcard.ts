import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: writing-postcard. Порядок курса задан в school-junior.ts. */
export const writingPostcardLesson = schoolUnit(
  'writing-postcard',
  'Пишем открытку из поездки',
  'A2',
  [4, 5, 6],
  'sentences',
  '🏖',
  'Коротко расскажи, где ты и как проходит поездка.',
  'где → погода → занятия → впечатление → прощание',
  [
    'Открытка обычно короче письма: выбери несколько важных деталей.',
    'Скажи, где находишься, какая погода и что делаешь.',
    'Для происходящего сейчас удобно Present Continuous; для впечатления — обычное описание.',
    'Поздоровайся и подпишись. В тесте проверяются фразы, а не произвольная открытка.',
  ],
  [
    'Hi Ben! — Привет, Бен!',
    'We are in Rome. — Мы в Риме.',
    'It is sunny here. — Здесь солнечно.',
    'I’m sitting in a café. — Я сижу в кафе.',
    'The city is beautiful. — Город красивый.',
    'See you soon! Love, Mia. — До скорого! С любовью, Мия.',
  ],
  [
    'Не пытайся вместить весь дневник путешествия в открытку.',
    '❌ We sitting → ✅ We are sitting.',
    'Названия городов пишутся с заглавной буквы.',
  ],
  [
    choice(
      'Где названо место?',
      ['We are in Rome.', 'See you soon!', 'Love, Mia.'],
      'We are in Rome.',
      'Фраза отвечает на «где?».',
    ),
    gap('It ___ sunny here.', 'is', 'Для погоды — it is.'),
    gap('We ___ enjoying our trip. (be)', 'are', 'We are + -ing.'),
    choice(
      'Прощание:',
      ['See you soon!', 'Where are you?', 'It is hot.'],
      'See you soon!',
      'До скорого — завершение.',
    ),
    choice(
      'Что лучше для короткой открытки?',
      ['Несколько деталей о поездке', 'Только длинный список правил', 'Полный рассказ за год'],
      'Несколько деталей о поездке',
      'Открытка обычно короткая.',
    ),
  ],
  'situations',
);
