import { manage, canRead } from './shared.js';
import type { ClassroomRequest } from './request.js';
import { handleClassEntry } from './entry-actions.js';
import { handleClassMember } from './member-actions.js';
import { handleClassSettings } from './settings.js';
import { handleClassInvites } from './invites.js';
import { handleClassTopics } from './topics.js';
import { handleClassStudents } from './students.js';

/** Доступ к классу проверяется до чтения; право управления — до изменений. */
export function handleClassActions(request: ClassroomRequest): boolean {
  const { state, user, id, ctx } = request;
  if (handleClassEntry(request)) return true;
  const c = state.classes?.[id];
  if (!c || !canRead(c, user, ctx)) {
    ctx.send('Класс недоступен. /classes');
    return true;
  }
  const member = { ...request, c };
  if (handleClassMember(member)) return true;
  if (!manage(c, user, ctx)) {
    ctx.send('Настройки доступны репетитору класса и администратору.');
    return true;
  }
  if (handleClassSettings(member)) return true;
  if (handleClassInvites(member)) return true;
  if (handleClassTopics(member)) return true;
  if (handleClassStudents(member)) return true;
  ctx.send('Открой класс заново: /classes');
  return true;
}
