import { lesson, choice, gap } from '../lesson-builder.js';

/** Учебная тема: can. Порядок курса задан в a1.ts. */
export const canLesson = lesson(
  'can',
  'Can / can’t: умения и разрешение',
  'A1',
  [
    'Can + начальная форма глагола: умение, возможность или разрешение.',
    'Форма одна для всех: I can, she can. Вопрос: Can you ...? Отрицание: cannot / can’t.',
  ],
  ['She can swim. — Она умеет плавать.', 'Can I open the window? — Можно открыть окно?'],
  ['После can не ставим to и не добавляем -s.', 'Вопрос с can не требует do / does.'],
  [
    choice('She can ___ well.', ['swims', 'to swim', 'swim'], 'swim', 'После can — начальная форма без to.'),
    gap(
      'Впиши can или does: ___ he play the guitar? — Yes, he can.',
      'can',
      'Краткий ответ he can соответствует вопросу Can he ...?',
    ),
    choice(
      'Выбери отрицание.',
      ['He doesn’t can drive.', 'He can’t drive.', 'He can’t drives.'],
      'He can’t drive.',
      'Can’t + начальная форма.',
    ),
    gap('Напиши полную форму can’t одним словом: ___', 'cannot', 'Полная форма: cannot.'),
    choice(
      'Попроси разрешение открыть дверь.',
      ['Can I open the door?', 'Do I can open the door?', 'Can I to open the door?'],
      'Can I open the door?',
      'Для разрешения: Can I + глагол?',
    ),
  ],
);
