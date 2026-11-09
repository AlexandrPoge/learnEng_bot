import type { Context } from '../classrooms/shared.js';
import { button, manage, linkedStudents, paged } from '../classrooms/shared.js';
import type { BotState, User } from '../../../../packages/domain/types.js';

/** Выбор и повторная проверка получателей домашнего задания. */
export function targetPicker(state: BotState, user: User, ctx: Context, page = 0) {
  const draft = user.workspace;
  if (draft?.kind !== 'assign' || draft.step !== 'target') return;
  const targets = [
    ...Object.values(state.classes ?? {})
      .filter((c) => manage(c, user, ctx) && c.studentIds.length)
      .map((c) => ({ text: `🏫 ${c.name} · ${c.studentIds.length} уч.`, kind: 'class', id: c.id })),
    ...linkedStudents(state, user, ctx).map((s) => ({
      text: s.id === user.id ? '🧪 Себе · пробное задание' : `👤 ${s.name} · ${s.id}`,
      kind: 'student',
      id: s.id,
    })),
  ];
  ctx.panel(
    `📨 ${draft.lesson.title}\n\nШаг 1 из 4 · Кому отправить?\n${targets.length ? 'Выбери одного ученика или весь класс.' : 'Пока нет учеников. Сначала пригласи их в класс или через /invite.'}`,
    paged(
      targets,
      page,
      (t) => [button(t.text, `work:target:${draft.nonce}:${t.kind}:${t.id}`)],
      (p) => `work:targets:${draft.nonce}:${p}`,
      [[button('✖️ Отменить', 'work:cancel')]],
    ),
  );
}

export function recipients(state: BotState, user: User, ctx: Context): string[] {
  const draft = user.workspace;
  if (draft?.kind !== 'assign' || !draft.target) return [];
  if (draft.target.kind === 'class') {
    const c = state.classes?.[draft.target.id];
    return c && manage(c, user, ctx) && ctx.isTeacher(c.ownerId)
      ? [...new Set(c.studentIds)].filter((id) => Boolean(state.users[id]))
      : [];
  }
  return linkedStudents(state, user, ctx).some((s) => s.id === draft.target!.id) ? [draft.target.id] : [];
}
