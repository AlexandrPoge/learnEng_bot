import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: present-perfect-continuous. Порядок курса задан в school-senior.ts. */
export const presentPerfectContinuousLesson = schoolUnit(
  'present-perfect-continuous',
  'Present Perfect Continuous: как долго это длится',
  'B1',
  [8, 9, 10, 11],
  'tenses',
  '⏳',
  'Подчеркни длительность действия до настоящего.',
  'have / has been + глагол-ing',
  [
    'Форма связывает процесс в прошлом с настоящим: действие ещё идёт или недавно закончилось с заметным результатом.',
    'С I/you/we/they — have been; с he/she/it — has been.',
    'For называет длительность, since — начальный момент.',
    'Для состояния know обычно нужен Present Perfect Simple. Результат в штуках часто тоже подчёркивает Simple.',
  ],
  [
    'I have been reading for an hour. — Я читаю уже час.',
    'She has been learning French since May. — Она учит французский с мая.',
    'It has been raining. The ground is wet. — Шёл дождь; земля мокрая.',
    'Have you been waiting long? — Ты давно ждёшь?',
    'We haven’t been sleeping well. — Мы плохо спим в последнее время.',
    'I have known him for years. — Я знаю его много лет; know — состояние.',
  ],
  [
    '❌ has been learn → ✅ has been learning.',
    '❌ have been knowing → ✅ have known в обычном значении know.',
    'Не теряй been между have/has и -ing.',
  ],
  [
    gap('She has ___ studying.', 'been', 'Has been + -ing.'),
    gap('I have been ___ for an hour. (wait)', 'waiting', 'Процесс — waiting.'),
    choice(
      'С 2020 года:',
      ['since 2020', 'for 2020', 'during since'],
      'since 2020',
      'Начальная точка — since.',
    ),
    choice(
      'Знаю его много лет:',
      ['I have known him for years.', 'I have been knowing him for years.', 'I am know him for years.'],
      'I have known him for years.',
      'Know обычно не Continuous.',
    ),
    gap('He ___ been working. (have/has)', 'has', 'He → has been.'),
  ],
);
