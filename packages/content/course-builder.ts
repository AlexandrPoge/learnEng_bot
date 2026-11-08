import { lesson, choice, gap } from './lesson-builder.js';
import type { Category, Level, QuestionInput } from '../domain/types.js';

export function unit(id: string, title: string, level: Level, icon: string, goal: string, memory: string, rules: string[], examples: string[], traps: string[], questions: QuestionInput[], category: Category = 'grammar') {
  return { ...lesson(id, title, level, rules, examples, traps, questions, category), icon, goal, memory, childIntro: rules[0] };
}

// Слова отрабатываются в явном словаре урока, а не как свободный перевод.
// Для текстовых вопросов словарь может задавать допустимые варианты.
type WordEntry = [string, string, string, string, string[]?];
export function wordUnit(id: string, title: string, level: Level, icon: string, goal: string, entries: WordEntry[], notes: string[] = [], category: Category = 'vocabulary') {
  const prompts = entries.map(([en, ru]) => `${en} — ${ru}`);
  const rules = [
    goal,
    'Прочитай пары слов, затем примеры: значение легче понять в целой фразе.',
    'В упражнениях используй слова именно из словаря этого урока. Свободные рассказы здесь автоматически не оцениваются.',
    'Прочитай фразу вслух, закрой перевод и вспомни её смысл. Затем проверь себя.',
    ...notes,
  ];
  const examples = entries.map(([en, ru, sentence, translation]) => `${sentence} — ${translation} Слово ${en} здесь значит «${ru}».`);
  const questions = [0, 1, 2].map((index) => {
    const options = [entries[index][0], entries[(index + 2) % entries.length][0], entries[(index + 4) % entries.length][0]];
    const shift = (index + id.length) % options.length;
    return choice(`Какое слово из урока означает «${entries[index][1]}»?`, [...options.slice(shift), ...options.slice(0, shift)], entries[index][0], prompts[index]);
  });
  for (const index of [3, 4]) questions.push(gap(`Напиши слово или фразу из словаря урока: «${entries[index][1]}».`, entries[index][4] ?? entries[index][0], prompts[index]));
  return unit(id, title, level, icon, goal, prompts.join(' · '), rules, examples, [
    'Смотри на смысл всей фразы: одно русское слово иногда переводится по-разному.',
    'Не переводи устойчивое сочетание по одному слову. Запомни его целиком.',
    'Если твоя формулировка отличается от ключа, сравни её со словарём урока; свободный ответ можно обсудить с репетитором.',
  ], questions, category);
}
