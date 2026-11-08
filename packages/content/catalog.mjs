import { presentSimple } from './present-simple.mjs';
import { a1Lessons } from './a1.mjs';
import { a2Lessons } from './a2.mjs';
import { normalizeAnswer } from '../domain/grading.mjs';
import { enrichLesson } from './presentation.mjs';

// Уровни задают ориентировочный учебный маршрут, а не сертификат CEFR.
export const lessons = [
  ...a1Lessons.slice(0, 6),
  { ...presentSimple, category: 'grammar', estimatedMinutes: 7 },
  ...a1Lessons.slice(6),
  ...a2Lessons,
].map(enrichLesson);
export const levels = [...new Set(lessons.map((item) => item.level))];
export const getLesson = (id) => lessons.find((item) => item.id === id);

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
