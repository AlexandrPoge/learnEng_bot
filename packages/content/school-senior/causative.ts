import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: causative. Порядок курса задан в school-senior.ts. */
export const causativeLesson = schoolUnit(
  'causative',
  'Have something done: услугу делают для нас',
  'B2',
  [9, 10, 11],
  'verbs',
  '🛠',
  'Скажи, что работу выполнил другой человек по твоей просьбе.',
  'have + предмет + третья форма',
  [
    'Конструкция часто означает услугу: I had my bike repaired — велосипед починил мастер.',
    'Время меняет have: have / had / will have.',
    'После предмета нужна третья форма: my hair cut, my car washed.',
    'Сравни: I repaired my bike — починил сам; I had it repaired — организовал починку.',
  ],
  [
    'I had my bike repaired. — Мне починили велосипед.',
    'She has her hair cut here. — Она стрижётся здесь.',
    'We will have the windows cleaned. — Нам помоют окна.',
    'He is having his car washed. — Ему сейчас моют машину.',
    'Did you have your phone fixed? — Тебе починили телефон?',
    'I painted the wall myself. — Я сам покрасил стену; это обычное активное предложение.',
  ],
  [
    '❌ had my bike repair → ✅ had my bike repaired.',
    'Не приписывай выполнение работы владельцу предмета автоматически.',
    'Have something done иногда также описывает неприятное событие; здесь отрабатываем услугу.',
  ],
  [
    gap('I had my bike ___. (repair)', 'repaired', 'После предмета — V3.'),
    choice(
      'Велосипед починил мастер по моей просьбе:',
      ['I had my bike repaired.', 'I repaired my bike myself.', 'I had repair my bike.'],
      'I had my bike repaired.',
      'Это заказанная услуга.',
    ),
    gap('She has her hair ___. (cut; форма)', 'cut', 'Cut–cut–cut.'),
    choice(
      'Где показывается время?',
      ['В have / had / will have', 'Только в артикле', 'Всегда в окончании предмета'],
      'В have / had / will have',
      'Have меняется по времени.',
    ),
    gap('Did you ___ your phone fixed?', 'have', 'После did — have.'),
  ],
);
