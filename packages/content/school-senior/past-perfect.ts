import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: past-perfect. Порядок курса задан в school-senior.ts. */
export const pastPerfectLesson = schoolUnit(
  'past-perfect',
  'Past Perfect: что произошло раньше',
  'B1',
  [7, 8, 9, 10, 11],
  'tenses',
  '⏮',
  'Покажи более раннее событие в прошлом.',
  'had + третья форма → раньше другого момента прошлого',
  [
    'Past Perfect связывает событие с более поздним моментом прошлого.',
    'Форма одинакова для всех лиц: had + третья форма.',
    'Отрицание: had not / hadn’t; вопрос: Had you finished?',
    'Не нужно заменять им весь рассказ. Если порядок ясен из контекста, нередко достаточно Past Simple.',
  ],
  [
    'When I arrived, the film had started. — Когда я пришёл, фильм уже начался.',
    'She had left before I called. — Она ушла до моего звонка.',
    'We hadn’t met before that day. — До того дня мы не встречались.',
    'Had you eaten before the trip? — Ты поел до поездки?',
    'He was sad because he had lost his ticket. — Он грустил, потому что потерял билет.',
    'By midnight, they had finished the work. — К полуночи они закончили работу.',
  ],
  [
    '❌ had went → ✅ had gone.',
    'Have finished связано с настоящим; had finished — с моментом прошлого.',
    'Не употребляй had + вторую форму вместо третьей.',
  ],
  [
    gap('She had ___ before I arrived. (leave)', 'left', 'Leave–left–left; после had третья форма.'),
    gap('They ___ finished by midnight. (had/have)', 'had', 'Ориентир в прошлом — had.'),
    choice(
      'Более раннее событие:',
      [
        'The train had left when I arrived.',
        'The train has leave when I arrived.',
        'The train had leaving when I arrived.',
      ],
      'The train had left when I arrived.',
      'Поезд ушёл до приезда.',
    ),
    gap('Had you ___ the book before the lesson? (read; форма)', 'read', 'Третья форма read пишется так же.'),
    choice(
      'Отрицание:',
      ['hadn’t seen', 'didn’t had seen', 'hadn’t saw'],
      'hadn’t seen',
      'Hadn’t + третья форма seen.',
    ),
  ],
);
