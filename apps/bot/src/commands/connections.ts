import { send } from '../ui/messages.js';
import type { CommandContext } from '../routing/context.js';
import { randomBytes } from 'node:crypto';

export function handleConnectionsCommand(request: CommandContext): boolean {
  const { state, id, user, roles, teacher, command, argument } = request;
  if (command === '/invite') {
    if (!teacher) {
      send(state, id, 'Команда доступна репетитору.');
      return true;
    }
    // Один действующий код на репетитора.
    for (const [code, invite] of Object.entries(state.invites))
      if (invite.teacherId === id) delete state.invites[code];
    const code = randomBytes(12).toString('hex');
    state.invites[code] = { teacherId: id, expiresAt: Date.now() + 86400000 };
    send(
      state,
      id,
      `Одноразовый код на 24 часа. Передай ученику команду:\n/join ${code}\nПосле подключения ты получишь его ответы на будущие задания.`,
    );
    return true;
  }
  if (command === '/join') {
    const invite = state.invites[argument];
    if (
      !invite ||
      invite.expiresAt < Date.now() ||
      !roles.isTeacher(invite.teacherId) ||
      invite.teacherId === id
    ) {
      send(state, id, 'Код недействителен. Попроси новый у репетитора.');
      return true;
    }
    if (user.teacherId) {
      send(state, id, 'Ты уже подключён к репетитору.');
      return true;
    }
    user.teacherId = invite.teacherId;
    delete state.invites[argument];
    send(state, id, 'Ты подключён! Ответы на новые задания будут отправляться репетитору.');
    send(state, user.teacherId, `Подключился ученик: ${user.name}`);
    return true;
  }
  return false;
}
