import { unit } from '../course-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: question-words. Порядок курса задан в course-a1.ts. */
export const questionWordsLesson = unit(
  'question-words',
  'Вопросительные слова',
  'A1',
  '❔',
  'Спроси кто, где, когда, почему и как.',
  'who · what · where · when · why · how',
  [
    'Who — кто; what — что/какой; where — где/куда.',
    'When — когда; why — почему; how — как.',
    'С be: вопросительное слово → be → кто: Where are you?',
    'С обычным глаголом: слово → do/does → кто → глагол: What do you like?',
  ],
  [
    'Who is your teacher? — Кто твой учитель?',
    'Where do you live? — Где ты живёшь?',
    'When is your birthday? — Когда твой день рождения?',
    'Why are you sad? — Почему ты грустишь?',
    'How do you get to school? — Как ты добираешься до школы?',
    'What do you need? — Что тебе нужно?',
  ],
  [
    'How old — сколько лет; how many — сколько штук. Не переводи каждое слово отдельно.',
    'Where — где; when — когда. Проверяй смысл ожидаемого ответа.',
    'Если who — тот, кто выполняет действие, возможен вопрос без do: Who lives here?',
  ],
  [
    choice('Спросить о месте: ___', ['where', 'when', 'why'], 'where', 'Where спрашивает о месте.'),
    gap('___ old are you?', 'how', 'How old — сколько лет.'),
    choice(
      'Ответ: At seven. Какое начало вопроса подходит?',
      ['When', 'Who', 'Why'],
      'When',
      'В ответе названо время.',
    ),
    gap('___ are you sad? — Because I lost my toy.', 'why', 'Because объясняет причину: вопрос why.'),
    choice(
      'Выбери правильный вопрос.',
      ['Where do you live?', 'Where you do live?', 'Where does you live?'],
      'Where do you live?',
      'Where + do + you + live.',
    ),
  ],
);
