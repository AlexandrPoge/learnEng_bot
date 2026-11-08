import { randomUUID, randomBytes } from 'node:crypto';
import { gradeAnswer, buildReport } from '../../../packages/domain/grading.mjs';
import { rolesFor } from '../../../packages/domain/roles.mjs';
import { availableLessons, findLesson, handleEditor } from './editor.mjs';
import { parseDeadline } from '../../../packages/domain/deadline.mjs';

const menu = {
  keyboard: [['📚 Темы', '▶️ Практика'], ['📝 Домашние задания'], ['📊 Мой прогресс', '❓ Помощь']],
  resize_keyboard: true,
};

function enqueue(state, method, payload, requiredTeacher = false) {
  state.outbox.push({ id: randomUUID(), method, payload, requiredTeacher });
}

// Telegram ограничивает текст сообщения. Отчёты делим, сохраняя все ответы.
function send(state, chatId, text, extra = {}) {
  const { requiredTeacher = false, ...telegramExtra } = extra;
  const characters = [...text];
  while (characters.length) {
    enqueue(state, 'sendMessage', { chat_id: chatId, text: characters.splice(0, 1900).join(''), ...telegramExtra }, requiredTeacher);
  }
}

function ask(state, user) {
  const attempt = state.attempts[user.activeAttempt];
  const index = attempt.answers.length;
  const question = attempt.lesson.questions[index];
  const extra = question.type === 'choice' ? {
    reply_markup: { inline_keyboard: question.options.map((option, optionIndex) => [{
      text: option, callback_data: `a:${attempt.id}:${index}:${optionIndex}`,
    }]) },
  } : {};
  send(state, user.id, `${index + 1}/${attempt.lesson.questions.length}. ${question.prompt}`, extra);
}

function showCatalog(state, user, level, page = 0) {
  const lessons = availableLessons(state);
  const levels = [...new Set(lessons.map((item) => item.level))].sort();
  if (!level) {
    send(state, user.id, `Библиотека: ${lessons.length} тем. Выбери уровень.\nУровни — ориентир для обучения.\n✅ — тема уже пройдена, это не оценка владения языком.`, {
      reply_markup: { inline_keyboard: levels.map((value) => [{ text: `${value} · ${lessons.filter((item) => item.level === value).length} тем`, callback_data: `l:${value}:0` }]) },
    });
    return;
  }
  if (!levels.includes(level)) return send(state, user.id, 'Этот уровень пока не добавлен. Доступные уровни: /topics');
  const items = lessons.filter((item) => item.level === level);
  const pageCount = Math.ceil(items.length / 5);
  if (!Number.isInteger(page) || page < 0 || page >= pageCount) return send(state, user.id, 'Страница не найдена. Открой /topics');
  const completed = new Set(Object.values(state.attempts).filter((item) => item.studentId === user.id && item.completedAt).map((item) => item.lesson.id));
  const rows = items.slice(page * 5, page * 5 + 5).map((item) => [{
    text: `${completed.has(item.id) ? '✅ ' : ''}${item.title}`, callback_data: `t:${item.id}`,
  }]);
  const navigation = [];
  if (page > 0) navigation.push({ text: '← Назад', callback_data: `l:${level}:${page - 1}` });
  if (page + 1 < pageCount) navigation.push({ text: 'Далее →', callback_data: `l:${level}:${page + 1}` });
  if (navigation.length) rows.push(navigation);
  rows.push([{ text: 'Все уровни', callback_data: 'levels' }]);
  send(state, user.id, `${level} · страница ${page + 1}/${pageCount}\nВыбери тему:`, { reply_markup: { inline_keyboard: rows } });
}

function showLesson(state, user, id) {
  const lesson = findLesson(state, id);
  if (!lesson) return send(state, user.id, 'Тема не найдена. Выбери тему: /topics');
  user.selectedLesson = id;
  send(state, user.id, `${lesson.title} · ${lesson.level} · около ${lesson.estimatedMinutes} мин\n\n${lesson.theory}`, {
    reply_markup: { inline_keyboard: [
      [{ text: '▶️ Практика по этой теме', callback_data: `p:${id}` }],
      [{ text: `Другие темы ${lesson.level}`, callback_data: `l:${lesson.level}:0` }],
    ] },
  });
}

