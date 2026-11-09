import type { GrammarStrand, Lesson } from '../domain/types.js';

// Авторские подборки из текущей библиотеки. Это не программа конкретной школы
// и не соответствие «класс = CEFR». Одна тема может повторяться в разных классах.
export interface SchoolYear {
  grade: number;
  focus: string;
  revision: boolean;
  lessonIds: string[];
}
const year = (grade: number, focus: string, ids: string, revision = false): SchoolYear => ({
  grade,
  focus,
  revision,
  lessonIds: ids.split(' '),
});
export const schoolYears: SchoolYear[] = [
  year(1, 'Знакомимся с английским', 'alphabet greetings numbers colours animals family'),
  year(
    2,
    'Первые слова и предложения',
    'alphabet greetings numbers to-be pronouns articles plurals this-that can colours animals family school',
  ),
  year(
    3,
    'Рассказываем о себе и своём дне',
    'have-got possessive-s present-simple question-words word-order telling-time days-week daily-routine home food hobbies prepositions-place',
  ),
  year(
    4,
    'Настоящее, прошлое и простые планы',
    'present-continuous simple-or-continuous frequency prepositions-time imperatives there-is was-were past-simple irregular-verbs future-forms weather months-seasons clothes body-parts feelings',
  ),
  year(
    5,
    'Закрепляем основу и расширяем речь',
    'to-be pronouns articles countable-nouns quantifiers present-simple present-continuous simple-or-continuous comparisons connectors school appearance jobs hobbies town directions shopping',
  ),
  year(
    6,
    'Сравниваем, объясняем и рассказываем',
    'past-simple irregular-verbs past-continuous future-forms present-perfect for-since adverbs-manner as-as too-enough indefinite-pronouns modals transport travel health',
  ),
  year(
    7,
    'Соединяем времена и строим сложные фразы',
    'present-perfect for-since past-continuous gerund-infinitive zero-conditional first-conditional reflexive-pronouns connectors modals polite-requests technology travel',
  ),
  year(
    8,
    'B1: связываем события и передаём чужие слова',
    'past-perfect present-perfect-continuous used-to passive reported-statements reported-questions relative-clauses second-conditional subject-questions word-formation simple-or-continuous past-simple past-continuous present-perfect for-since future-forms zero-conditional first-conditional modals technology',
  ),
  year(
    9,
    'B1–B2: рассуждаем о причинах и последствиях',
    'reported-statements reported-questions relative-clauses second-conditional third-conditional wish modal-deductions passive word-formation present-perfect gerund-infinitive indefinite-pronouns reflexive-pronouns quantifiers too-enough first-conditional polite-requests shopping health',
  ),
  year(
    10,
    'B2: сложные времена, выводы и сравнения',
    'future-continuous future-perfect third-conditional wish modal-deductions causative verb-pattern-meaning comparing-photos past-perfect present-perfect-continuous word-formation word-order question-words articles countable-nouns connectors comparisons as-as present-perfect first-conditional jobs travel',
  ),
  year(
    11,
    'B1–B2: систематизируем грамматику и речь',
    'third-conditional wish modal-deductions causative verb-pattern-meaning comparing-photos future-continuous future-perfect reported-statements reported-questions past-perfect present-perfect-continuous word-formation simple-or-continuous past-simple past-continuous future-forms present-perfect for-since modals gerund-infinitive first-conditional polite-requests technology',
  ),
];

export const grammarStrands: Record<GrammarStrand, string> = {
  tenses: '⏱ Времена и формы глаголов',
  nouns: '🧺 Существительные и местоимения',
  modifiers: '🎨 Описания и сравнения',
  verbs: '🧩 Глаголы и модальные слова',
  sentences: '🔗 Предложения и связи',
};
const strandIds: Record<GrammarStrand, string[]> = {
  tenses:
    'to-be present-simple present-continuous past-simple was-were past-continuous future-forms present-perfect simple-or-continuous for-since irregular-verbs'.split(
      ' ',
    ),
  nouns:
    'articles plurals there-is countable-nouns quantifiers pronouns possessive-s this-that indefinite-pronouns reflexive-pronouns'.split(
      ' ',
    ),
  modifiers: 'comparisons as-as too-enough adverbs-manner frequency'.split(' '),
  verbs: 'can modals gerund-infinitive have-got imperatives'.split(' '),
  sentences:
    'word-order question-words prepositions-place prepositions-time connectors zero-conditional first-conditional'.split(
      ' ',
    ),
};
export function lessonStrand(lesson: Lesson): GrammarStrand {
  return (
    lesson.strand ??
    (Object.keys(strandIds) as GrammarStrand[]).find((s) => strandIds[s].includes(lesson.id)) ??
    'sentences'
  );
}

export function schoolLessons(grade: number, lessons: Lesson[]) {
  const route = schoolYears.find((y) => y.grade === grade);
  if (!route) return [];
  const order = new Map(route.lessonIds.map((id, i) => [id, i]));
  return lessons
    .filter((l) => (l.schoolGrades ? l.schoolGrades.includes(grade) : order.has(l.id)))
    .sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999));
}
