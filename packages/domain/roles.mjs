export function rolesFor(state, teacherIds = [], adminIds = []) {
  const admins = new Set(adminIds);
  const teachers = new Set([...teacherIds, ...(state.teacherIds ?? []), ...adminIds]);
  for (const id of state.revokedTeacherIds ?? []) if (!admins.has(id)) teachers.delete(id);
  return { isAdmin: (id) => admins.has(id), isTeacher: (id) => teachers.has(id), teacherIds: [...teachers] };
}
