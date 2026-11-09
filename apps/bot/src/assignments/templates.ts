import { button, paged } from '../classrooms/shared.js';
import { beginAssignment } from './setup.js';
import type { ClassroomRequest } from '../classrooms/request.js';
import { availableLessons, findLesson } from '../editor.js';

export function handleAssignmentTemplates(request: ClassroomRequest): boolean {
  const { state, user, ctx, action, id } = request;
  if (action === 'list') {
    const templates = Object.values(state.homeworkTemplates ?? {}).filter(
      (t) => ctx.admin || t.ownerId === user.id,
    );
    ctx.panel(
      `📝 Мои ДЗ\n\n${templates.length ? 'Сохранённые задания можно менять и назначать повторно.' : 'Создай задание с вопросами и ключами или выбери тему из учебника.'}\n\nОтветы учеников хранятся отдельно от ключей.`,
      paged(
        templates,
        Number(id),
        (t) => [button(t.lesson.title, `work:view:${t.id}`)],
        (p) => `work:list:${p}`,
        [
          [button('➕ Создать своё ДЗ', 'work:new')],
          [button('📚 Назначить тему учебника', 'work:course:0')],
          [button('📤 Отправленные работы', 'work:sent:0')],
          [button('🏠 Меню', 'home')],
        ],
      ),
    );
    return true;
  }
  if (action === 'new') {
    ctx.editor('/new_homework');
    return true;
  }
  if (action === 'course') {
    ctx.panel(
      '📚 Какую тему назначить?\n\nУченики получат упражнения из выбранной темы.',
      paged(
        availableLessons(state),
        Number(id),
        (l) => [button(`${l.level} · ${l.title}`, `work:send:${l.id}`)],
        (p) => `work:course:${p}`,
        [[button('📝 Мои ДЗ', 'work:list:0')]],
      ),
    );
    return true;
  }
  if (action === 'view' || action === 'edit' || action === 'send') {
    const template = state.homeworkTemplates?.[id];
    const lesson = template
      ? ctx.admin || template.ownerId === user.id
        ? template.lesson
        : undefined
      : action === 'send'
        ? findLesson(state, id)
        : undefined;
    if (!lesson) {
      ctx.send('Задание недоступно. /my_homework');
      return true;
    }
    if (action === 'edit') ctx.editor(`/edit_homework ${id}`);
    else if (action === 'send') beginAssignment(state, user, lesson, ctx);
    else
      ctx.panel(
        `📝 ${lesson.title}\n\n🌱 ${lesson.level} · ${lesson.questions.length} вопросов · версия ${lesson.version}\n\nПравки не меняют уже назначенные работы. Ключи доступны в предпросмотре редактора.`,
        {
          inline_keyboard: [
            [button('📨 Назначить', `work:send:${id}`), button('✏️ Изменить', `work:edit:${id}`)],
            [button('📝 Мои ДЗ', 'work:list:0')],
          ],
        },
      );
    return true;
  }
  return false;
}
