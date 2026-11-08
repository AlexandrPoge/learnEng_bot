import type { QuestionInput, Lesson, Level, Category } from '../domain/types.js';
export const choice = (prompt: string, options: string[], answer: string, explanation: string): QuestionInput => ({ type: 'choice', prompt, options, accepted: [answer], explanation });
export const gap = (prompt: string, answer: string | string[], explanation: string): QuestionInput => ({ type: 'text', prompt, accepted: Array.isArray(answer) ? answer : [answer], explanation });

export function lesson(id: string, title: string, level: Level, rules: string[], examples: string[], traps: string[], questions: QuestionInput[], category: Category = 'grammar'): Lesson {
  return {
    id, title, level, category, version: 1, estimatedMinutes: 7,
    theory: [rules.join('\n'), `Примеры:\n${examples.join('\n')}`, `Ловушки:\n${traps.join('\n')}`].join('\n\n'),
    questions: questions.map((question, index) => ({ id: `q${index + 1}`, ...question })),
  };
}
