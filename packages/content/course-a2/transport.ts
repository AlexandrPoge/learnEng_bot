import { wordUnit } from '../course-builder.js';

/** Учебная тема: transport. Порядок курса задан в course-a2.ts. */
export const transportLesson = wordUnit(
  'transport',
  'Транспорт и билеты',
  'A2',
  '🚌',
  'Выбери транспорт и спроси о билете.',
  [
    ['bus', 'автобус', 'I go by bus.', 'Я езжу на автобусе.'],
    ['train', 'поезд', 'The train leaves at five.', 'Поезд отправляется в пять.'],
    ['ticket', 'билет', 'A ticket to London, please.', 'Билет в Лондон, пожалуйста.'],
    ['platform', 'платформа', 'The train is on platform two.', 'Поезд на второй платформе.'],
    ['airport', 'аэропорт', 'We are at the airport.', 'Мы в аэропорту.'],
    ['journey', 'поездка', 'The journey took an hour.', 'Поездка заняла час.'],
  ],
  ['By bus/train, но on foot — пешком.'],
);
