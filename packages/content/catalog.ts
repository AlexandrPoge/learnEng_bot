import { presentSimple } from './present-simple.js';
import { a1Lessons } from './a1.js';
import { a2Lessons } from './a2.js';
import { normalizeAnswer } from '../domain/grading.js';
import { enrichLesson, lessonSections } from './presentation.js';
import { deepenLesson } from './deeper-lessons.js';
import { topicResources, courseResources } from './resources.js';
import { courseA1 } from './course-a1.js';
import { courseA2 } from './course-a2.js';
import { calendarLife } from './course-calendar-life.js';
import type { Category, Lesson } from '../domain/types.js';

// Уровни задают ориентировочный учебный маршрут, а не сертификат CEFR.
export const lessons: Lesson[] = [
  ...a1Lessons.slice(0, 6),
  presentSimple,
  ...a1Lessons.slice(6),
  ...a2Lessons,
].map(enrichLesson).map((lesson) => ({ ...deepenLesson(lesson, lessonSections(lesson, { fallback: false })), resources: topicResources[lesson.id] ?? [] }));
lessons.push(...[...courseA1, ...courseA2, ...calendarLife].map((lesson) => ({ ...lesson, resources: courseResources(lesson) })));
const categoryOrder: Record<Category, number> = { foundation: 0, grammar: 1, vocabulary: 2, situations: 3 };
lessons.sort((a, b) => a.level.localeCompare(b.level) || (categoryOrder[a.category] ?? 1) - (categoryOrder[b.category] ?? 1));
export const levels = [...new Set(lessons.map((item) => item.level))];
export const getLesson = (id: string) => lessons.find((item) => item.id === id);

export function validateCatalog(items = lessons) {
  const ids = new Set();
  for (const item of items) {
    if (!/^[a-z0-9-]{1,40}$/u.test(item.id) || ids.has(item.id)) throw new Error(`Некорректный или повторный ID темы: ${item.id}`);
    ids.add(item.id);
    if (!['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(item.level) || !item.title?.trim() || !item.theory?.trim() || !Number.isInteger(item.version) || item.version < 1) throw new Error(`Некорректная тема: ${item.id}`);
    if (!item.questions?.length) throw new Error(`Нет упражнений: ${item.id}`);
    const questionIds = new Set();
    for (const question of item.questions) {
      const error = () => { throw new Error(`Некорректное упражнение: ${item.id}/${question.id}`); };
      if (!question.id || questionIds.has(question.id) || !question.prompt?.trim() || !question.explanation?.trim()) error();
      questionIds.add(question.id);
      if (!['choice', 'text'].includes(question.type) || !Array.isArray(question.accepted) || !question.accepted.length || question.accepted.some((answer) => typeof answer !== 'string' || !answer.trim())) error();
      if (question.type === 'choice' && (!Array.isArray(question.options) || question.options.length < 2 || new Set(question.options).size !== question.options.length || question.options.some((option) => typeof option !== 'string' || !option.trim()) || question.accepted.length !== 1 || !question.options.includes(question.accepted[0]))) error();
      if (question.type === 'choice' && new Set(question.options.map(normalizeAnswer)).size !== question.options.length) error();
    }
  }
  return true;
}

validateCatalog();
