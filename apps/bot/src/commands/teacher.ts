import { send } from '../ui/messages.js';
import type { CommandContext } from '../routing/context.js';

export function handleTeacherCommand(request: CommandContext): boolean {
  const { state, id, teacher, admin, command } = request;
  if (command === '/teacher') {
    if (!teacher) {
      send(state, id, 'Кабинет доступен репетитору.');
      return true;
    }

    send(
      state,
      id,
      '👩‍🏫 Кабинет репетитора\n\n📚 Учебник — материалы по школьным классам и уровням.\n👥 Учебные группы — участники и групповые задания.\n📝 Мои ДЗ — создать и назначить задание.\n📤 Отправленные работы — ответы и время.\n✏️ Редактор — материалы учебника и их школьные классы.\n\n👇 Выбери действие.',
      {
        reply_markup: {
          keyboard: [
            ['📚 Учебник', '👥 Учебные группы'],
            ['📝 Мои ДЗ', '📤 Отправленные работы'],
            ['📊 Работы учеников', '✏️ Редактор'],
            ['👥 Ученики', '🔗 Пригласить ученика'],
            ['🏠 Главное меню'],
          ],
          resize_keyboard: true,
        },
      },
    );
    return true;
  }
  if (command === '/students') {
    if (!teacher) {
      send(state, id, 'Команда доступна репетитору.');
      return true;
    }
    const students = Object.values(state.users).filter(
      (student) =>
        admin ||
        student.teacherId === id ||
        Object.values(state.classes ?? {}).some((c) => c.ownerId === id && c.studentIds.includes(student.id)),
    );
    send(
      state,
      id,
      students.map((student) => `${student.name} · ${student.id}`).join('\n') ||
        'Учеников пока нет. Создай /invite',
    );
    return true;
  }
  return false;
}
