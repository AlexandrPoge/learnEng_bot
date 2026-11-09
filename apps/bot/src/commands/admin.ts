import { send } from '../ui/messages.js';
import type { CommandContext } from '../routing/context.js';
import { mainMenu } from '../navigation.js';

export function handleAdminCommand(request: CommandContext): boolean {
  const { state, id, roles, admin, access, command, argument } = request;
  if (['/admin', '/add_teacher', '/remove_teacher'].includes(command)) {
    if (!admin) {
      send(state, id, 'Команда доступна администратору.');
      return true;
    }
    if (command === '/admin') {
      send(
        state,
        id,
        `🛠 Кабинет администратора\n\n🔑 /add_teacher ID — выдать права\n🔒 /remove_teacher ID — снять права\n✏️ /editor — материалы\n👥 /students — все ученики\n📊 /results — работы\n🕘 /history ID — версии урока\n\n👩‍🏫 Репетиторы: ${roles.teacherIds.join(', ') || 'нет'}`,
        { reply_markup: mainMenu(access) },
      );
      return true;
    }
    if (!/^[1-9]\d*$/u.test(argument ?? '')) {
      send(state, id, 'Укажи числовой Telegram ID.');
      return true;
    }
    if (roles.isAdmin(argument)) {
      send(state, id, 'Права администратора задаются в ADMIN_IDS.');
      return true;
    }
    state.teacherIds ??= [];
    state.revokedTeacherIds ??= [];
    if (command === '/add_teacher') {
      state.teacherIds = [...new Set([...state.teacherIds, argument])];
      state.revokedTeacherIds = state.revokedTeacherIds.filter((value) => value !== argument);
      send(state, id, `Права репетитора выданы: ${argument}.`);
    } else {
      state.teacherIds = state.teacherIds.filter((value) => value !== argument);
      state.revokedTeacherIds = [...new Set([...state.revokedTeacherIds, argument])];
      delete state.editors?.[argument];
      send(state, id, `Права репетитора сняты: ${argument}.`);
    }
    return true;
  }
  return false;
}
