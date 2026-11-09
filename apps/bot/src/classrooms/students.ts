import { button, paged } from './shared.js';
import type { ClassMemberRequest } from './request.js';

export function handleClassStudents(request: ClassMemberRequest): boolean {
  const { state, ctx, action, detail, c } = request;
  if (action === 'students' || action === 'remove' || action === 'remove-confirm') {
    if (action === 'remove') {
      if (!c.studentIds.includes(detail)) {
        ctx.send('Ученик уже вышел из класса.');
        return true;
      }
      ctx.panel(
        `Убрать ${state.users[detail]?.name ?? 'ученика'} из «${c.name}»?\nРанее назначенные работы и результаты сохранятся. Новые задания класса он получать не будет.`,
        {
          inline_keyboard: [
            [button('Убрать из класса', `class:remove-confirm:${c.id}:${detail}`)],
            [button('Назад', `class:students:${c.id}:0`)],
          ],
        },
      );
      return true;
    }
    if (action === 'remove-confirm') c.studentIds = c.studentIds.filter((s) => s !== detail);
    ctx.panel(
      `👥 ${c.name}\n\nУчеников: ${c.studentIds.length}\nНажми имя, чтобы убрать ученика из класса. Подключение — по приглашению.`,
      paged(
        c.studentIds,
        action === 'students' ? Number(detail) : 0,
        (sid) => [button(`${state.users[sid]?.name ?? 'Ученик'} · ${sid}`, `class:remove:${c.id}:${sid}`)],
        (p) => `class:students:${c.id}:${p}`,
        [[button('🔗 Пригласить', `class:invite:${c.id}`)], [button('🏫 К классу', `class:view:${c.id}`)]],
      ),
    );
    return true;
  }
  return false;
}
