import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: passive. Порядок курса задан в school-senior.ts. */
export const passiveLesson = schoolUnit(
  'passive',
  'Passive Voice: что сделано с предметом',
  'B1',
  [7, 8, 9, 10, 11],
  'verbs',
  '🏗',
  'Перенеси внимание с исполнителя на действие и объект.',
  'be в нужном времени + третья форма',
  [
    'В пассиве подлежащее испытывает действие: The window was cleaned.',
    'Время показывает форма be; смысловой глагол остаётся в третьей форме.',
    'Present Simple: is/are made; Past Simple: was/were made.',
    'Исполнитель при необходимости вводится by. Его можно не называть, если он неизвестен или неважен.',
  ],
  [
    'The room is cleaned every day. — Комнату убирают каждый день.',
    'These toys are made of wood. — Эти игрушки сделаны из дерева.',
    'The bridge was built in 2010. — Мост построили в 2010 году.',
    'The letters were sent yesterday. — Письма отправили вчера.',
    'The picture was painted by my aunt. — Картину написала моя тётя.',
    'Is this book sold here? — Эту книгу здесь продают?',
  ],
  [
    '❌ was build → ✅ was built.',
    'Не забывай be: The room is cleaned.',
    'By вводит исполнителя, а не заменяет все остальные предлоги.',
  ],
  [
    gap('The bridge was ___. (build)', 'built', 'Build–built–built.'),
    gap('The rooms ___ cleaned every day. (be)', 'are', 'Rooms во множественном числе, настоящее → are.'),
    choice(
      'Пассив в прошлом:',
      ['The letter was sent.', 'The letter was send.', 'The letter sented.'],
      'The letter was sent.',
      'Was + третья форма sent.',
    ),
    gap('Painted ___ Anna. (by/from)', 'by', 'Исполнитель — by.'),
    choice(
      'Что показывает время в пассиве?',
      ['Форма be', 'Артикль перед предметом', 'Всегда окончание -s'],
      'Форма be',
      'Is made / was made различаются формой be.',
    ),
  ],
);
