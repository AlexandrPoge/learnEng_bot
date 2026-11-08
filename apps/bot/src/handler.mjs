import { randomUUID, randomBytes } from 'node:crypto';
import { lessons } from '../../../packages/content/present-simple.mjs';
import { gradeAnswer, buildReport } from '../../../packages/domain/grading.mjs';

const menu = {
  keyboard: [['📚 Темы', '▶️ Практика'], ['📊 Мой прогресс', '❓ Помощь']],
  resize_keyboard: true,
};

function enqueue(state, method, payload) {
  state.outbox.push({ id: randomUUID(), method, payload });
}

// Telegram ограничивает текст сообщения. Отчёты делим, сохраняя все ответы.
function send(state, chatId, text, extra = {}) {
  const characters = [...text];
  while (characters.length) {
    enqueue(state, 'sendMessage', { chat_id: chatId, text: characters.splice(0, 1900).join(''), ...extra });
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

function startLesson(state, user) {
  if (user.activeAttempt) {
    send(state, user.id, 'Продолжим начатое задание. Для отмены: /cancel');
    ask(state, user);
    return;
  }
  const lesson = structuredClone(lessons[0]);
  const id = randomBytes(8).toString('hex');
  state.attempts[id] = {
    id, studentId: user.id, teacherId: user.teacherId ?? null,
    lesson, startedAt: new Date().toISOString(), completedAt: null, answers: [],
  };
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
  user.activeAttempt = null;
  const report = buildReport(attempt, user.name);
  send(state, user.id, `Практика завершена!\n\n${report}`, { reply_markup: menu });
  if (attempt.teacherId) send(state, attempt.teacherId, `Новое выполненное задание\n\n${report}`);
}

export function handleUpdate(state, update, teacherIds = []) {
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
  const teacher = teacherIds.includes(id);

  if (callback) {
    enqueue(state, 'answerCallbackQuery', { callback_query_id: callback.id });
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
  if (command === '/whoami') return send(state, id, `Твой Telegram ID: ${id}\nРоль: ${teacher ? 'репетитор' : 'ученик'}`);
  if (command === '/start' || command === '/help' || text === '❓ Помощь') {
    send(state, id, 'Добро пожаловать!\n/topics — объяснение темы\n/practice — начать или продолжить практику\n/progress — результаты\n/cancel — отменить текущую попытку\n/join КОД — подключиться к репетитору и отправлять ему ответы на будущие задания\n/whoami — твой ID' +
      (teacher ? '\n\nРепетитору:\n/invite — одноразовый код ученику (24 часа)\n/students — мои ученики\n/results — последние работы моих учеников' : ''), { reply_markup: menu });
  } else if (command === '/topics' || text === '📚 Темы') {
    send(state, id, `${lessons[0].title} · ${lessons[0].level}\n\n${lessons[0].theory}\n\nНачать: /practice`);
  } else if (command === '/practice' || text === '▶️ Практика') {
    startLesson(state, user);
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
    if (!invite || invite.expiresAt < Date.now() || !teacherIds.includes(invite.teacherId) || invite.teacherId === id) {
      return send(state, id, 'Код недействителен. Попроси новый у репетитора.');
    }
    if (user.teacherId) return send(state, id, 'Ты уже подключён к репетитору.');
    user.teacherId = invite.teacherId;
    delete state.invites[argument];
    send(state, id, 'Ты подключён! Ответы на новые задания будут отправляться репетитору.');
    send(state, user.teacherId, `Подключился ученик: ${user.name}`);
  } else if (command === '/students' || command === '/results') {
    if (!teacher) return send(state, id, 'Команда доступна репетитору.');
    const students = Object.values(state.users).filter((student) => student.teacherId === id);
    if (command === '/students') send(state, id, students.map((student) => student.name).join('\n') || 'Учеников пока нет. Создай /invite');
    else {
      const attempts = Object.values(state.attempts).filter((attempt) => attempt.teacherId === id && attempt.completedAt).slice(-5);
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
