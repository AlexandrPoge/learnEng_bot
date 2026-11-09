import { toBeSupplement } from './supplements/to-be.js';
import { pronounsSupplement } from './supplements/pronouns.js';
import { articlesSupplement } from './supplements/articles.js';
import { pluralsSupplement } from './supplements/plurals.js';
import { thereIsSupplement } from './supplements/there-is.js';
import { haveGotSupplement } from './supplements/have-got.js';
import { presentSimpleSupplement } from './supplements/present-simple.js';
import { prepositionsTimeSupplement } from './supplements/prepositions-time.js';
import { prepositionsPlaceSupplement } from './supplements/prepositions-place.js';
import { presentContinuousSupplement } from './supplements/present-continuous.js';
import { canSupplement } from './supplements/can.js';
import { dailyRoutineSupplement } from './supplements/daily-routine.js';
import { pastSimpleSupplement } from './supplements/past-simple.js';
import { pastContinuousSupplement } from './supplements/past-continuous.js';
import { futureFormsSupplement } from './supplements/future-forms.js';
import { presentPerfectSupplement } from './supplements/present-perfect.js';
import { comparisonsSupplement } from './supplements/comparisons.js';
import { quantifiersSupplement } from './supplements/quantifiers.js';
import { modalsSupplement } from './supplements/modals.js';
import { gerundInfinitiveSupplement } from './supplements/gerund-infinitive.js';
import type { Lesson, Section } from '../domain/types.js';

/** Дополнения к базовым темам; порядок и тексты не меняются при сборке. */
const extra: Record<string, [string[], string[], string[]]> = {
  ...toBeSupplement,
  ...pronounsSupplement,
  ...articlesSupplement,
  ...pluralsSupplement,
  ...thereIsSupplement,
  ...haveGotSupplement,
  ...presentSimpleSupplement,
  ...prepositionsTimeSupplement,
  ...prepositionsPlaceSupplement,
  ...presentContinuousSupplement,
  ...canSupplement,
  ...dailyRoutineSupplement,
  ...pastSimpleSupplement,
  ...pastContinuousSupplement,
  ...futureFormsSupplement,
  ...presentPerfectSupplement,
  ...comparisonsSupplement,
  ...quantifiersSupplement,
  ...modalsSupplement,
  ...gerundInfinitiveSupplement,
};
export function deepenLesson(lesson: Lesson, sections: Record<Section, string[]>): Lesson {
  const addition = extra[lesson.id];
  if (!addition) return lesson;
  const expanded = {
    rule: [...sections.rule, ...addition[0]],
    examples: [...sections.examples, ...addition[1]],
    traps: [...sections.traps, ...addition[2]],
  };
  return {
    ...lesson,
    version: lesson.version + 1,
    theory: [
      expanded.rule.join('\n'),
      `Примеры:\n${expanded.examples.join('\n')}`,
      `Ловушки:\n${expanded.traps.join('\n')}`,
    ].join('\n\n'),
  };
}
