import { button, dueLabel } from '../classrooms/shared.js';
import { recipients } from './targets.js';
import type { AssignmentRequest } from '../classrooms/request.js';
import { randomBytes } from 'node:crypto';
import type { Assignment } from '../../../../packages/domain/types.js';

export function handleAssignmentConfirm(request: AssignmentRequest): boolean {
  const { state, user, ctx, action, draft } = request;
  if (action === 'confirm' && draft.step === 'confirm') {
    const current = recipients(state, user, ctx).sort();
    if (
      !draft.deadline ||
      Date.parse(draft.deadline) <= Date.now() ||
      !current.length ||
      current.join(',') !== [...(draft.recipients ?? [])].sort().join(',')
    ) {
      delete user.workspace;
      ctx.send('Состав учеников или срок изменился. Назначь ДЗ заново: /my_homework');
      return true;
    }
    const classId = draft.target?.kind === 'class' ? draft.target.id : undefined;
    const owner = classId ? state.classes![classId].ownerId : user.id;
    const batchId = randomBytes(8).toString('hex');
    state.assignments ??= {};
    for (const studentId of current) {
      const assignment: Assignment = {
        id: randomBytes(8).toString('hex'),
        batchId,
        studentId,
        teacherId: owner,
        lesson: structuredClone(draft.lesson),
        deadline: draft.deadline,
        createdAt: new Date().toISOString(),
        completedAt: null,
        mode: draft.mode,
        ...(classId ? { classId } : {}),
      };
      state.assignments[assignment.id] = assignment;
      ctx.notify(
        studentId,
        `📝 Новое домашнее задание\n\n${assignment.lesson.title}\n${classId ? `🏫 ${state.classes![classId].name}\n` : ''}📅 Срок: ${dueLabel(assignment.deadline)}\n⚙️ ${assignment.mode === 'test' ? 'Проверочная: разбор после сдачи.' : 'Тренировка: объяснения после каждого ответа.'}\n\nОтветы и время получит репетитор.`,
        { reply_markup: { inline_keyboard: [[button('✏️ Открыть ДЗ', `h:${assignment.id}`)]] } },
      );
    }
    delete user.workspace;
    ctx.panel(
      `✅ ДЗ назначено\n\nПолучателей: ${current.length}\nРезультаты появятся в «Отправленных работах».`,
      { inline_keyboard: [[button('📊 Смотреть сдачу', `work:batch:${batchId}:0`)]] },
    );
    return true;
  }
  return false;
}
