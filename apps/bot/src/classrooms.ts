import type { Context } from './classrooms/shared.js';
import { handleSetupInput } from './classrooms/setup-input.js';
import { handleClassActions } from './classrooms/actions.js';
import { handleAssignmentTemplates } from './assignments/templates.js';
import { handleAssignmentSent } from './assignments/sent.js';
import { handleAssignmentResult } from './assignments/result.js';
import { handleAssignmentSteps } from './assignments/steps.js';
import { handleAssignmentConfirm } from './assignments/confirm.js';
import type { BotState, User } from '../../../packages/domain/types.js';

/** Команды групп и ДЗ; маршруты сохраняют совместимость со старыми кнопками. */
export function handleClassrooms(
  state: BotState,
  user: User,
  input: { text?: string; data?: string },
  ctx: Context,
): boolean {
  const text = input.text ?? '';
  const [raw = '', ...args] = text.split(/\s+/u);
  const command = raw.split('@')[0].toLowerCase();
  let data = input.data ?? '';
  if (command === '/classes') data = 'class:list:0';
  if (command === '/new_class') data = 'class:new';
  if (command === '/my_homework') data = 'work:list:0';
  if (command === '/sent_homework') data = 'work:sent:0';
  if (command === '/cancel_setup') data = 'work:cancel';
  if (command === '/join_class') data = `class:join:${args[0] ?? ''}`;
  const draft = user.workspace;
  const [area, action, id, detail, extra] = data.split(':');
  const request = { state, user, ctx, text, data, draft, area, action, id, detail, extra };
  if (handleSetupInput(request)) return true;
  if (!data.startsWith('class:') && !data.startsWith('work:')) return false;
  if (data === 'work:cancel') {
    delete user.workspace;
    ctx.send('Настройка закрыта. Созданные классы, ДЗ и назначенные работы сохранены.');
    return true;
  }
  if (area === 'class') return handleClassActions(request);
  if (!ctx.teacher) {
    ctx.send('Создание и назначение ДЗ доступно репетитору и администратору.');
    return true;
  }
  if (handleAssignmentTemplates(request)) return true;
  if (handleAssignmentSent(request)) return true;
  if (handleAssignmentResult(request)) return true;
  if (draft?.kind !== 'assign' || draft.nonce !== id) {
    ctx.send('Этот шаг уже закрыт. /my_homework');
    return true;
  }
  const assignment = { ...request, draft };
  if (handleAssignmentSteps(assignment)) return true;
  if (handleAssignmentConfirm(assignment)) return true;
  ctx.send('Этот шаг уже выполнен. Открой /my_homework');
  return true;
}
