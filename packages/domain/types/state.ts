import type { Lesson, Attempt } from './learning.js';
import type { User } from './users.js';
import type { Classroom, HomeworkTemplate, Assignment } from './classrooms.js';
import type { EditorDraft } from './editor.js';
import type { TelegramPayload, TelegramResults } from './telegram.js';

/** Типы области: state. Сериализуемые данные совместимы с прежним хранилищем. */
export interface OutboxTask {
  id: string;
  method: keyof TelegramResults;
  payload: TelegramPayload;
  requiredTeacher: boolean;
  ruleCard?: { lesson: Lesson; page: number };
}

export interface BotState {
  version: 1;
  offset: number;
  users: Record<string, User>;
  attempts: Record<string, Attempt>;
  invites: Record<string, { teacherId: string; expiresAt: number }>;
  outbox: OutboxTask[];
  teacherIds?: string[];
  revokedTeacherIds?: string[];
  teacherWelcome?: Record<string, boolean>;
  assignments?: Record<string, Assignment>;
  editors?: Record<string, EditorDraft>;
  lessonOverrides?: Record<string, Lesson>;
  lessonHistory?: Record<string, { lesson: Lesson; editedBy: string; savedAt: string }[]>;
  classes?: Record<string, Classroom>;
  classInvites?: Record<string, { classId: string; expiresAt: number }>;
  homeworkTemplates?: Record<string, HomeworkTemplate>;
  ruleImages?: Record<string, string>;
}
