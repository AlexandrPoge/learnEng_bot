import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: geography-articles. Порядок курса задан в school-junior.ts. */
export const geographyArticlesLesson = schoolUnit(
  'geography-articles',
  'The с географическими названиями',
  'A2',
  [6, 7, 8],
  'nouns',
  '🗺',
  'Различай названия стран, рек и гор.',
  'France · the UK · the Nile · Mount Fuji',
  [
    'Большинство отдельных стран и городов употребляется без the: France, Minsk.',
    'У ряда названий есть the: the UK, the USA, the Netherlands.',
    'Реки, моря, океаны и горные цепи обычно требуют the.',
    'Отдельные вершины с Mount и озёра с Lake обычно без the: Mount Fuji, Lake Baikal.',
  ],
  [
    'Paris is in France. — Париж находится во Франции.',
    'She lives in the UK. — Она живёт в Великобритании.',
    'The Nile is a long river. — Нил — длинная река.',
    'The Alps are in Europe. — Альпы находятся в Европе.',
    'Mount Fuji is in Japan. — Фудзи находится в Японии.',
    'Lake Baikal is very deep. — Озеро Байкал очень глубокое.',
  ],
  [
    '❌ the France → ✅ France.',
    '❌ Nile без определителя в обычном названии реки → ✅ the Nile.',
    'Сверяй устойчивое название: the Netherlands — особый случай.',
  ],
  [
    gap('Вставь the или —: ___ UK.', 'the', 'Устойчивое название the UK.'),
    choice(
      'Выбери страну.',
      ['France', 'the France', 'a France country'],
      'France',
      'Большинство отдельных стран без the.',
    ),
    gap('Вставь the или —: ___ Nile.', 'the', 'У реки — the.'),
    choice(
      'Выбери вершину.',
      ['Mount Fuji', 'the Mount Fuji', 'a Mount Fuji'],
      'Mount Fuji',
      'Названия с Mount обычно без the.',
    ),
    gap('Вставь the или —: ___ Alps.', 'the', 'Горная цепь — the Alps.'),
  ],
);
