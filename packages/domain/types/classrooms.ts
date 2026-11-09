import type { Level, Lesson } from './learning.js';

/** Типы области: classrooms. Сериализуемые данные совместимы с прежним хранилищем. */
export interface Classroom {
  id: string;
  name: string;
  level: Level;
  ownerId: string;
  studentIds: string[];
  lessonIds: string[];
  createdAt: string;
}

export interface HomeworkTemplate {
  id: string;
  ownerId: string;
  lesson: Lesson;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  studentId: string;
  teacherId: string;
  lesson: Lesson;
  deadline: string;
  createdAt: string;
  completedAt: string | null;
  attemptId?: string;
  classId?: string;
  batchId?: string;
  mode?: 'practice' | 'test';
}
