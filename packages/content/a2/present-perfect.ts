import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: present-perfect. Порядок курса задан в a2.ts. */
export const presentPerfectLesson = lesson(
  'present-perfect',
  'Present Perfect и Past Simple',
  'A2',
  [
    'Present Perfect: have / has + третья форма; опыт до настоящего момента или результат, связанный с настоящим.',
    'Past Simple: событие в завершённом прошлом, часто с yesterday, last week, in 2020.',
    'Ever — когда-либо; never — никогда; yet — ещё / уже в вопросах и отрицаниях.',
  ],
  [
    'I have lost my keys. — Я потерял ключи (актуальный результат).',
    'I lost my keys yesterday. — Я потерял ключи вчера.',
    'Have you ever been to London? — Ты когда-нибудь был в Лондоне?',
  ],
  [
    'С yesterday обычно нужен Past Simple: I saw him yesterday.',
    'Третья форма go — gone; been to обычно говорит об опыте посещения с возвращением.',
  ],
  [
    choice(
      'I ___ him yesterday.',
      ['have seen', 'saw', 'has seen'],
      'saw',
      'Yesterday — завершённое время в прошлом.',
    ),
    gap('Впиши have или has: She ___ finished her homework.', 'has', 'She has + третья форма.'),
    choice(
      'Have you ever ___ to London?',
      ['been', 'went', 'was'],
      'been',
      'Для опыта посещения: have been to.',
    ),
    gap('Напиши третью форму eat: ___', 'eaten', 'Eat → ate → eaten.'),
    choice(
      'We haven’t finished ___.',
      ['yet', 'yesterday', 'last week'],
      'yet',
      'Yet часто стоит в конце отрицаний в Present Perfect.',
    ),
  ],
);
