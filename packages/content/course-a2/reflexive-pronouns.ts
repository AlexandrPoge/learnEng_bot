import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: reflexive-pronouns. Порядок курса задан в course-a2.ts. */
export const reflexivePronounsLesson = unit(
  'reflexive-pronouns',
  'Myself / yourself / ourselves',
  'A2',
  '🪞',
  'Скажи «сам» и «себя».',
  'I → myself · you → yourself · we → ourselves',
  [
    'Возвратное местоимение показывает, что действие направлено на того же человека.',
    'Формы: myself, yourself, himself, herself, itself, ourselves, yourselves, themselves.',
    'By myself — один/самостоятельно.',
    'Enjoy yourself — хорошо провести время. Но после feel обычно не добавляем myself для состояния.',
  ],
  [
    'I made it myself. — Я сделал это сам.',
    'She looked at herself. — Она посмотрела на себя.',
    'We cooked dinner ourselves. — Мы сами приготовили ужин.',
    'He lives by himself. — Он живёт один.',
    'Enjoy yourselves! — Хорошо проведите время!',
    'I feel happy. — Я чувствую себя счастливым. Здесь без myself.',
  ],
  [
    '❌ I feel myself happy → ✅ I feel happy.',
    'Yourself — одному человеку; yourselves — нескольким.',
    'Не заменяй me на myself везде: She called me — она позвонила мне.',
  ],
  [
    gap('I did it ___. (сам)', 'myself', 'I → myself.'),
    choice('We did it ___.', ['ourselves', 'myself', 'ourself'], 'ourselves', 'We → ourselves.'),
    gap('She looked at ___. (себя)', 'herself', 'She → herself.'),
    choice(
      'Выбери обычную фразу про состояние.',
      ['I feel tired.', 'I feel myself tired.', 'I tired myself feel.'],
      'I feel tired.',
      'В этом значении feel без myself.',
    ),
    gap('He lives by ___. (сам)', 'himself', 'He → himself; by himself — один.'),
  ],
);
