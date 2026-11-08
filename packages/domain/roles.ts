import type { BotState } from './types.js';
export function rolesFor(state: Pick<BotState, 'teacherIds' | 'revokedTeacherIds'>, teacherIds: string[] = [], adminIds: string[] = []) {
  const admins = new Set(adminIds);
  const teachers = new Set([...teacherIds, ...(state.teacherIds ?? []), ...adminIds]);
  for (const id of state.revokedTeacherIds ?? []) if (!admins.has(id)) teachers.delete(id);
  return { isAdmin: (id: string) => admins.has(id), isTeacher: (id: string) => teachers.has(id), teacherIds: [...teachers] };
}
