import { send } from '../ui/messages.js';
import type { CommandContext } from '../routing/context.js';
import { randomBytes } from 'node:crypto';
import { findLesson } from '../editor.js';
import { parseDeadline } from '../../../../packages/domain/deadline.js';

export function handleAssignCommand(request: CommandContext): boolean {
  const { state, id, teacher, admin, text, command } = request;
  if (command === '/assign') {
    if (!teacher) {
      send(state, id, 'Назначение доступно репетитору или администратору.');
      return true;
    }
    const [, studentId, lessonId, due] = text.split(/\s+/u);
    const student = state.users[studentId];
    const lesson = findLesson(state, lessonId);
    const deadline = parseDeadline(due);
    if (
      !student ||
      (!admin &&
        studentId !== id &&
        student.teacherId !== id &&
        !Object.values(state.classes ?? {}).some((c) => c.ownerId === id && c.studentIds.includes(studentId)))
    ) {
      send(state, id, 'Ученик не найден или не подключён к тебе. /students');
      return true;
    }
    if (!lesson || !deadline || Date.parse(deadline) <= Date.now()) {
      send(
        state,
        id,
        'Формат: /assign ID_УЧЕНИКА ID_ТЕМЫ ГГГГ-ММ-ДДTЧЧ:ММ+03:00\nНужна существующая тема и будущий срок с часовым поясом.',
      );
      return true;
    }
    state.assignments ??= {};
    const assignmentId = randomBytes(8).toString('hex');
    state.assignments[assignmentId] = {
      id: assignmentId,
      studentId,
      teacherId: id,
      lesson: structuredClone(lesson),
      deadline,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    send(state, id, `Задание назначено: ${student.name} · ${lesson.title}\nСрок: ${due}`);
    send(
      state,
      studentId,
      `Новое домашнее задание: ${lesson.title}\nСрок: ${due}\nПрактика с объяснениями после каждого ответа. Результат получит репетитор.`,
      {
        reply_markup: { inline_keyboard: [[{ text: 'Начать задание', callback_data: `h:${assignmentId}` }]] },
      },
    );
    return true;
  }
  return false;
}