function startLesson(state, user, lessonId, assignment) {
  if (state.editors?.[user.id]?.step) return send(state, user.id, 'Сначала закончи вопрос в редакторе или закрой черновик: /discard');
  const selected = assignment?.lesson ?? findLesson(state, lessonId ?? user.selectedLesson ?? 'present-simple');
  if (!selected) return send(state, user.id, 'Тема не найдена. Выбери тему: /topics');
  if (user.activeAttempt) {
    send(state, user.id, `Продолжим начатое задание: ${state.attempts[user.activeAttempt].lesson.title}. Для смены темы отмени попытку: /cancel`);
    ask(state, user);
    return;
  }
  const lesson = structuredClone(selected);
  user.selectedLesson = lesson.id;
  const id = randomBytes(8).toString('hex');
  state.attempts[id] = {
    id, studentId: user.id, teacherId: user.teacherId ?? null,
    assignmentId: assignment?.id ?? null,
    lesson, startedAt: new Date().toISOString(), completedAt: null, answers: [],
  };
  if (assignment) state.attempts[id].teacherId = assignment.teacherId;
  user.activeAttempt = id;
  send(state, user.id, `${lesson.title} · ${lesson.level}\n\n${lesson.theory}`);
  ask(state, user);
}

function acceptAnswer(state, user, value) {
  const attempt = state.attempts[user.activeAttempt];
  const question = attempt.lesson.questions[attempt.answers.length];
  const correct = gradeAnswer(question, value);
  attempt.answers.push({ questionId: question.id, value, correct });
  send(state, user.id, `${correct ? '✅ Верно!' : `❌ Правильно: ${question.accepted[0]}`}\n${question.explanation}`);
  if (attempt.answers.length < attempt.lesson.questions.length) return ask(state, user);
  attempt.completedAt = new Date().toISOString();
  const assignment = state.assignments?.[attempt.assignmentId];
  if (assignment) {
    assignment.completedAt = attempt.completedAt;
    assignment.attemptId = attempt.id;
    attempt.deadline = assignment.deadline;
    attempt.late = Date.parse(attempt.completedAt) > Date.parse(assignment.deadline);
  }
  user.activeAttempt = null;
  const report = buildReport(attempt, user.name);
  send(state, user.id, `Практика завершена!\n\n${report}`, { reply_markup: menu });
  if (attempt.teacherId) send(state, attempt.teacherId, `Новое выполненное задание\n\n${report}`, { requiredTeacher: true });
}

