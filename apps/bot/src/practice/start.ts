import { send } from '../ui/messages.js';
import { ask } from './questions.js';
import { accessibleLesson } from '../catalog/access.js';
import { randomBytes } from 'node:crypto';
import { recordActivity } from '../../../../packages/domain/timing.js';
import type { BotState, User, Attempt, Assignment } from '../../../../packages/domain/types.js';

/** Начало практики, проверочной или повторения ошибок. */
export function startLesson(
  state: BotState,
  user: User,
  lessonId?: string,
  assignment?: Assignment,
  reviewFrom?: Attempt,
) {
  if (
    state.editors?.[user.id]?.step ||
    state.editors?.[user.id]?.inputField ||
    state.editors?.[user.id]?.awaitingPhoto ||
    user.workspace
  )
    return send(state, user.id, 'Сначала закончи настройку /cancel_setup или черновик /discard.');
  const selected = reviewFrom
    ? {
        ...reviewFrom.lesson,
        questions: reviewFrom.lesson.questions.filter((_, index) => !reviewFrom.answers[index].correct),
      }
    : (assignment?.lesson ??
      accessibleLesson(state, user, lessonId ?? user.selectedLesson ?? 'present-simple'));
  if (!selected) return send(state, user.id, 'Тема не найдена. Выбери тему: /topics');
  if (user.activeAttempt) {
    recordActivity(state.attempts[user.activeAttempt]);
    send(
      state,
      user.id,
      `Продолжим начатое задание: ${state.attempts[user.activeAttempt].lesson.title}. Для смены темы отмени попытку: /cancel`,
    );
    ask(state, user);
    return;
  }
  const lesson = structuredClone(selected);
  if (!lesson.questions.length)
    return send(state, user.id, '🌟 В этой попытке нет ошибок для повторения. Можно выбрать другую тему.');
  user.selectedLesson = lesson.id;
  const id = randomBytes(8).toString('hex');
  state.attempts[id] = {
    id,
    studentId: user.id,
    teacherId: user.teacherId ?? null,
    assignmentId: assignment?.id ?? null,
    reviewOf: reviewFrom?.id ?? null,
    lesson,
    startedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
    engagedMs: 0,
    mode: assignment?.mode ?? 'practice',
    completedAt: null,
    answers: [],
  };
  if (assignment) state.attempts[id].teacherId = assignment.teacherId;
  if (reviewFrom) state.attempts[id].teacherId = reviewFrom.teacherId;
  user.activeAttempt = id;
  send(
    state,
    user.id,
    `${reviewFrom ? '🔁 Повторение ошибок' : assignment?.mode === 'test' ? '🧪 Проверочная' : '✏️ Практика'}: ${lesson.title}\n\n${lesson.questions.length} вопросов. ${assignment?.mode === 'test' ? 'Ответы сохраняются без подсказок. Разбор будет после сдачи.' : 'После каждого ответа будет объяснение.\n💛 Ошибаться можно — так мы учимся.'}\n📖 Вернуться к правилу: /lesson ${lesson.id}`,
  );
  ask(state, user);
}
