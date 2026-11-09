import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: numbers. Порядок курса задан в course-a1.ts. */
export const numbersLesson = unit(
  'numbers',
  'Числа, возраст и даты',
  'A1',
  '🔢',
  'Считай и рассказывай, сколько тебе лет.',
  'How old? — сколько лет · How many? — сколько штук',
  [
    'Для количества: one, two, three. Для порядка: first, second, third.',
    'Возраст: I am ten, не I have ten. В вопросе: How old are you?',
    'От 21 до 99 составные числительные обычно пишутся через дефис: twenty-one.',
    'В датах встречаются порядковые формы: the first of May. Обозначения 1st, 2nd, 3rd, 4th читаются как first, second, third, fourth.',
  ],
  [
    'I am eight. — Мне восемь лет.',
    'There are twelve months. — В году двенадцать месяцев.',
    'She has twenty-one pencils. — У неё двадцать один карандаш.',
    'This is my first lesson. — Это мой первый урок.',
    'May is the fifth month. — Май — пятый месяц.',
    'How many tickets? — Сколько билетов?',
  ],
  [
    'Thirteen — 13, thirty — 30. Обрати внимание на окончание.',
    '❌ I have nine years → ✅ I am nine years old.',
    'Не смешивай количество и порядок: two books, но the second book.',
  ],
  [
    gap('Напиши число 12 по-английски.', 'twelve', '12 — twelve.'),
    choice('Thirty — это:', ['30', '13', '3'], '30', 'Thirty = 30.'),
    gap('Первый по-английски: ___', 'first', 'Порядковая форма one — first.'),
    choice('«Мне десять лет»: I ___ ten.', ['am', 'have', 'has'], 'am', 'Возраст выражаем с be.'),
    gap('Напиши число 20 по-английски.', 'twenty', '20 — twenty.'),
  ],
  'foundation',
);
