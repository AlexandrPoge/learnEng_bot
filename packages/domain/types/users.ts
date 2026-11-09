import type { Level, Category, GrammarStrand, Section, Lesson } from './learning.js';

/** Типы области: users. Сериализуемые данные совместимы с прежним хранилищем. */
export interface User {
  id: string;
  name: string;
  activeAttempt: string | null;
  teacherId?: string;
  learningMode?: 'child' | 'adult';
  selectedLesson?: string;
  searching?: boolean;
  reading?: { lessonId: string; section: Section; page: number; version: number };
  catalog?: { level: Level; page: number; category: Category | null };
  schoolCatalog?: { grade: number; page: number; category: Category | null; strand?: GrammarStrand | 'all' };
  resultNotifications?: 'compact' | 'off';
  classContext?: string;
  workspace?:
    | { kind: 'class'; nonce: string; name?: string; classId?: string }
    | {
        kind: 'assign';
        nonce: string;
        lesson: Lesson;
        target?: { kind: 'student' | 'class'; id: string };
        deadline?: string;
        mode?: 'practice' | 'test';
        recipients?: string[];
        step: 'target' | 'deadline' | 'mode' | 'confirm';
      };
}

export interface Access {
  teacher?: boolean;
  admin?: boolean;
}
