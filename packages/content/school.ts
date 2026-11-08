import type { Lesson } from '../domain/types.js';

// Авторские подборки из текущей библиотеки. Это не программа конкретной школы
// и не соответствие «класс = CEFR». Одна тема может повторяться в разных классах.
export interface SchoolYear { grade: number; focus: string; revision: boolean; lessonIds: string[] }
const year = (grade: number, focus: string, ids: string, revision = false): SchoolYear => ({ grade, focus, revision, lessonIds: ids.split(' ') });
export const schoolYears: SchoolYear[] = [
  year(1, 'Знакомимся с английским', 'alphabet greetings numbers colours animals family'),
  year(2, 'Первые слова и предложения', 'alphabet greetings numbers to-be pronouns articles plurals this-that can colours animals family school'),
  year(3, 'Рассказываем о себе и своём дне', 'have-got possessive-s present-simple question-words word-order telling-time days-week daily-routine home food hobbies prepositions-place'),
  year(4, 'Настоящее, прошлое и простые планы', 'present-continuous simple-or-continuous frequency prepositions-time imperatives there-is was-were past-simple irregular-verbs future-forms weather months-seasons clothes body-parts feelings'),
  year(5, 'Закрепляем основу и расширяем речь', 'to-be pronouns articles countable-nouns quantifiers present-simple present-continuous simple-or-continuous comparisons connectors school appearance jobs hobbies town directions shopping'),
  year(6, 'Сравниваем, объясняем и рассказываем', 'past-simple irregular-verbs past-continuous future-forms present-perfect for-since adverbs-manner as-as too-enough indefinite-pronouns modals transport travel health'),
  year(7, 'Соединяем времена и строим сложные фразы', 'present-perfect for-since past-continuous gerund-infinitive zero-conditional first-conditional reflexive-pronouns connectors modals polite-requests technology travel'),
  year(8, 'Повторяем времена и условия', 'simple-or-continuous past-simple past-continuous present-perfect for-since future-forms zero-conditional first-conditional modals technology', true),
  year(9, 'Повторяем грамматику и бытовое общение', 'present-perfect gerund-infinitive indefinite-pronouns reflexive-pronouns quantifiers too-enough first-conditional polite-requests shopping health', true),
  year(10, 'Восстанавливаем основу перед сложными темами', 'word-order question-words articles countable-nouns connectors comparisons as-as present-perfect first-conditional jobs travel', true),
  year(11, 'Проверяем и повторяем базу', 'simple-or-continuous past-simple past-continuous future-forms present-perfect for-since modals gerund-infinitive first-conditional polite-requests technology', true),
];

export function schoolLessons(grade: number, lessons: Lesson[]) {
  const route = schoolYears.find(y => y.grade === grade);
  if (!route) return [];
  const order = new Map(route.lessonIds.map((id, i) => [id, i]));
  return lessons.filter(l => l.schoolGrades ? l.schoolGrades.includes(grade) : order.has(l.id))
    .sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999));
}
