import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: verb-pattern-meaning. Порядок курса задан в school-senior.ts. */
export const verbPatternMeaningLesson = schoolUnit(
  'verb-pattern-meaning',
  'Stop / remember / try: -ing или to меняет смысл',
  'B2',
  [9, 10, 11],
  'verbs',
  '🔀',
  'Пойми, какое действие остановилось и что нужно помнить.',
  'stop doing ≠ stop to do · remember doing ≠ remember to do',
  [
    'Stop doing — прекратить само действие; stop to do — остановить другое действие ради новой цели.',
    'Remember doing — помнить о произошедшем; remember to do — не забыть выполнить действие.',
    'Try doing — попробовать способ; try to do — постараться выполнить действие.',
    'Сначала представь последовательность событий, затем выбирай форму.',
  ],
  [
    'He stopped talking. — Он перестал разговаривать.',
    'He stopped to talk to me. — Он остановился, чтобы поговорить со мной.',
    'I remember locking the door. — Я помню, как запер дверь.',
    'Remember to lock the door. — Не забудь запереть дверь.',
    'Try restarting the phone. — Попробуй перезапуск как способ решения.',
    'I tried to lift the box. — Я попытался поднять коробку.',
  ],
  [
    'Формы нельзя менять местами без изменения смысла.',
    'Remember doing не означает просьбу сделать это в будущем.',
    'Stop to smoke — остановиться ради курения; stop smoking — бросить / прекратить курить.',
  ],
  [
    choice(
      'Он перестал говорить:',
      ['He stopped talking.', 'He stopped to talk.', 'He stopped talk.'],
      'He stopped talking.',
      'Остановилось само talking.',
    ),
    gap(
      'Remember ___ close the window: не забудь закрыть. (to/—)',
      'to',
      'Remember to do — помнить о необходимости.',
    ),
    choice(
      'Я помню, как отправил письмо:',
      [
        'I remember sending the letter.',
        'I remember to send the letter как память о прошлом.',
        'I remember sent the letter.',
      ],
      'I remember sending the letter.',
      'Воспоминание о действии — -ing.',
    ),
    gap('Try ___ the router: попробуй этот способ. (restart)', 'restarting', 'Способ решения — try doing.'),
    choice(
      'Остановился, чтобы отдохнуть:',
      ['stopped to rest', 'stopped resting', 'stopped rested'],
      'stopped to rest',
      'Остановили другое действие ради отдыха.',
    ),
  ],
);
