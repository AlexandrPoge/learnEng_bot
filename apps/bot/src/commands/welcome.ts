import { send } from '../ui/messages.js';
import { showHome, showMode } from '../ui/home.js';
import type { CommandContext } from '../routing/context.js';
import { mainMenu } from '../navigation.js';

export function handleWelcomeCommand(request: CommandContext): boolean {
  const { state, id, user, teacher, admin, access, text, command } = request;
  if (command === '/start' || command === '/help' || text === '❓ Помощь') {
    if (command === '/start' && teacher && state.teacherWelcome?.[id]) {
      send(
        state,
        id,
        'Вам выданы права репетитора 👩‍🏫\n/editor — уроки и редактор\n/invite — пригласить ученика\n/students — ученики\n/results — результаты',
      );
      delete state.teacherWelcome[id];
    }
    if (command === '/start') {
      showHome(state, user, access);
      if (!user.learningMode) showMode(state, user);
      return true;
    }
    send(
      state,
      id,
      'Добро пожаловать!\n/textbook — учебник: школьные классы и уровни\n/school — темы по школьным классам\n/classes — учебные группы репетитора\n/join_class КОД — вступить в учебную группу\n/topics — каталог тем по уровням\n/topics A1 — темы уровня\n/lesson to-be — открыть конкретную тему\n/practice — практика по выбранной теме или продолжение\n/practice past-simple — практика по указанной теме\n/progress — результаты\n/cancel — отменить текущую попытку\n/join КОД — подключиться к репетитору и отправлять ему ответы на будущие задания\n/whoami — твой ID' +
        '\n/homework — мои домашние задания\n/continue — продолжить с места остановки\n/mode — выбрать подачу\n/menu — главное меню\n\n⬇️ Объяснения приходят новыми карточками внизу чата.' +
        (teacher
          ? '\n\n👩‍🏫 /teacher — кабинет репетитора\n/editor — создать или исправить урок\n/invite — одноразовый код ученику (24 часа)\n/students — ученики и ID\n/assign ID_УЧЕНИКА ID_ТЕМЫ СРОК — назначить ДЗ\n/results — последние работы'
          : '') +
        (admin ? '\n/admin — управление ролями и полный доступ' : ''),
      { reply_markup: mainMenu(access) },
    );
    return true;
  }
  return false;
}
