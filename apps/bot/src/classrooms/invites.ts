import type { ClassMemberRequest } from './request.js';
import { randomBytes } from 'node:crypto';

export function handleClassInvites(request: ClassMemberRequest): boolean {
  const { state, ctx, action, c } = request;
  if (action === 'invite') {
    if (!ctx.isTeacher(c.ownerId)) {
      ctx.send('У владельца класса больше нет прав репетитора.');
      return true;
    }
    for (const [code, inv] of Object.entries(state.classInvites ?? {}))
      if (inv.classId === c.id) delete state.classInvites![code];
    const code = randomBytes(12).toString('hex');
    (state.classInvites ??= {})[code] = { classId: c.id, expiresAt: Date.now() + 86400000 };
    ctx.send(
      `🔗 Приглашение в «${c.name}»\n\nПередай ученикам команду:\n/join_class ${code}\n\nКод действует 24 часа, подходит для нескольких учеников. Новый код отменяет предыдущий. Участник увидит объяснение перед вступлением.`,
    );
    return true;
  }
  return false;
}
