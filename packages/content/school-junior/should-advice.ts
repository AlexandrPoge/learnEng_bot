import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: should-advice. Порядок курса задан в school-junior.ts. */
export const shouldAdviceLesson = schoolUnit(
  'should-advice',
  'Should: даём совет',
  'A2',
  [5, 6, 7],
  'verbs',
  '💬',
  'Посоветуй действие без приказа.',
  'should + глагол · shouldn’t + глагол',
  [
    'Should — совет или мнение о том, что разумно сделать.',
    'После should нужна начальная форма без to.',
    'Shouldn’t — совет чего-то не делать.',
    'В вопросе should стоит перед подлежащим: Should I call?',
  ],
  [
    'You should rest. — Тебе стоит отдохнуть.',
    'She should ask for help. — Ей стоит попросить помощи.',
    'We shouldn’t rush. — Нам не стоит спешить.',
    'Should I call now? — Мне стоит позвонить сейчас?',
    'They should check the address. — Им стоит проверить адрес.',
    'He shouldn’t skip breakfast. — Ему не стоит пропускать завтрак.',
  ],
  [
    '❌ should to rest → ✅ should rest.',
    '❌ she shoulds → ✅ she should.',
    'Совет should мягче строгого правила must.',
  ],
  [
    gap('You should ___. (rest)', 'rest', 'Начальная форма без to.'),
    choice(
      'Выбери совет не спешить.',
      ['You shouldn’t rush.', 'You don’t should rush.', 'You should to not rush.'],
      'You shouldn’t rush.',
      'Shouldn’t — совет не делать.',
    ),
    choice(
      'Выбери вопрос.',
      ['Should I ask?', 'Do I should ask?', 'Should I to ask?'],
      'Should I ask?',
      'Should выходит перед I.',
    ),
    gap('She ___ drink some water. (should/shoulds)', 'should', 'Should не меняется.'),
    choice(
      'Какая фраза звучит как совет?',
      ['You should check it.', 'You checked it yesterday.', 'You are checking it.'],
      'You should check it.',
      'Should выражает рекомендацию.',
    ),
  ],
);
