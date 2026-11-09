import { levelButtons, key } from './shared.js';
import type { ClassMemberRequest } from './request.js';

export function handleClassSettings(request: ClassMemberRequest): boolean {
  const { state, user, ctx, action, c } = request;
  if (action === 'rename' || action === 'change-level') {
    if (user.activeAttempt || state.editors?.[user.id] || user.workspace) {
      ctx.send('Сначала закрой настройку /cancel_setup, черновик /discard или практику /cancel.');
      return true;
    }
    user.workspace = {
      kind: 'class',
      nonce: key(),
      classId: c.id,
      ...(action === 'change-level' ? { name: c.name } : {}),
    };
    if (action === 'rename')
      ctx.send('✏️ Отправь новое название класса (до 70 символов). Отмена: /cancel_setup');
    else
      ctx.panel(
        '🌱 Выбери уровень. Ранее выбранные темы и назначенные ДЗ сохранятся.',
        levelButtons(user.workspace.nonce),
      );
    return true;
  }
  return false;
}
