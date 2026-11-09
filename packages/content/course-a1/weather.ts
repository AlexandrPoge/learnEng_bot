import { wordUnit } from '../course-builder.js';

/** Учебная тема: weather. Порядок курса задан в course-a1.ts. */
export const weatherLesson = wordUnit(
  'weather',
  'Погода и времена года',
  'A1',
  '🌦',
  'Расскажи о погоде и выбери одежду.',
  [
    ['sunny', 'солнечный', 'It is sunny today.', 'Сегодня солнечно.'],
    ['rainy', 'дождливый', 'It is a rainy day.', 'Сегодня дождливый день.'],
    ['windy', 'ветреный', 'It is windy outside.', 'На улице ветрено.'],
    ['cold', 'холодный', 'It is cold in winter.', 'Зимой холодно.'],
    ['warm', 'тёплый', 'It is warm today.', 'Сегодня тепло.'],
    ['snow', 'снег', 'There is snow in the garden.', 'В саду лежит снег.'],
  ],
  ['Для погоды используем it: It is sunny. It здесь не переводим отдельным русским словом.'],
);
