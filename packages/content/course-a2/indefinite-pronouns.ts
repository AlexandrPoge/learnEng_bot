import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: indefinite-pronouns. Порядок курса задан в course-a2.ts. */
export const indefinitePronounsLesson = unit(
  'indefinite-pronouns',
  'Someone / anyone / nothing',
  'A2',
  '🔍',
  'Скажи «кто-то», «что-нибудь» или «ничего».',
  'someone — кто-то · anything — что-нибудь · nothing — ничего',
  [
    'Some-/any-/no- сочетаются с -one/-body для людей и -thing для вещей.',
    'Someone/something часто в утверждениях, anyone/anything — в вопросах и отрицаниях.',
    'Nothing/nobody уже отрицательные: I know nothing.',
    'С такими словами обычно единственное число: someone is here.',
  ],
  [
    'Someone is at the door. — Кто-то у двери.',
    'I need something to write with. — Мне нужно что-то, чем писать.',
    'Is anyone here? — Здесь кто-нибудь есть?',
    'I don’t know anything. — Я ничего не знаю.',
    'Nobody is late. — Никто не опоздал.',
    'Everything is ready. — Всё готово.',
  ],
  [
    '❌ Nobody are → ✅ Nobody is.',
    '❌ I don’t know nothing в стандартном учебном английском → ✅ I don’t know anything.',
    'Some- бывает и в предложениях: Would you like something to drink?',
  ],
  [
    gap('___ is at the door. (кто-то; someone)', 'someone', 'Someone — кто-то.'),
    choice(
      'I don’t know ___.',
      ['anything', 'nothing', 'nobody'],
      'anything',
      'После don’t в этом значении — anything.',
    ),
    gap('Everything ___ ready.', 'is', 'Everything обычно с is.'),
    choice('Никто:', ['nobody', 'something', 'anywhere'], 'nobody', 'Nobody — никто.'),
    gap('Is ___ here? (кто-нибудь; anyone)', 'anyone', 'Anyone подходит в обычном вопросе.'),
  ],
);
