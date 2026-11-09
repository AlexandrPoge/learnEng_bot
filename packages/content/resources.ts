import { kids, article } from './resources/providers.js';
import type { Lesson, Resource } from '../domain/types.js';

export { topicResources } from './resources/topics.js';
export function courseResources(lesson: Lesson): Resource[] {
  const grammarPages: Record<string, string> = {
    'this-that': 'this-that-these-those',
    'possessive-s': 'possessives',
    frequency: 'adverbs-frequency',
    imperatives: 'imperatives',
    'countable-nouns': 'nouns-countable-uncountable',
    'simple-or-continuous': 'present-simple-present-continuous',
    'was-were': 'past-simple-verb-be',
    'too-enough': 'too-big-too-small',
  };
  const vocabularyPages: Record<string, string> = {
    home: 'room',
    animals: 'animals',
    clothes: 'clothes',
    colours: 'colours',
    food: 'food',
    town: 'around-town',
  };
  if (grammarPages[lesson.id])
    return [
      article(
        lesson.title,
        `${kids}grammar-practice/${grammarPages[lesson.id]}`,
        'Дополнительная тренировка связанного грамматического материала на английском.',
      ),
    ];
  if (vocabularyPages[lesson.id])
    return [
      article(
        lesson.title,
        `https://learnenglishteens.britishcouncil.org/vocabulary/a1-a2-vocabulary/${vocabularyPages[lesson.id]}`,
      ),
    ];
  const vocabulary = ['vocabulary', 'situations'].includes(lesson.category);
  return [
    article(
      vocabulary ? 'Каталог слов A1–A2' : 'Каталог грамматики для начинающих',
      vocabulary
        ? 'https://learnenglishteens.britishcouncil.org/vocabulary/a1-a2-vocabulary'
        : `${kids}grammar-practice`,
      'Это общий каталог дополнительных материалов, а не отдельное объяснение всей этой темы. Основной урок находится в боте.',
    ),
  ];
}
