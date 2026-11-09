import { button, key, manage, canRead, paged } from './shared.js';
import { showClass } from './summary.js';
import type { ClassroomRequest } from './request.js';
import type { Classroom, Level } from '../../../../packages/domain/types.js';

export function handleClassEntry(request: ClassroomRequest): boolean {
  const { state, user, ctx, action, id, detail, draft } = request;
  if (action === 'list') {
    delete user.classContext;
    const classes = Object.values(state.classes ?? {}).filter((c) => canRead(c, user, ctx));
    ctx.panel(
      `👥 Учебные группы\n\n${classes.length ? 'Выбери группу учеников: участники, темы и домашние задания.' : 'Групп пока нет. ' + (ctx.teacher ? 'Создай группу и пригласи учеников.' : 'Попроси у репетитора команду /join_class с кодом.')}\n\n🏫 Темы по школьным классам находятся в «📚 Учебнике».`,
      paged(
        classes,
        Number(id),
        (c) => [button(`${c.name} · ${c.level}`, `class:view:${c.id}`)],
        (p) => `class:list:${p}`,
        [
          ...(ctx.teacher ? [[button('➕ Создать группу', 'class:new')]] : []),
          [button('📚 Учебник', 'book'), button('🏠 Меню', 'home')],
        ],
      ),
    );
    return true;
  }
  if (action === 'new') {
    if (!ctx.teacher) {
      ctx.send('Создать класс может репетитор или администратор.');
      return true;
    }
    if (state.editors?.[user.id] || user.activeAttempt || user.workspace) {
      ctx.send('Закончи текущую настройку /cancel_setup, черновик /discard или практику /cancel.');
      return true;
    }
    user.workspace = { kind: 'class', nonce: key() };
    ctx.send(
      '🏫 Новый класс\n\nОтправь название, например «2 класс», «Подростки A2» или «Взрослые».\n\nОтмена: /cancel_setup',
    );
    return true;
  }
  if (action === 'level') {
    if (
      !ctx.teacher ||
      draft?.kind !== 'class' ||
      draft.nonce !== id ||
      !draft.name ||
      !['A1', 'A2', 'B1', 'B2'].includes(detail)
    ) {
      ctx.send('Этот шаг уже закрыт. /classes');
      return true;
    }
    if (draft.classId) {
      const c = state.classes?.[draft.classId];
      if (!c || !manage(c, user, ctx)) {
        delete user.workspace;
        ctx.send('Класс недоступен.');
        return true;
      }
      c.level = detail as Level;
      delete user.workspace;
      ctx.send('Уровень изменён. Ранее выбранные темы и ДЗ сохранены.');
      showClass(state, user, c, ctx);
      return true;
    }
    const c: Classroom = {
      id: key(),
      name: draft.name,
      level: detail as Level,
      ownerId: user.id,
      studentIds: [],
      lessonIds: [],
      createdAt: new Date().toISOString(),
    };
    (state.classes ??= {})[c.id] = c;
    delete user.workspace;
    showClass(state, user, c, ctx);
    return true;
  }
  if (action === 'join' || action === 'accept') {
    const invite = state.classInvites?.[id];
    const c = invite && state.classes?.[invite.classId];
    if (
      !invite ||
      invite.expiresAt < Date.now() ||
      !c ||
      !ctx.isTeacher(c.ownerId) ||
      c.ownerId === user.id
    ) {
      ctx.send('Приглашение недействительно. Попроси новое у репетитора.');
      return true;
    }
    if (c.studentIds.includes(user.id)) {
      showClass(state, user, c, ctx);
      return true;
    }
    if (action === 'join') {
      ctx.panel(
        `🏫 Приглашение: ${c.name}\n\nРепетитор: ${state.users[c.ownerId]?.name ?? c.ownerId}\n🌱 ${c.level}\n\nРепетитор увидит твоё имя, Telegram ID, ответы и время выполнения ДЗ этого класса.`,
        {
          inline_keyboard: [
            [button('✅ Вступить в класс', `class:accept:${id}`)],
            [button('🏠 Меню', 'home')],
          ],
        },
      );
    } else {
      c.studentIds.push(user.id);
      // Членство в классе не меняет подключение к другому репетитору.
      showClass(state, user, c, ctx);
      ctx.notify(c.ownerId, `👤 В класс «${c.name}» вступил ученик: ${user.name}`, { requiredTeacher: true });
    }
    return true;
  }
  return false;
}
