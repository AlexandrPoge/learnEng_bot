import { wordUnit } from '../course-builder.js';

/** Учебная тема: feelings. Порядок курса задан в course-a1.ts. */
export const feelingsLesson = wordUnit(
  'feelings',
  'Чувства и состояние',
  'A1',
  '🙂',
  'Скажи, как себя чувствуешь.',
  [
    ['happy', 'счастливый', 'I am happy today.', 'Сегодня я счастлив.'],
    ['sad', 'грустный', 'He is sad.', 'Он грустит.'],
    ['tired', 'уставший', 'We are tired after the game.', 'Мы устали после игры.'],
    ['hungry', 'голодный', 'I am hungry.', 'Я голоден.'],
    ['thirsty', 'испытывающий жажду', 'She is thirsty.', 'Она хочет пить.'],
    ['worried', 'обеспокоенный', 'I am worried about the test.', 'Я волнуюсь из-за теста.'],
  ],
  ['I am hungry — с be, не I have hungry. Говорить о чувствах можно без оценки «хорошие/плохие».'],
);
