import { button, paged } from './shared.js';
import type { ClassMemberRequest } from './request.js';
import { availableLessons, findLesson } from '../editor.js';

export function handleClassTopics(request: ClassMemberRequest): boolean {
  const { state, ctx, action, detail, extra, c } = request;
  if (action === 'pick' || action === 'toggle') {
    if (action === 'toggle') {
      if (!findLesson(state, detail)) {
        ctx.send('Тема не найдена.');
        return true;
      }
      c.lessonIds = c.lessonIds.includes(detail)
        ? c.lessonIds.filter((t) => t !== detail)
        : [...c.lessonIds, detail];
    }
    const page = Number(action === 'toggle' ? extra : detail);
    const topics = availableLessons(state).filter((t) => t.level === c.level || c.lessonIds.includes(t.id));
    ctx.panel(
      `📚 Темы для «${c.name}»\n\nНажми тему, чтобы добавить или убрать её. ✅ — уже в классе.\nВыбрано: ${c.lessonIds.length}`,
      paged(
        topics,
        page,
        (t) => [
          button(
            `${c.lessonIds.includes(t.id) ? '✅' : '➕'} ${t.title}`,
            `class:toggle:${c.id}:${t.id}:${Number.isInteger(page) ? page : 0}`,
          ),
        ],
        (p) => `class:pick:${c.id}:${p}`,
        [[button('🏫 Готово · к классу', `class:view:${c.id}`)]],
      ),
    );
    return true;
  }
  return false;
}
