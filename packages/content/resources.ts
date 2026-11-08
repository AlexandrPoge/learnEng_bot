import type { Lesson, Resource } from '../domain/types.js';
const adult = 'https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/';
const kids = 'https://learnenglishkids.britishcouncil.org/grammar-vocabulary/';
const article = (title: string, url: string, note = 'Объяснение и упражнения на английском.'): Resource => ({ title, url, note, kind: 'article', provider: 'British Council', checkedAt: '2026-11-08' });
const video = (title: string, slug: string, note: string): Resource => ({ title, url: `${kids}grammar-videos/${slug}`, note, kind: 'video', provider: 'British Council LearnEnglish Kids', language: 'en', checkedAt: '2026-11-08' });
const simpleVideo = video('The woolly jumper', 'woolly-jumper', 'Сравни, что герой делает обычно и прямо сейчас. Видео на английском.');

export const topicResources: Record<string, Resource[]> = {
  'to-be': [article('To be', `${adult}present-simple-be`)],
  pronouns: [article('Местоимения', `${kids}grammar-practice/pronouns`, 'Личные местоимения: правило и тренировка для детей.')],
  articles: [article('Артикли', `${kids}grammar-practice/articles`)],
  plurals: [article('Множественное число', 'https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/count-nouns')],
  'there-is': [article('There is / there are', `${adult}using-there-there-are`)],
  'have-got': [article('Have got', `${adult}present-simple-have-got`)],
  'present-simple': [article('Present Simple', `${adult}present-simple`), simpleVideo],
  'prepositions-time': [article('Предлоги времени', 'https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2-grammar/prepositions-of-time-at-in-on')],
  'prepositions-place': [article('Предлоги места', `${kids}grammar-practice/prepositions-place`), video("Hero’s adventure", 'heros-adventure', 'Ищи, где находится хомяк: in, on, under и другие предлоги.')],
  'present-continuous': [article('Simple и Continuous', `${kids}grammar-practice/present-simple-present-continuous`), simpleVideo],
  can: [article('Can / can’t', `${kids}grammar-practice/modals-can-cant`)],
  'daily-routine': [article('Повседневные дела', `${kids}word-games/daily-routines`, 'Слова и игра на повседневные действия.')],
  'past-simple': [article('Past Simple в контексте', `${adult}past-continuous-past-simple`, 'Сравнение с Past Continuous: это дополнительный материал.'), video('Gran’s fishing trip', 'grans-fishing-trip', 'Замечай вопросы о прошедших выходных: did + начальная форма.')],
  'past-continuous': [article('Past Continuous / Past Simple', `${adult}past-continuous-past-simple`)],
  'future-forms': [article('Going to: планы', `${kids}grammar-practice/going-to-plans`, 'Материал про going to, не про все будущие формы.'), video('Kitty’s dream job', 'kittys-dream-job', 'Будущие предположения с will. Для сравнения с going to вернись к правилу бота.')],
  'present-perfect': [video('Gran’s adventures', 'grans-adventures', 'Опыт до настоящего момента: have / has + третья форма. На странице есть текст к видео.')],
  comparisons: [article('Сравнительная степень', `${adult}comparative-adjectives`), video('Kitty’s science test', 'kittys-science-test', 'Слушай, как герои сравнивают предметы и выбирают самый большой.')],
  quantifiers: [article('Исчисляемые и неисчисляемые', `${adult}nouns-countable-uncountable`), video('How many sweets?', 'how-many-sweets', 'Посмотри, какие продукты можно посчитать и какие слова количества выбирают герои.')],
  modals: [video('School rules', 'school-rules', 'Правила с must и mustn’t. Should и have to дополнительно объясняются в боте.')],
  'gerund-infinitive': [article('Глагол + -ing / to', `${adult}verbs-followed-ing-or-infinitive`)],
};

export function courseResources(lesson: Lesson): Resource[] {
  const grammarPages: Record<string, string> = {
    'this-that': 'this-that-these-those', 'possessive-s': 'possessives',
    frequency: 'adverbs-frequency', imperatives: 'imperatives', 'countable-nouns': 'nouns-countable-uncountable',
    'simple-or-continuous': 'present-simple-present-continuous', 'was-were': 'past-simple-verb-be',
    'too-enough': 'too-big-too-small',
  };
  const vocabularyPages: Record<string, string> = { home: 'room', animals: 'animals', clothes: 'clothes', colours: 'colours', food: 'food', town: 'around-town' };
  if (grammarPages[lesson.id]) return [article(lesson.title, `${kids}grammar-practice/${grammarPages[lesson.id]}`, 'Дополнительная тренировка связанного грамматического материала на английском.')];
  if (vocabularyPages[lesson.id]) return [article(lesson.title, `https://learnenglishteens.britishcouncil.org/vocabulary/a1-a2-vocabulary/${vocabularyPages[lesson.id]}`)];
  const vocabulary = ['vocabulary', 'situations'].includes(lesson.category);
  return [article(vocabulary ? 'Каталог слов A1–A2' : 'Каталог грамматики для начинающих',
    vocabulary ? 'https://learnenglishteens.britishcouncil.org/vocabulary/a1-a2-vocabulary' : `${kids}grammar-practice`,
    'Это общий каталог дополнительных материалов, а не отдельное объяснение всей этой темы. Основной урок находится в боте.')];
}
