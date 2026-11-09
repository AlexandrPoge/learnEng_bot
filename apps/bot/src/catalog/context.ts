import { availableLessons } from '../editor.js';
import { schoolLessons } from '../../../../packages/content/school.js';
import type { BotState, User, Category, Level } from '../../../../packages/domain/types.js';

/** Позиция возврата в учебный каталог. */
export const categoryLabels: Record<Category, string> = {
  foundation: '🔤 Первые шаги',
  grammar: '📖 Грамматика',
  vocabulary: '🧺 Слова',
  situations: '💬 Общение и письмо',
};

export function catalogReturn(user: User, level: Level) {
  if (user.classContext) return `class:topics:${user.classContext}:0`;
  if (user.schoolCatalog)
    return user.schoolCatalog.strand
      ? `schg:${user.schoolCatalog.grade}:${user.schoolCatalog.strand}:${user.schoolCatalog.page}`
      : `school:${user.schoolCatalog.grade}:${user.schoolCatalog.category ?? 'all'}:${user.schoolCatalog.page}`;
  const context = user.catalog;
  return context?.level === level
    ? `${context.category ? `g:${level}:${context.category}` : `l:${level}`}:${context.page}`
    : `l:${level}:0`;
}

export function schoolPath(state: BotState, user: User, lessonId: string) {
  if (!user.schoolCatalog) return undefined;
  if (!schoolLessons(user.schoolCatalog.grade, availableLessons(state)).some((l) => l.id === lessonId)) {
    delete user.schoolCatalog;
    return undefined;
  }
  return `🏫 Учебник → ${user.schoolCatalog.grade} класс`;
}
