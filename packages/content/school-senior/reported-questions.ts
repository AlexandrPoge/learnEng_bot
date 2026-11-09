import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: reported-questions. Порядок курса задан в school-senior.ts. */
export const reportedQuestionsLesson = schoolUnit(
  'reported-questions',
  'Косвенные вопросы: без инверсии',
  'B1',
  [8, 9, 10, 11],
  'sentences',
  '❔',
  'Передай вопрос и сохрани порядок слов.',
  'asked where + подлежащее + глагол · asked if ...',
  [
    'В косвенном вопросе порядок как в утверждении: where she lived.',
    'Общий вопрос без вопросительного слова вводится if или whether.',
    'Вспомогательные do/does/did обычно исчезают; смысл и время сохраняются в глаголе.',
    'Местоимения и время меняются с учётом контекста, как в косвенной речи.',
  ],
  [
    '“Where do you live?” → He asked where I lived. — Он спросил, где я живу.',
    '“Are you ready?” → She asked if I was ready. — Она спросила, готов ли я.',
    'He asked whether we could help. — Он спросил, можем ли мы помочь.',
    'She asked what time it was. — Она спросила, который час.',
    'I asked where the station was. — Я спросил, где вокзал.',
    'He asked why I had left early. — Он спросил, почему я ушёл рано.',
  ],
  [
    '❌ asked where did I live → ✅ asked where I lived.',
    'If здесь означает «ли», а не условие «если».',
    'Не оставляй инверсию is she / can he после вводной части.',
  ],
  [
    choice(
      'Правильно:',
      ['He asked where I lived.', 'He asked where did I live.', 'He asked where lived I.'],
      'He asked where I lived.',
      'Прямой порядок I lived.',
    ),
    gap('She asked ___ I was ready. (if/that)', 'if', 'Общий вопрос — if / whether.'),
    gap('He asked what time it ___. (be; прошлое)', 'was', 'What time it was — без инверсии.'),
    choice(
      'Что происходит с did в косвенном вопросе?',
      [
        'Обычно исчезает, время передаёт глагол',
        'Всегда остаётся перед подлежащим',
        'Меняется на does в любом вопросе',
      ],
      'Обычно исчезает, время передаёт глагол',
      'Уже нет прямого вопросительного порядка.',
    ),
    choice(
      'Правильный порядок:',
      ['where the shop was', 'where was the shop', 'where did was shop'],
      'where the shop was',
      'Подлежащее the shop перед was.',
    ),
  ],
);
