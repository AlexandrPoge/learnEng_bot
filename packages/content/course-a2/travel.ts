import { wordUnit } from '../course-builder.js';

/** Учебная тема: travel. Порядок курса задан в course-a2.ts. */
export const travelLesson = wordUnit(
  'travel',
  'Поездка и отель',
  'A2',
  '🧳',
  'Пойми бронирование и простые вопросы в поездке.',
  [
    ['booking', 'бронирование', 'I have a booking.', 'У меня есть бронирование.', ['booking', 'reservation']],
    ['passport', 'паспорт', 'Here is my passport.', 'Вот мой паспорт.'],
    ['luggage', 'багаж', 'Where is my luggage?', 'Где мой багаж?', ['luggage', 'baggage']],
    ['room', 'комната', 'Our room is on the first floor.', 'Наша комната на первом этаже.'],
    ['key', 'ключ', 'Can I have the key?', 'Можно ключ?'],
    ['reception', 'стойка регистрации', 'Ask at reception.', 'Спроси на стойке регистрации.'],
  ],
  [
    'Luggage обычно неисчисляемое. В разных странах first floor может обозначать разные этажи: уточняй номер.',
  ],
  'situations',
);
