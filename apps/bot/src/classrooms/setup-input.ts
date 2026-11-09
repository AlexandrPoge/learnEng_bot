import { levelButtons, manage } from './shared.js';
import { showClass } from './summary.js';
import { modePicker } from '../assignments/setup.js';
import type { ClassroomRequest } from './request.js';
import { parseDeadline } from '../../../../packages/domain/deadline.js';

export function handleSetupInput(request: ClassroomRequest): boolean {
  const { state, user, ctx, text, data, draft } = request;
  if (!data && draft && text && !text.startsWith('/')) {
    if (!ctx.teacher) {
      delete user.workspace;
      ctx.send('Доступ к настройке закрыт.');
      return true;
    }
    if (draft.kind === 'class' && !draft.name) {
      if (text.length > 70) {
        ctx.send('Название — до 70 символов. Например: «3 класс» или «Взрослые · вечер».');
        return true;
      }
      if (draft.classId) {
        const c = state.classes?.[draft.classId];
        if (!c || !manage(c, user, ctx)) {
          delete user.workspace;
          ctx.send('Класс недоступен.');
          return true;
        }
        c.name = text;
        delete user.workspace;
        showClass(state, user, c, ctx);
        return true;
      }
      draft.name = text;
      ctx.panel(
        '🌱 Выбери уровень группы.\n\nНомер школьного класса и языковой уровень — разные вещи.',
        levelButtons(draft.nonce),
      );
      return true;
    }
    if (draft.kind === 'assign' && draft.step === 'deadline') {
      const deadline = parseDeadline(text);
      if (!deadline || Date.parse(deadline) <= Date.now()) {
        ctx.send(
          'Нужна будущая дата с часовым поясом. Например: 2099-11-20T18:00+03:00. Отмена: /cancel_setup',
        );
        return true;
      }
      draft.deadline = deadline;
      modePicker(user, ctx);
      return true;
    }
    ctx.send('Выбери следующий шаг кнопкой. Отмена: /cancel_setup');
    return true;
  }
  return false;
}
