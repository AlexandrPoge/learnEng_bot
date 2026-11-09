import type { Assignment, BotState } from './types.js';

export type HomeworkStatus = 'new' | 'active' | 'overdue' | 'submitted' | 'late';

export const homeworkStatusLabels: Record<HomeworkStatus, string> = {
  new: '📝 Не начато',
  active: '✏️ В процессе',
  overdue: '⏰ Просрочено',
  submitted: '✅ Сдано',
  late: '✅ Сдано с опозданием',
};

/** Статус выводится из фактов: сдача важнее срока, просрочка важнее начала. */
export function homeworkStatus(state: BotState, assignment: Assignment, now = Date.now()): HomeworkStatus {
  if (assignment.completedAt) {
    return Date.parse(assignment.completedAt) > Date.parse(assignment.deadline) ? 'late' : 'submitted';
  }

  if (now > Date.parse(assignment.deadline)) {
    return 'overdue';
  }

  const user = state.users[assignment.studentId];
  const attempt = user?.activeAttempt ? state.attempts[user.activeAttempt] : undefined;
  if (attempt?.assignmentId === assignment.id && !attempt.completedAt && !attempt.cancelledAt) {
    return 'active';
  }

  return 'new';
}

/** Несданные идут по дедлайну, сданные — от последней сдачи. */
export function compareHomework(a: Assignment, b: Assignment): number {
  if (Boolean(a.completedAt) !== Boolean(b.completedAt)) {
    return a.completedAt ? 1 : -1;
  }

  const difference =
    a.completedAt && b.completedAt
      ? Date.parse(b.completedAt) - Date.parse(a.completedAt)
      : Date.parse(a.deadline) - Date.parse(b.deadline);

  return difference || a.id.localeCompare(b.id);
}

export function deadlineLabel(date: string): string {
  return `${new Date(date).toLocaleString('ru-RU', {
    timeZone: 'Europe/Minsk',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })} (UTC+3)`;
}
