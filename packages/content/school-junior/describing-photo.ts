import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: describing-photo. Порядок курса задан в school-junior.ts. */
export const describingPhotoLesson = schoolUnit(
  'describing-photo',
  'Описываем фотографию по плану',
  'A2',
  [5, 6, 7, 8],
  'sentences',
  '📷',
  'Собери описание сцены без догадок за факт.',
  'место → люди → действия → детали → впечатление',
  [
    'Начни с того, что видно: In the photo, I can see ...',
    'Действие на фото часто описывают Present Continuous.',
    'Для расположения используй in the foreground / in the background.',
    'Если не уверен, скажи perhaps или seems. Тест проверяет фразы; распознавания фото и оценки речи здесь нет.',
  ],
  [
    'In the photo, I can see a park. — На фото я вижу парк.',
    'Two children are playing. — Двое детей играют.',
    'A dog is in the foreground. — На переднем плане собака.',
    'There are trees in the background. — На заднем плане деревья.',
    'Perhaps it is summer. — Возможно, сейчас лето.',
    'The scene looks peaceful. — Сцена выглядит спокойной.',
  ],
  [
    'Не придумывай имена и биографию людей как известные факты.',
    '❌ They playing → ✅ They are playing.',
    'On the photo часто заменяем стандартным in the photo.',
  ],
  [
    gap('___ the photo, I can see a house.', 'in', 'Стандартная фраза in the photo.'),
    gap('Two children ___ running.', 'are', 'Children во множественном числе → are.'),
    choice(
      'Передний план:',
      ['in the foreground', 'in the background', 'in the yesterday'],
      'in the foreground',
      'Foreground — передний план.',
    ),
    choice(
      'Как отметить догадку?',
      ['Perhaps it is summer.', 'It is definitely July без оснований.', 'I know their names без оснований.'],
      'Perhaps it is summer.',
      'Perhaps отделяет предположение от наблюдения.',
    ),
    gap('A girl is ___. (read)', 'reading', 'Процесс на фото — is reading.'),
  ],
  'situations',
);
