import { button, dueLabel } from '../classrooms/shared.js';
import { targetPicker, recipients } from './targets.js';
import { deadlinePicker, modePicker } from './setup.js';
import type { AssignmentRequest } from '../classrooms/request.js';

export function handleAssignmentSteps(request: AssignmentRequest): boolean {
  const { state, user, ctx, action, detail, extra, draft } = request;
  if (action === 'targets' && draft.step === 'target') {
    targetPicker(state, user, ctx, Number(detail));
    return true;
  }
  if (action === 'target' && draft.step === 'target' && ['student', 'class'].includes(detail)) {
    draft.target = { kind: detail as 'student' | 'class', id: extra };
    if (!recipients(state, user, ctx).length) {
      delete draft.target;
      ctx.send('Получатели недоступны. Пригласи учеников в класс.');
      return true;
    }
    draft.step = 'deadline';
    deadlinePicker(user, ctx);
    return true;
  }
  if (action === 'due' && draft.step === 'deadline' && ['1', '3', '7'].includes(detail)) {
    draft.deadline = new Date(Date.now() + Number(detail) * 86400000).toISOString();
    modePicker(user, ctx);
    return true;
  }
  if (action === 'mode' && draft.step === 'mode' && ['practice', 'test'].includes(detail)) {
    draft.mode = detail as 'practice' | 'test';
    draft.recipients = recipients(state, user, ctx);
    draft.step = 'confirm';
    const target =
      draft.target?.kind === 'class'
        ? state.classes?.[draft.target.id]?.name
        : state.users[draft.target!.id]?.name;
    ctx.panel(
      `📨 Шаг 4 из 4 · Проверь задание\n\n📝 ${draft.lesson.title}\n🔢 Вопросов: ${draft.lesson.questions.length}\n👥 Получатель: ${target}\nУчеников: ${draft.recipients.length}\n📅 ${dueLabel(draft.deadline!)}\n⚙️ ${draft.mode === 'test' ? 'Проверочная · разбор после сдачи' : 'Тренировка · разбор после каждого ответа'}\n\nПосле нажатия ученикам придут задания.`,
      {
        inline_keyboard: [
          [button('✅ Назначить', `work:confirm:${draft.nonce}`)],
          [button('✖️ Отменить', 'work:cancel')],
        ],
      },
    );
    return true;
  }
  return false;
}