export function handleUpdate(state, update, teacherIds = [], adminIds = []) {
  if (!Number.isSafeInteger(update.update_id) || update.update_id < state.offset) return;
  state.offset = update.update_id + 1;
  const callback = update.callback_query;
  const message = callback?.message ?? update.message;
  const from = callback?.from ?? message?.from;
  // Учебные ответы и отчёты принимаем только в личном чате.
  if (!from || from.is_bot || message?.chat?.type !== 'private' || message.chat.id !== from.id) return;
  const id = String(from.id);
  const user = state.users[id] ??= { id, name: from.first_name || 'Ученик', activeAttempt: null };
  user.name = (from.first_name || 'Ученик').slice(0, 80);
  const roles = rolesFor(state, teacherIds, adminIds);
  const teacher = roles.isTeacher(id);
  const admin = roles.isAdmin(id);

  if (callback) {
    enqueue(state, 'answerCallbackQuery', { callback_query_id: callback.id });
    const data = callback.data ?? '';
    if (data === 'levels') return showCatalog(state, user);
    const homeworkMatch = /^h:([a-f0-9]{16})$/u.exec(data);
    if (homeworkMatch) {
      const assignment = state.assignments?.[homeworkMatch[1]];
      if (!assignment || assignment.studentId !== id || assignment.completedAt) return send(state, id, 'Это задание недоступно или уже сдано. /homework');
      return startLesson(state, user, assignment.lesson.id, assignment);
    }
    const catalogMatch = /^l:(A1|A2|B1|B2|C1|C2):(\d+)$/u.exec(data);
    if (catalogMatch) return showCatalog(state, user, catalogMatch[1], Number(catalogMatch[2]));
    const topicMatch = /^(t|p):([a-z0-9-]{1,40})$/u.exec(data);
    if (topicMatch) return topicMatch[1] === 't' ? showLesson(state, user, topicMatch[2]) : startLesson(state, user, topicMatch[2]);
    const [, attemptId, index, optionIndex] = /^a:([a-f0-9]{16}):(\d+):(\d+)$/u.exec(callback.data ?? '') ?? [];
    const attempt = state.attempts[user.activeAttempt];
    if (!attempt || attempt.id !== attemptId || attempt.answers.length !== Number(index)) {
      send(state, id, 'Эта кнопка уже неактуальна. Открой текущий вопрос: /practice');
      return;
    }
    const question = attempt.lesson.questions[Number(index)];
    const answer = question.type === 'choice' ? question.options[Number(optionIndex)] : undefined;
    if (answer !== undefined) acceptAnswer(state, user, answer);
    return;
  }

  const text = message.text?.trim();
  if (!text) { send(state, id, 'Сейчас принимаю текстовые ответы и кнопки. /help'); return; }
  const [rawCommand, argument] = text.split(/\s+/u);
  const command = rawCommand.split('@')[0].toLowerCase();
  if (['/admin', '/add_teacher', '/remove_teacher'].includes(command)) {
    if (!admin) return send(state, id, 'Команда доступна администратору.');
    if (command === '/admin') return send(state, id, `Права администратора: все материалы, все ученики и результаты, роли, история и восстановление.\n/add_teacher ID\n/remove_teacher ID\n/editor — редактор уроков\n/students — все ученики\n/results — последние работы\nРепетиторы: ${roles.teacherIds.join(', ') || 'нет'}`);
    if (!/^[1-9]\d*$/u.test(argument ?? '')) return send(state, id, 'Укажи числовой Telegram ID.');
    if (roles.isAdmin(argument)) return send(state, id, 'Права администратора задаются в ADMIN_IDS.');
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
    return;
  }
  if (handleEditor(state, user, text, { teacher, admin, send: (value) => send(state, id, value) })) return;
  if (command === '/assign') {
    if (!teacher) return send(state, id, 'Назначение доступно репетитору или администратору.');
    const [, studentId, lessonId, due] = text.split(/\s+/u);
    const student = state.users[studentId];
    const lesson = findLesson(state, lessonId);
    const deadline = parseDeadline(due);
    if (!student || (!admin && student.teacherId !== id)) return send(state, id, 'Ученик не найден или не подключён к тебе. /students');
    if (!lesson || !deadline || Date.parse(deadline) <= Date.now()) return send(state, id, 'Формат: /assign ID_УЧЕНИКА ID_ТЕМЫ ГГГГ-ММ-ДДTЧЧ:ММ+03:00\nНужна существующая тема и будущий срок с часовым поясом.');
    state.assignments ??= {};
    const assignmentId = randomBytes(8).toString('hex');
    state.assignments[assignmentId] = { id: assignmentId, studentId, teacherId: id, lesson: structuredClone(lesson), deadline, createdAt: new Date().toISOString(), completedAt: null };
    send(state, id, `Задание назначено: ${student.name} · ${lesson.title}\nСрок: ${due}`);
    send(state, studentId, `Новое домашнее задание: ${lesson.title}\nСрок: ${due}\nПрактика с объяснениями после каждого ответа. Результат получит репетитор.`, { reply_markup: { inline_keyboard: [[{ text: 'Начать задание', callback_data: `h:${assignmentId}` }]] } });
    return;
  }
  if (command === '/homework' || text === '📝 Домашние задания') {
    const assignments = Object.values(state.assignments ?? {}).filter((item) => item.studentId === id);
    if (!assignments.length) return send(state, id, 'Домашних заданий пока нет. Можно потренироваться: /topics');
    for (const item of assignments.slice(-10)) send(state, id, `${item.lesson.title}\nСрок (UTC): ${item.deadline}\n${item.completedAt ? '✅ Сдано' : Date.now() > Date.parse(item.deadline) ? 'Срок прошёл, ещё можно сдать' : 'Ожидает выполнения'}`, item.completedAt ? {} : { reply_markup: { inline_keyboard: [[{ text: 'Открыть', callback_data: `h:${item.id}` }]] } });
    return;
  }
  if (command === '/whoami') return send(state, id, `Твой Telegram ID: ${id}\nРоль: ${admin ? 'администратор' : teacher ? 'репетитор' : 'ученик'}`);
  if (command === '/start' || command === '/help' || text === '❓ Помощь') {
    send(state, id, 'Добро пожаловать!\n/topics — каталог тем по уровням\n/topics A1 — темы уровня\n/lesson to-be — открыть конкретную тему\n/practice — практика по выбранной теме или продолжение\n/practice past-simple — практика по указанной теме\n/progress — результаты\n/cancel — отменить текущую попытку\n/join КОД — подключиться к репетитору и отправлять ему ответы на будущие задания\n/whoami — твой ID' +
      '\n/homework — мои домашние задания' + (teacher ? '\n\nРепетитору:\n/editor — создать или исправить урок\n/invite — одноразовый код ученику (24 часа)\n/students — ученики и ID\n/assign ID_УЧЕНИКА ID_ТЕМЫ СРОК — назначить ДЗ\n/results — последние работы' : '') + (admin ? '\n/admin — управление ролями и полный доступ' : ''), { reply_markup: menu });
  } else if (command === '/topics' || text === '📚 Темы') {
    showCatalog(state, user, command === '/topics' ? argument?.toUpperCase() : undefined);
  } else if (command === '/lesson') {
    if (!argument) return showCatalog(state, user);
    showLesson(state, user, argument);
  } else if (command === '/practice' || text === '▶️ Практика') {
    startLesson(state, user, command === '/practice' ? argument : undefined);
  } else if (command === '/cancel') {
    if (user.activeAttempt) state.attempts[user.activeAttempt].cancelledAt = new Date().toISOString();
    user.activeAttempt = null;
    send(state, id, 'Можно начать новую практику: /practice');
  } else if (command === '/invite') {
    if (!teacher) return send(state, id, 'Команда доступна репетитору.');
    // Один действующий код на репетитора.
    for (const [code, invite] of Object.entries(state.invites)) if (invite.teacherId === id) delete state.invites[code];
    const code = randomBytes(12).toString('hex');
    state.invites[code] = { teacherId: id, expiresAt: Date.now() + 86400000 };
    send(state, id, `Одноразовый код на 24 часа. Передай ученику команду:\n/join ${code}\nПосле подключения ты получишь его ответы на будущие задания.`);
  } else if (command === '/join') {
    const invite = state.invites[argument];
    if (!invite || invite.expiresAt < Date.now() || !roles.isTeacher(invite.teacherId) || invite.teacherId === id) {
      return send(state, id, 'Код недействителен. Попроси новый у репетитора.');
    }
    if (user.teacherId) return send(state, id, 'Ты уже подключён к репетитору.');
    user.teacherId = invite.teacherId;
    delete state.invites[argument];
    send(state, id, 'Ты подключён! Ответы на новые задания будут отправляться репетитору.');
    send(state, user.teacherId, `Подключился ученик: ${user.name}`);
  } else if (command === '/students' || command === '/results') {
    if (!teacher) return send(state, id, 'Команда доступна репетитору.');
    const students = Object.values(state.users).filter((student) => admin || student.teacherId === id);
    if (command === '/students') send(state, id, students.map((student) => `${student.name} · ${student.id}`).join('\n') || 'Учеников пока нет. Создай /invite');
    else {
      const attempts = Object.values(state.attempts).filter((attempt) => (admin || attempt.teacherId === id) && attempt.completedAt).slice(-5);
      if (!attempts.length) send(state, id, 'Выполненных заданий пока нет.');
      for (const attempt of attempts) send(state, id, buildReport(attempt, state.users[attempt.studentId].name));
    }
  } else if (command === '/progress' || text === '📊 Мой прогресс') {
    const attempts = Object.values(state.attempts).filter((attempt) => attempt.studentId === id && attempt.completedAt);
    send(state, id, attempts.length ? attempts.slice(-10).map((attempt) => `${attempt.lesson.title}: ${attempt.answers.filter((answer) => answer.correct).length}/${attempt.lesson.questions.length}`).join('\n') : 'Результатов пока нет. Начать: /practice');
  } else if (text.startsWith('/')) {
    send(state, id, 'Неизвестная команда. /help');
  } else if (user.activeAttempt) {
    const attempt = state.attempts[user.activeAttempt];
    if (attempt.lesson.questions[attempt.answers.length].type === 'choice') return send(state, id, 'Выбери вариант кнопкой под вопросом.');
    if (text.length > 300) return send(state, id, 'Ответ слишком длинный. Впиши только пропущенное слово.');
    acceptAnswer(state, user, text);
  } else send(state, id, 'Выбери тему или начни практику: /practice', { reply_markup: menu });
}
