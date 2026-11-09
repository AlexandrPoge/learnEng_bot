import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: word-formation. Порядок курса задан в school-senior.ts. */
export const wordFormationLesson = schoolUnit(
  'word-formation',
  'Словообразование: приставка, суффикс, новая роль',
  'B1',
  [7, 8, 9, 10, 11],
  'modifiers',
  '🧩',
  'Распознай, какая часть речи нужна в предложении.',
  'teach → teacher · happy → unhappy · care → careful',
  [
    'Суффикс добавляется в конце и может менять часть речи: teach → teacher.',
    'Приставка стоит в начале: happy → unhappy. У отрицательных приставок есть устойчивые сочетания.',
    'Сложное слово объединяет основы: rain + coat → raincoat.',
    'Контекст важнее механического добавления: сначала определи, нужно существительное, прилагательное или наречие.',
  ],
  [
    'A teacher teaches. — Учитель учит; -er создаёт существительное.',
    'She is unhappy. — Она несчастна; un- меняет значение.',
    'He is careful. — Он осторожен; -ful создаёт прилагательное.',
    'He works carefully. — Он работает осторожно; -ly создаёт наречие.',
    'I need a raincoat. — Мне нужен плащ.',
    'We water the plants. — Мы поливаем растения; water здесь глагол.',
  ],
  [
    'Не добавляй одну и ту же приставку ко всем словам: possible → impossible.',
    'Careful и carefully занимают разные позиции.',
    'Изменение написания нужно запоминать: happy → happiness.',
  ],
  [
    gap('Teach → человек профессии: ___', 'teacher', 'Суффикс -er.'),
    gap('Happy → противоположность из урока: ___', 'unhappy', 'Приставка un-.'),
    choice(
      'He drives ___.',
      ['carefully', 'careful', 'carefulness driver'],
      'carefully',
      'Для действия нужно наречие.',
    ),
    gap('Rain + coat → ___', 'raincoat', 'Сложное слово raincoat.'),
    choice(
      'С чего начать выбор формы слова?',
      ['С роли слова в предложении', 'Всегда добавить -ly', 'Всегда добавить un-'],
      'С роли слова в предложении',
      'Контекст определяет нужную часть речи.',
    ),
  ],
  'vocabulary',
);
