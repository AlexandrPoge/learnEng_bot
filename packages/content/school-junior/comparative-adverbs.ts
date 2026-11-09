import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: comparative-adverbs. Порядок курса задан в school-junior.ts. */
export const comparativeAdverbsLesson = schoolUnit(
  'comparative-adverbs',
  'Сравниваем действия: faster, more carefully',
  'A2',
  [6, 7, 8],
  'modifiers',
  '🏃',
  'Скажи, кто делает что-то быстрее или осторожнее.',
  'fast → faster · carefully → more carefully · well → better',
  [
    'Наречие может сравнивать действия: runs faster.',
    'У многих коротких наречий сравнительная форма с -er: hard → harder.',
    'С наречиями на -ly обычно more: more slowly.',
    'Есть особые формы: well → better, badly → worse. После сравнения часто стоит than.',
  ],
  [
    'A rabbit runs faster than a snail. — Кролик бегает быстрее улитки.',
    'Please speak more slowly. — Пожалуйста, говори медленнее.',
    'She draws better now. — Сейчас она рисует лучше.',
    'He works harder this week. — На этой неделе он работает усерднее.',
    'Read more carefully. — Читай внимательнее.',
    'I slept worse last night. — Прошлой ночью я спал хуже.',
  ],
  [
    '❌ more faster → ✅ faster.',
    '❌ carefulier → ✅ more carefully.',
    'Сравниваешь действие — проверь, что нужна форма наречия, а не прилагательного.',
  ],
  [
    gap('Fast → ___', 'faster', 'Короткая форма с -er.'),
    choice(
      'Более внимательно:',
      ['more carefully', 'carefullier', 'more carefuler'],
      'more carefully',
      'Для carefully используем more.',
    ),
    gap('Well → ___', 'better', 'Особая форма better.'),
    gap('He runs faster ___ me.', 'than', 'Сравнение с другим — than.'),
    choice(
      'Плохо → хуже (о действии):',
      ['badly → worse', 'badly → badlier', 'badly → more worser'],
      'badly → worse',
      'Особая сравнительная форма worse.',
    ),
  ],
);
