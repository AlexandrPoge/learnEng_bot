import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: relative-clauses. Порядок курса задан в school-senior.ts. */
export const relativeClausesLesson = schoolUnit(
  'relative-clauses',
  'Who / which / that: уточняем, о ком речь',
  'B1',
  [7, 8, 9, 10],
  'sentences',
  '🔗',
  'Соедини описание человека или предмета с предложением.',
  'человек → who · предмет → which / that',
  [
    'Определительное придаточное помогает понять, о каком человеке или предмете речь.',
    'Who обычно относится к людям, which — к вещам и животным.',
    'That может заменять who/which в определительных придаточных без запятых.',
    'Если относительное слово — подлежащее, не добавляй ещё he/she/it. When/where также помогают уточнить время и место.',
  ],
  [
    'The girl who lives next door is kind. — Девочка, которая живёт рядом, добрая.',
    'This is the bag that I bought. — Это сумка, которую я купил.',
    'A key is something which opens a lock. — Ключ — вещь, которая открывает замок.',
    'The person who called is my uncle. — Человек, который звонил, — мой дядя.',
    'This is the café where we met. — Это кафе, где мы встретились.',
    'The book I borrowed is interesting. — Книга, которую я взял, интересная; слово-дополнение можно опустить.',
  ],
  [
    '❌ the girl who she lives → ✅ the girl who lives.',
    'Относительное слово-подлежащее опустить нельзя: a key which opens ...',
    'That не используется в придаточном с дополнительной информацией после запятой.',
  ],
  [
    gap('The boy ___ lives here is my friend. (who/where)', 'who', 'О человеке — who.'),
    choice(
      'Правильно:',
      [
        'The girl who called is Anna.',
        'The girl who she called is Anna в смысле «девочка позвонила».',
        'The girl which she is Anna.',
      ],
      'The girl who called is Anna.',
      'Who уже подлежащее called.',
    ),
    gap('The shop ___ we met. (where/who)', 'where', 'Место — where.'),
    choice(
      'Где можно опустить that?',
      ['The book that I bought', 'The book that fell', 'The person that called'],
      'The book that I bought',
      'That — дополнение: I bought the book.',
    ),
    gap('A tool ___ opens this box. (which/where)', 'which', 'Относительное слово — подлежащее для вещи.'),
  ],
);
