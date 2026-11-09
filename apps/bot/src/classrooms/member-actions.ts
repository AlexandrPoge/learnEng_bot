import { button, manage, paged } from './shared.js';
import { showClass } from './summary.js';
import type { ClassMemberRequest } from './request.js';
import { findLesson } from '../editor.js';
import type { Lesson } from '../../../../packages/domain/types.js';

export function handleClassMember(request: ClassMemberRequest): boolean {
  const { state, user, ctx, action, detail, c } = request;
  if (action === 'view') {
    showClass(state, user, c, ctx);
    return true;
  }
  if (action === 'topics') {
    const topics = c.lessonIds.map((t) => findLesson(state, t)).filter((t): t is Lesson => Boolean(t));
    ctx.panel(
      `📚 ${c.name} → темы\n\n${topics.length ? 'Выбери тему: правило → примеры → ловушки → практика.' : 'Репетитор пока не выбрал темы. Общий учебник доступен в разделе «Темы».'}`,
      paged(
        topics,
        Number(detail),
        (t) => [button(`${t.icon ?? '📘'} ${t.title}`, `class:open:${c.id}:${t.id}`)],
        (p) => `class:topics:${c.id}:${p}`,
        [[button('🏫 К классу', `class:view:${c.id}`)]],
      ),
    );
    return true;
  }
  if (action === 'open') {
    if (!c.lessonIds.includes(detail)) {
      ctx.send('Тема больше не входит в этот класс.');
      return true;
    }
    user.classContext = c.id;
    ctx.topic(detail);
    return true;
  }
  if (action === 'tasks') {
    const tasks = Object.values(state.assignments ?? {}).filter(
      (a) => a.classId === c.id && (manage(c, user, ctx) || a.studentId === user.id),
    );
    if (manage(c, user, ctx)) {
      const batches = [...new Map(tasks.map((a) => [a.batchId ?? a.id, a])).values()].reverse();
      ctx.panel(
        `📝 ${c.name} → задания\n\n${batches.length ? 'Выбери работу для просмотра сдачи.' : 'Заданий ещё нет.'}`,
        paged(
          batches,
          Number(detail),
          (a) => [button(a.lesson.title, `work:batch:${a.batchId ?? a.id}:0`)],
          (p) => `class:tasks:${c.id}:${p}`,
          [[button('📨 Назначить ДЗ', 'work:list:0')], [button('🏫 К классу', `class:view:${c.id}`)]],
        ),
      );
    } else {
      ctx.panel(
        `📝 ${c.name} → мои ДЗ\n\n${tasks.length ? '✅ — сдано. ⏳ — ещё можно выполнить.' : 'Заданий ещё нет.'}`,
        paged(
          tasks.reverse(),
          Number(detail),
          (a) => [
            button(
              `${a.completedAt ? '✅' : '⏳'} ${a.lesson.title}`,
              a.completedAt && a.attemptId ? `review:${a.attemptId}` : `h:${a.id}`,
            ),
          ],
          (p) => `class:tasks:${c.id}:${p}`,
          [[button('🏫 К классу', `class:view:${c.id}`)]],
        ),
      );
    }
    return true;
  }
  return false;
}
