export const choice = (prompt, options, answer, explanation) => ({ type: 'choice', prompt, options, accepted: [answer], explanation });
export const gap = (prompt, answer, explanation) => ({ type: 'text', prompt, accepted: Array.isArray(answer) ? answer : [answer], explanation });

export function lesson(id, title, level, rules, examples, traps, questions, category = 'grammar') {
  return {
    id, title, level, category, version: 1, estimatedMinutes: 7,
    theory: [rules.join('\n'), `Примеры:\n${examples.join('\n')}`, `Ловушки:\n${traps.join('\n')}`].join('\n\n'),
    questions: questions.map((question, index) => ({ id: `q${index + 1}`, ...question })),
  };
}
