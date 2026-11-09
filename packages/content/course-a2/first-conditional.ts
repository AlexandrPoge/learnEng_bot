import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: first-conditional. Порядок курса задан в course-a2.ts. */
export const firstConditionalLesson = unit(
  'first-conditional',
  'Если в будущем: first conditional',
  'A2',
  '☔',
  'Расскажи о реальной будущей возможности.',
  'if + Present Simple → will + глагол',
  [
    'First conditional — возможное условие и будущий результат.',
    'После if в базовой схеме используем Present Simple.',
    'В части результата часто will + начальная форма.',
    'Порядок частей можно поменять: I’ll call if I arrive early.',
  ],
  [
    'If it rains, we will stay home. — Если пойдёт дождь, останемся дома.',
    'If I finish early, I will help you. — Если закончу рано, помогу.',
    'She will come if she has time. — Она придёт, если будет время.',
    'If we hurry, we won’t be late. — Если поторопимся, не опоздаем.',
    'Will you call if you need help? — Позвонишь, если нужна будет помощь?',
    'If he studies, he will learn more. — Если он будет заниматься, узнает больше.',
  ],
  [
    'В базовой схеме ❌ if it will rain → ✅ if it rains.',
    'Не добавляй to после will.',
    'Это не обещание, что условие точно выполнится.',
  ],
  [
    choice(
      'If it ___, we will stay inside.',
      ['rains', 'will rain', 'raining'],
      'rains',
      'После if в базовой схеме Present Simple.',
    ),
    gap('If I finish, I ___ help. (will/was)', 'will', 'Результат в будущем: will help.'),
    choice(
      'She will ___ if she has time.',
      ['come', 'comes', 'to come'],
      'come',
      'После will начальная форма без to.',
    ),
    gap('If he ___, he will learn. (study)', 'studies', 'He → studies в Present Simple.'),
    choice(
      'Выбери first conditional.',
      ['If we hurry, we will catch the bus.', 'If we will hurry, we caught.', 'If hurry we, will caught.'],
      'If we hurry, we will catch the bus.',
      'Условие Present Simple, результат will.',
    ),
  ],
);
