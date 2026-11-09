import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: movement-prepositions. Порядок курса задан в school-junior.ts. */
export const movementPrepositionsLesson = schoolUnit(
  'movement-prepositions',
  'Предлоги движения: into, out of, across',
  'A2',
  [4, 5, 6],
  'sentences',
  '➡️',
  'Опиши путь предмета или человека.',
  'into — внутрь · out of — из · across — через',
  [
    'To показывает направление к месту; into — движение внутрь.',
    'Out of — движение изнутри наружу.',
    'Across — с одной стороны на другую; through — сквозь пространство.',
    'Along — вдоль; past — мимо. Представь путь прежде, чем выбрать слово.',
  ],
  [
    'She walked into the room. — Она вошла в комнату.',
    'He came out of the shop. — Он вышел из магазина.',
    'We walked across the bridge. — Мы перешли мост.',
    'The train went through the tunnel. — Поезд проехал через туннель.',
    'They walked along the river. — Они шли вдоль реки.',
    'Walk past the library. — Пройди мимо библиотеки.',
  ],
  [
    'In описывает положение; into подчёркивает перемещение внутрь.',
    'Out of — два слова; не теряй of.',
    'Across и through выбирай по пути: через поверхность или сквозь пространство.',
  ],
  [
    gap('Walk ___ the room: войди внутрь. (into/along)', 'into', 'Движение внутрь — into.'),
    gap('Come out ___ the house.', 'of', 'Сочетание out of.'),
    choice(
      'Сквозь туннель:',
      ['through the tunnel', 'along the tunnel outside', 'past inside tunnel'],
      'through the tunnel',
      'Through — сквозь.',
    ),
    gap('Вдоль реки: ___ the river. (along/across)', 'along', 'Along — вдоль.'),
    choice(
      'Мимо школы:',
      ['past the school', 'into the school', 'out the school of'],
      'past the school',
      'Past — мимо.',
    ),
  ],
);
