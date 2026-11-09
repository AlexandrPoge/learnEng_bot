import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: comparing-photos. Порядок курса задан в school-senior.ts. */
export const comparingPhotosLesson = schoolUnit(
  'comparing-photos',
  'Сравниваем две фотографии',
  'B2',
  [9, 10, 11],
  'sentences',
  '🖼',
  'Построй связное сравнение с осторожными предположениями.',
  'общее → различия → предположение → вывод',
  [
    'Сначала назови, что объединяет две сцены, затем сопоставляй их по одному признаку.',
    'Both pictures show ... — обе фотографии показывают; whereas / while — противопоставление.',
    'Для догадок используй might, seem, appear; не выдавай их за факт.',
    'Заверши ответ на поставленный вопрос. Здесь проверяются фразы и структура, а не голос или содержимое загруженных фото.',
  ],
  [
    'Both pictures show people outdoors. — На обеих фотографиях люди на улице.',
    'In the first picture, the people are working. — На первой фотографии люди работают.',
    'In the second, they seem to be relaxing. — На второй они, кажется, отдыхают.',
    'One scene is crowded, whereas the other is quiet. — В одной сцене многолюдно, а в другой тихо.',
    'They might be waiting for a bus. — Возможно, они ждут автобус.',
    'Overall, the second place looks calmer. — В целом второе место выглядит спокойнее.',
  ],
  [
    'Не перечисляй два несвязанных описания вместо сравнения.',
    'Не называй догадку фактом: might be вместо точно знаю без оснований.',
    'Помни о вопросе задания, а не только о деталях сцены.',
  ],
  [
    gap('___ pictures show a park. (оба; both)', 'both', 'Both — обе.'),
    choice(
      'Противопоставление:',
      ['whereas', 'because в значении контраста', 'therefore в значении контраста'],
      'whereas',
      'Whereas сравнивает различие.',
    ),
    gap('They seem ___ be relaxed.', 'to', 'Seem to be.'),
    choice(
      'Осторожная догадка:',
      [
        'They might be tourists.',
        'They are definitely tourists без оснований.',
        'I know their passports без оснований.',
      ],
      'They might be tourists.',
      'Might обозначает предположение.',
    ),
    choice(
      'Хороший план:',
      ['Общее → различия → вывод', 'Только список цветов', 'Придуманные имена → биографии'],
      'Общее → различия → вывод',
      'Сравнение должно связывать обе сцены.',
    ),
  ],
  'situations',
);
