import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: irregular-verbs. Порядок курса задан в course-a2.ts. */
export const irregularVerbsLesson = unit(
  'irregular-verbs',
  'Неправильные глаголы',
  'A2',
  '🗂',
  'Учи частые неправильные глаголы в трёх формах.',
  'go–went–gone · see–saw–seen · eat–ate–eaten',
  [
    'Первая форма — начальная. Вторая нужна в утвердительном Past Simple.',
    'Третья используется, например, после have/has в Present Perfect.',
    'Не все формы разные: buy–bought–bought. Некоторые совпадают полностью: put–put–put.',
    'После did/didn’t возвращаем первую форму, даже если глагол неправильный.',
  ],
  [
    'I went to the zoo. — Я сходил в зоопарк.',
    'She has gone home. — Она ушла домой.',
    'We saw a rainbow. — Мы увидели радугу.',
    'Have you seen my pen? — Ты видел мою ручку?',
    'He ate an apple. — Он съел яблоко.',
    'I didn’t buy it. — Я это не купил.',
  ],
  [
    '❌ I goed → ✅ I went.',
    '❌ Have you saw? → ✅ Have you seen?',
    'Формы лучше учить с коротким предложением, а не только списком.',
  ],
  [
    gap('Вторая форма go: ___', 'went', 'Go–went–gone.'),
    gap('Третья форма see: ___', 'seen', 'See–saw–seen.'),
    choice('Вторая форма eat:', ['ate', 'eaten', 'eated'], 'ate', 'Eat–ate–eaten.'),
    gap('Did you ___ it? (buy)', 'buy', 'После did нужна первая форма.'),
    gap('Вторая форма buy: ___', 'bought', 'Buy–bought–bought.'),
  ],
);
