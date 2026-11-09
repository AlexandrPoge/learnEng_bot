import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: simple-or-continuous. Порядок курса задан в course-a2.ts. */
export const simpleOrContinuousLesson = unit(
  'simple-or-continuous',
  'Обычно или прямо сейчас?',
  'A2',
  '⚖️',
  'Выбери между Present Simple и Continuous.',
  'every day → привычка · now → процесс',
  [
    'Present Simple подходит для привычки, факта или расписания.',
    'Present Continuous: am/is/are + -ing — действие в процессе сейчас или в текущий период.',
    'Сначала пойми ситуацию, затем ищи слова-подсказки. Слово now не отменяет особые свойства глагола know.',
    'Сравни одну и ту же деятельность: I read every day; I am reading now.',
  ],
  [
    'I walk to school every day. — Я каждый день хожу в школу пешком.',
    'I am walking to school now. — Я сейчас иду в школу.',
    'She usually wears jeans. — Обычно она носит джинсы.',
    'Today she is wearing a dress. — Сегодня она в платье.',
    'We know the answer. — Мы знаем ответ. Know обычно не используется в Continuous.',
    'The train leaves at six. — Поезд отправляется в шесть. Это расписание.',
  ],
  [
    '❌ I am read now → ✅ I am reading now.',
    '❌ She play every day → ✅ She plays every day.',
    'Маркеры — подсказка, а не замена понимания ситуации.',
  ],
  [
    choice(
      'Every day she ___ to school.',
      ['walks', 'is walking', 'walk'],
      'walks',
      'Привычка + she → walks.',
    ),
    choice(
      'Look! They ___ football.',
      ['are playing', 'play now', 'is playing'],
      'are playing',
      'Наблюдаем процесс, they + are playing.',
    ),
    gap('Впиши be: I ___ reading now.', 'am', 'I требует am.'),
    choice(
      'Правильно про знание:',
      ['I know.', 'I am knowing.', 'I knowing.'],
      'I know.',
      'Know обычно не используется в Continuous.',
    ),
    gap('Форма read: He ___ every evening.', 'reads', 'He в привычке → reads.'),
  ],
);
