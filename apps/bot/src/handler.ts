import { randomUUID, randomBytes } from 'node:crypto';
import { gradeAnswer, buildReport } from '../../../packages/domain/grading.js';
import { rolesFor } from '../../../packages/domain/roles.js';
import { availableLessons, findLesson, handleEditor } from './editor.js';
import { parseDeadline } from '../../../packages/domain/deadline.js';
import { mainMenu, topicButtons, topicCard, sectionCard, textActions } from './navigation.js';
import { lessonSections } from '../../../packages/content/presentation.js';
import { splitMessage, richText, readable } from './format.js';
import { handleClassrooms } from './classrooms.js';
import { ruleImagePages } from './rule-images.js';
import { recordActivity, timeSummary } from '../../../packages/domain/timing.js';
import type { BotState, User, Attempt, Assignment, Access, Category, Level, Section, RichText, TelegramPayload, TelegramResults, TelegramUpdate, ReplyMarkup } from '../../../packages/domain/types.js';

function enqueue(state: BotState, method: keyof TelegramResults, payload: TelegramPayload, requiredTeacher = false) {
  state.outbox.push({ id: randomUUID(), method, payload, requiredTeacher });
}

// Telegram ограничивает текст сообщения. Отчёты делим, сохраняя все ответы.
function send(state: BotState, chatId: string, text: string | RichText, extra: TelegramPayload & { requiredTeacher?: boolean } = {}) {
  const { requiredTeacher = false, ...telegramExtra } = extra;
  const content = typeof text === 'string' ? { text, entities: [] } : text;
  const chunks = splitMessage(content.text, content.entities);
  for (const [index, chunk] of chunks.entries()) {
    const options = { ...telegramExtra };
    if (index !== chunks.length - 1) delete options.reply_markup;
    enqueue(state, 'sendMessage', { chat_id: chatId, ...chunk, ...options }, requiredTeacher);
  }
}

function ask(state: BotState, user: User) {
  const attempt = state.attempts[user.activeAttempt!];
  recordActivity(attempt);
  const index = attempt.answers.length;
  const question = attempt.lesson.questions[index];
  const choices = question.type === 'choice' ? question.options.map((option, optionIndex) => [{
      text: `${optionIndex + 1}. ${option}`, callback_data: `a:${attempt.id}:${index}:${optionIndex}`,
    }]) : [];
  const extra = { reply_markup: { inline_keyboard: [...choices, ...(attempt.mode === 'test' ? [] : [[{ text: '💡 Подсказка', callback_data: `hint:${attempt.id}:${index}` }]])] } };
  send(state, user.id, richText().add(`✏️ ${attempt.lesson.title}`, 'bold')
    .add(`\n\n${'●'.repeat(index)}${'○'.repeat(attempt.lesson.questions.length - index)}\nВопрос ${index + 1} из ${attempt.lesson.questions.length}`)
    .add('\n\n').add(question.prompt, 'bold')
    .add(`\n\n${question.type === 'choice' ? '👇 Выбери ответ кнопкой.' : '⌨️ Напиши пропущенное слово.'}`).build(), extra);
}

function panel(state: BotState, user: User, text: string | RichText, replyMarkup: ReplyMarkup, messageId?: number) {
  // Изменение старой карточки не прокручивает Telegram. Новый экран всегда
  // приходит вниз чата, а навигация предыдущего экрана отключается.
  if (messageId) enqueue(state, 'editMessageReplyMarkup', { chat_id: user.id, message_id: messageId, reply_markup: { inline_keyboard: [] } });
  send(state, user.id, text, { reply_markup: replyMarkup, link_preview_options: { is_disabled: true } });
}

function showMode(state: BotState, user: User, messageId?: number) {
  panel(state, user, '⚙️ Как тебе удобнее учиться?\n\n🧒 Для детей — простые подсказки и короткие шаги.\n🧑 Для взрослых — краткие объяснения и формулы.\n\nТемы и задания одинаковые. Выбор можно изменить здесь в любой момент.', { inline_keyboard: [
    [{ text: '🧒 Для детей', callback_data: 'mode:child' }, { text: '🧑 Для взрослых', callback_data: 'mode:adult' }],
    [{ text: '🏠 Главное меню', callback_data: 'home' }],
  ] }, messageId);
}

function showHome(state: BotState, user: User, access: Access) {
  delete user.workspace;
  send(state, user.id, `🌟 Английский шаг за шагом\n\n📚 Выбери тему A1 или A2.\n📖 Прочитай короткое правило.\n💡 Посмотри примеры.\n✏️ Попробуй ответить на 5 вопросов.\n\n${user.learningMode === 'adult' ? '🧑 Подача для взрослых' : '🧒 Простая подача для детей'}\n👇 Всё нужное — на кнопках внизу.`, { reply_markup: mainMenu(access) });
}

const categoryLabels: Record<Category, string> = { foundation: '🔤 Первые шаги', grammar: '📖 Грамматика', vocabulary: '🧺 Слова', situations: '💬 Общение' };

function catalogReturn(user: User, level: Level) {
  if (user.classContext) return `class:topics:${user.classContext}:0`;
  const context = user.catalog;
  return context?.level === level ? `${context.category ? `g:${level}:${context.category}` : `l:${level}`}:${context.page}` : `l:${level}:0`;
}

function showCatalog(state: BotState, user: User, level?: Level, page = 0, messageId?: number, category?: Category) {
  delete user.classContext;
  const lessons = availableLessons(state);
  const levels = [...new Set(lessons.map((item) => item.level))].sort();
  if (!level) {
    panel(state, user, `📚 Библиотека английского\n\n🌱 A1 — первые шаги\n🌿 A2 — продолжаем учиться\n\n${lessons.length} тем · выбирай подходящую ниже.\n✅ означает, что ты уже закончил практику по теме.`, {
      inline_keyboard: [...levels.map((value) => [{ text: `${value === 'A1' ? '🌱' : '🌿'} ${value} · ${lessons.filter((item) => item.level === value).length} тем`, callback_data: `l:${value}:0` }]), [{ text: '🏠 Главное меню', callback_data: 'home' }]],
    }, messageId);
    return;
  }
  if (!levels.includes(level)) return send(state, user.id, 'Этот уровень пока не добавлен. Доступные уровни: /topics');
  const levelItems = lessons.filter((item) => item.level === level);
  const items = levelItems.filter((item) => !category || (item.category ?? 'grammar') === category);
  const pageCount = Math.ceil(items.length / 5);
  if (!Number.isInteger(page) || page < 0 || page >= pageCount) return send(state, user.id, 'Страница не найдена. Открой /topics');
  user.catalog = { level, page, category: category ?? null };
  const completed = new Set(Object.values(state.attempts).filter((item) => item.studentId === user.id && item.completedAt).map((item) => item.lesson.id));
  const rows = items.slice(page * 5, page * 5 + 5).map((item) => [{
    text: `${completed.has(item.id) ? '✅' : item.icon ?? '📘'} ${item.title}`, callback_data: `t:${item.id}`,
  }]);
  const navigation = [];
  const prefix = category ? `g:${level}:${category}` : `l:${level}`;
  if (page > 0) navigation.push({ text: '← Назад', callback_data: `${prefix}:${page - 1}` });
  if (page + 1 < pageCount) navigation.push({ text: 'Далее →', callback_data: `${prefix}:${page + 1}` });
  if (navigation.length) rows.push(navigation);
  rows.push([{ text: '🧭 Выбрать раздел курса', callback_data: `groups:${level}` }]);
  if (category) rows.push([{ text: `📚 Все темы ${level}`, callback_data: `l:${level}:0` }]);
  rows.push([{ text: '📚 Все уровни', callback_data: 'levels' }, { text: '🏠 Меню', callback_data: 'home' }]);
  panel(state, user, `📚 Темы ${level}\n\n${category ? `${categoryLabels[category]}\n` : ''}📄 Страница ${page + 1} из ${pageCount}\n\n👇 Выбери тему или раздел курса.`, { inline_keyboard: rows }, messageId);
}

function showGroups(state: BotState, user: User, level: Level, messageId?: number) {
  const items = availableLessons(state).filter((item) => item.level === level);
  const groups = (Object.keys(categoryLabels) as Category[]).filter((category) => items.some((item) => (item.category ?? 'grammar') === category));
  panel(state, user, `🧭 Курс ${level}\n\n🔤 Первые шаги — алфавит, знакомство, числа.\n\n📖 Грамматика — как строить предложения.\n\n🧺 Слова — семья, дом, еда и другие темы.\n\n💬 Общение — полезные ситуации.\n\n👇 Выбери раздел.`, { inline_keyboard: [...groups.map((category) => [{ text: `${categoryLabels[category]} · ${items.filter((item) => (item.category ?? 'grammar') === category).length} тем`, callback_data: `g:${level}:${category}:0` }]), [{ text: '📚 Все темы', callback_data: `l:${level}:0` }, { text: '🏠 Меню', callback_data: 'home' }]] }, messageId);
}

function accessibleLesson(state: BotState, user: User, id: string | undefined) {
  if (!id) return undefined;
  const active = user.activeAttempt && state.attempts[user.activeAttempt];
  if (active && active.lesson.id === id) return active.lesson;
  return findLesson(state, id) ?? Object.values(state.assignments ?? {}).reverse().find(a => a.studentId === user.id && a.lesson.id === id)?.lesson;
}

function showLesson(state: BotState, user: User, id: string, messageId?: number) {
  const lesson = accessibleLesson(state, user, id);
  if (!lesson) return send(state, user.id, 'Тема не найдена. Выбери тему: /topics');
  user.selectedLesson = id;
  const page = Math.floor(availableLessons(state).filter((item) => item.level === lesson.level).findIndex((item) => item.id === id) / 5);
  panel(state, user, topicCard(lesson, user.learningMode !== 'adult'), topicButtons(lesson, page, user.classContext || user.catalog ? catalogReturn(user, lesson.level) : undefined), messageId);
}

function showSection(state: BotState, user: User, id: string, section: Section, page: number, messageId?: number) {
  const lesson = accessibleLesson(state, user, id);
  if (!lesson) return send(state, user.id, 'Тема не найдена. Открой 📚 Темы.');
  const card = sectionCard(lesson, section, page, user.learningMode !== 'adult');
  if (!card) return send(state, user.id, 'Эта карточка недоступна. Открой тему заново.');
  user.selectedLesson = id;
  user.reading = { lessonId: id, section, page, version: lesson.version };
  const pagination = [];
  if (page > 0) pagination.push({ text: '⬅️ Назад', callback_data: `s:${id}:${section}:${page - 1}` });
  if (page + 1 < card.pages) pagination.push({ text: 'Дальше ➡️', callback_data: `s:${id}:${section}:${page + 1}` });
  else if (section !== 'traps') pagination.push({ text: section === 'rule' ? '💡 К примерам' : '⚠️ К ловушкам', callback_data: `s:${id}:${section === 'rule' ? 'examples' : 'traps'}:0` });
  const buttons = [
    ...(pagination.length ? [pagination] : []),
    [{ text: '🗂 Разделы темы', callback_data: `t:${id}` }, { text: '✏️ Практика', callback_data: `p:${id}` }],
    [{ text: `📚 Темы ${lesson.level}`, callback_data: catalogReturn(user, lesson.level) }, { text: '🏠 Меню', callback_data: 'home' }],
  ];
  panel(state, user, card, { inline_keyboard: buttons }, messageId);
}

function showSources(state: BotState, user: User, id: string, messageId?: number) {
  const lesson = accessibleLesson(state, user, id);
  if (!lesson) return send(state, user.id, 'Тема не найдена. /topics');
  const resources = lesson.resources ?? [];
  const descriptions = resources.map((item, index) => `${index + 1}. ${item.kind === 'video' ? '🎬' : '📖'} ${item.title}\n${item.provider} · проверено ${item.checkedAt}\n${item.note}`);
  panel(state, user, `📍 ${lesson.level} → ${lesson.title}\n🎬 Видео и источники\n\n${descriptions.join('\n\n') || 'К этой теме пока нет дополнительных ссылок.'}\n\n💡 Это внешние страницы на английском. Сначала прочитай правило здесь, затем найди 2–3 знакомые фразы в материале. После видео вернись к примерам или практике.`, { inline_keyboard: [
    ...resources.map((item, index) => [{ text: `${item.kind === 'video' ? '🎬 Смотреть' : '📖 Читать'} ${index + 1}: ${item.title}`, url: item.url }]),
    [{ text: '🗂 К теме', callback_data: `t:${id}` }, { text: '✏️ Практика', callback_data: `p:${id}` }],
  ] }, messageId);
}

function startLesson(state: BotState, user: User, lessonId?: string, assignment?: Assignment, reviewFrom?: Attempt) {
  if (state.editors?.[user.id]?.step || state.editors?.[user.id]?.inputField || state.editors?.[user.id]?.awaitingPhoto || user.workspace) return send(state, user.id, 'Сначала закончи настройку /cancel_setup или черновик /discard.');
  const selected = reviewFrom ? { ...reviewFrom.lesson, questions: reviewFrom.lesson.questions.filter((_, index) => !reviewFrom.answers[index].correct) } : assignment?.lesson ?? accessibleLesson(state, user, lessonId ?? user.selectedLesson ?? 'present-simple');
  if (!selected) return send(state, user.id, 'Тема не найдена. Выбери тему: /topics');
  if (user.activeAttempt) {
    recordActivity(state.attempts[user.activeAttempt]);
    send(state, user.id, `Продолжим начатое задание: ${state.attempts[user.activeAttempt].lesson.title}. Для смены темы отмени попытку: /cancel`);
    ask(state, user);
    return;
  }
  const lesson = structuredClone(selected);
  if (!lesson.questions.length) return send(state, user.id, '🌟 В этой попытке нет ошибок для повторения. Можно выбрать другую тему.');
  user.selectedLesson = lesson.id;
  const id = randomBytes(8).toString('hex');
  state.attempts[id] = {
    id, studentId: user.id, teacherId: user.teacherId ?? null,
    assignmentId: assignment?.id ?? null,
    reviewOf: reviewFrom?.id ?? null,
    lesson, startedAt: new Date().toISOString(), lastActivityAt: new Date().toISOString(), engagedMs: 0,
    mode: assignment?.mode ?? 'practice', completedAt: null, answers: [],
  };
  if (assignment) state.attempts[id].teacherId = assignment.teacherId;
  if (reviewFrom) state.attempts[id].teacherId = reviewFrom.teacherId;
  user.activeAttempt = id;
  send(state, user.id, `${reviewFrom ? '🔁 Повторение ошибок' : assignment?.mode === 'test' ? '🧪 Проверочная' : '✏️ Практика'}: ${lesson.title}\n\n${lesson.questions.length} вопросов. ${assignment?.mode === 'test' ? 'Ответы сохраняются без подсказок. Разбор будет после сдачи.' : 'После каждого ответа будет объяснение.\n💛 Ошибаться можно — так мы учимся.'}\n📖 Вернуться к правилу: /lesson ${lesson.id}`);
  ask(state, user);
}

function acceptAnswer(state: BotState, user: User, value: string, access: Access) {
  const attempt = state.attempts[user.activeAttempt!];
  const question = attempt.lesson.questions[attempt.answers.length];
  const correct = gradeAnswer(question, value);
  recordActivity(attempt);
  attempt.answers.push({ questionId: question.id, value, correct });
  const feedback = richText().add(correct ? '✅ Верно!' : '💛 Давай разберёмся.', 'bold');
  if (!correct) feedback.add('\n\n✏️ Правильный ответ\n', 'bold').add(question.accepted[0], 'bold');
  feedback.add('\n\n💡 Объяснение\n', 'bold').add(readable(question.explanation));
  send(state, user.id, attempt.mode === 'test' ? '📩 Ответ сохранён.' : feedback.build());
  if (attempt.answers.length < attempt.lesson.questions.length) return ask(state, user);
  attempt.completedAt = new Date().toISOString();
  const assignment = attempt.assignmentId ? state.assignments?.[attempt.assignmentId] : undefined;
  if (assignment) {
    assignment.completedAt = attempt.completedAt;
    assignment.attemptId = attempt.id;
    attempt.deadline = assignment.deadline;
    attempt.late = Date.parse(attempt.completedAt) > Date.parse(assignment.deadline);
  }
  user.activeAttempt = null;
  const report = buildReport(attempt, user.name);
  const score = attempt.answers.filter((answer) => answer.correct).length;
  send(state, user.id, timeSummary(attempt));
  send(state, user.id, `🎉 Практика завершена!\n\n${attempt.lesson.icon ?? '📘'} ${attempt.lesson.title}\n✅ Верных ответов: ${score} из ${attempt.lesson.questions.length}\n\n${score === attempt.lesson.questions.length ? '🌟 Всё получилось!' : '🌱 Можно вернуться к примерам и попробовать ещё раз.'}`, { reply_markup: mainMenu(access) });
  send(state, user.id, '🧭 Что дальше?', { reply_markup: { inline_keyboard: [
    [{ text: '🔎 Разобрать ответы', callback_data: `review:${attempt.id}` }],
    ...(score < attempt.lesson.questions.length ? [[{ text: '🎯 Повторить только ошибки', callback_data: `repeat:${attempt.id}` }]] : []),
    [{ text: '🔁 Ещё раз', callback_data: `p:${attempt.lesson.id}` }, { text: '📚 Темы', callback_data: 'levels' }],
  ] } });
  if (attempt.teacherId) send(state, attempt.teacherId, `Новое выполненное задание\n\n${report}`, { requiredTeacher: true });
}

export function handleUpdate(state: BotState, update: TelegramUpdate, teacherIds: string[] = [], adminIds: string[] = []) {
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
  const access = { teacher, admin };
  const classroomContext = {
    teacher, admin, isTeacher: roles.isTeacher,
    send: (value: string, extra?: TelegramPayload) => send(state, id, value, extra),
    notify: (recipient: string, value: string, extra?: TelegramPayload) => send(state, recipient, value, extra),
    panel: (value: string, markup: ReplyMarkup) => panel(state, user, value, markup, callback?.message?.message_id),
    editor: (value: string) => { handleEditor(state, user, value, { teacher, admin, send: (v, extra) => send(state, id, v, extra) }); },
    topic: (topicId: string) => showLesson(state, user, topicId, message?.message_id),
  };

  if (callback) {
    user.searching = false;
    enqueue(state, 'answerCallbackQuery', { callback_query_id: callback.id, text: '⬇️ Результат появится внизу чата' });
    const data = callback.data ?? '';
    const messageId = message!.message_id;
    if (handleClassrooms(state, user, { data }, classroomContext)) return;
    if (data === 'home') return showHome(state, user, access);
    if (data === 'levels') return showCatalog(state, user, undefined, 0, messageId);
    if (data === 'mode') return showMode(state, user, messageId);
    const groupsMatch = /^groups:(A1|A2)$/u.exec(data);
    if (groupsMatch) return showGroups(state, user, groupsMatch[1] as Level, messageId);
    if (data === 'mode:child' || data === 'mode:adult') {
      user.learningMode = data === 'mode:child' ? 'child' : 'adult';
      send(state, id, user.learningMode === 'child' ? '🧒 Включена простая подача. Будем учиться небольшими шагами.' : '🧑 Включена подача для взрослых.');
      return showHome(state, user, access);
    }
    const sourceMatch = /^sources:([a-z0-9-]{1,40})$/u.exec(data);
    if (sourceMatch) return showSources(state, user, sourceMatch[1], messageId);
    const imageMatch = /^image:([a-z0-9-]{1,40}):(\d+)$/u.exec(data);
    if (imageMatch) {
      const lesson = accessibleLesson(state, user, imageMatch[1]);
      const page = Number(imageMatch[2]);
      const pages = lesson?.rulePhoto ? 1 : lesson ? ruleImagePages(lesson).length : 0;
      if (!lesson || !Number.isInteger(page) || page < 0 || page >= pages) return send(state, id, 'Карточка недоступна. /topics');
      if (messageId) enqueue(state, 'editMessageReplyMarkup', { chat_id: id, message_id: messageId, reply_markup: { inline_keyboard: [] } });
      const arrows = [];
      if (page > 0) arrows.push({ text: '⬅️ Назад', callback_data: `image:${lesson.id}:${page - 1}` });
      if (page + 1 < pages) arrows.push({ text: 'Дальше ➡️', callback_data: `image:${lesson.id}:${page + 1}` });
      state.outbox.push({ id: randomUUID(), method: 'sendPhoto', requiredTeacher: false,
        payload: { chat_id: id, ...(lesson.rulePhoto ? { photo: lesson.rulePhoto } : {}), caption: `🖼 ${lesson.title}\n🌱 ${lesson.level} · ${page + 1}/${pages}`, reply_markup: { inline_keyboard: [...(arrows.length ? [arrows] : []), [{ text: '📖 Правило текстом', callback_data: `s:${lesson.id}:rule:0` }, { text: '🗂 К теме', callback_data: `t:${lesson.id}` }]] } },
        ...(lesson.rulePhoto ? {} : { ruleCard: { lesson: structuredClone(lesson), page } }),
      });
      return;
    }
    const hintMatch = /^hint:([a-f0-9]{16}):(\d+)$/u.exec(data);
    if (hintMatch) {
      const attempt = user.activeAttempt ? state.attempts[user.activeAttempt] : undefined;
      if (!attempt || attempt.id !== hintMatch[1] || attempt.answers.length !== Number(hintMatch[2])) return send(state, id, 'Подсказка относится к прошлому вопросу. Продолжить: /practice');
      if (attempt.mode === 'test') return send(state, id, 'В проверочной подсказки закрыты. Разбор появится после сдачи.');
      recordActivity(attempt);
      attempt.hintsUsed ??= [];
      if (!attempt.hintsUsed.includes(attempt.answers.length)) attempt.hintsUsed.push(attempt.answers.length);
      const hintCard = richText().add('💡 Подсказка', 'bold').add(`\n\n${attempt.lesson.title}\n\n`)
        .add(readable(attempt.lesson.memory ?? lessonSections(attempt.lesson).rule[0]), 'code')
        .add('\n\n🧭 Как выбрать ответ\n', 'bold').add('1. Определи, о ком или о чём речь.\n2. Сравни форму с правилом.\n3. Вернись к вопросу и попробуй.').build();
      return panel(state, user, hintCard, { inline_keyboard: [[{ text: '✏️ Вернуться к вопросу', callback_data: `p:${attempt.lesson.id}` }]] });
    }
    const repeatMatch = /^repeat:([a-f0-9]{16})$/u.exec(data);
    if (repeatMatch) {
      const origin = state.attempts[repeatMatch[1]];
      if (!origin || origin.studentId !== id || !origin.completedAt) return send(state, id, 'Повторение доступно только для твоей завершённой попытки.');
      return startLesson(state, user, origin.lesson.id, undefined, origin);
    }
    const sectionMatch = /^s:([a-z0-9-]{1,40}):(rule|examples|traps):(\d+)$/u.exec(data);
    if (sectionMatch) return showSection(state, user, sectionMatch[1], sectionMatch[2] as Section, Number(sectionMatch[3]), messageId);
    const reviewMatch = /^review:([a-f0-9]{16})(?::(\d+))?$/u.exec(data);
    if (reviewMatch) {
      const attempt = state.attempts[reviewMatch[1]];
      const index = Number(reviewMatch[2] ?? 0);
      if (!attempt || attempt.studentId !== id || !attempt.completedAt || !attempt.answers[index]) return send(state, id, 'Разбор доступен после завершения твоей практики.');
      const answer = attempt.answers[index];
      const question = attempt.lesson.questions[index];
      const arrows = [];
      if (index > 0) arrows.push({ text: '⬅️ Назад', callback_data: `review:${attempt.id}:${index - 1}` });
      if (index + 1 < attempt.answers.length) arrows.push({ text: 'Дальше ➡️', callback_data: `review:${attempt.id}:${index + 1}` });
      return panel(state, user, `🔎 Разбор · ${index + 1}/${attempt.answers.length}\n\n${question.prompt}\n\n⌨️ Твой ответ: ${answer.value}\n${answer.correct ? '✅ Верно' : `✏️ Правильно: ${question.accepted[0]}`}\n\n💡 ${question.explanation}`, { inline_keyboard: [...(arrows.length ? [arrows] : []), [{ text: '🗂 Тема', callback_data: `t:${attempt.lesson.id}` }, { text: '📚 Все темы', callback_data: 'levels' }]] }, messageId);
    }
    const editMatch = /^edit:([a-z0-9-]{1,40})$/u.exec(data);
    const editPage = /^editlist:(\d+)$/u.exec(data);
    const editorQuestion = /^editor:(q|replace|remove):([a-z0-9-]{1,32})$/u.exec(data);
    if (editorQuestion) {
      const commands = { q: '/question', replace: '/edit_question', remove: '/remove_question' };
      return handleEditor(state, user, `${commands[editorQuestion[1] as keyof typeof commands]} ${editorQuestion[2]}`, { teacher, admin, send: (value, extra) => send(state, id, value, extra) });
    }
    const editActions: Record<string, string> = { 'editor:type:choice': 'choice', 'editor:type:text': 'text', 'editor:photo': '/attach_rule', 'editor:no-photo': '/remove_rule_photo', 'editor:preview': '/preview', 'editor:publish': '/publish', 'editor:discard': '/discard', 'editor:add': '/add_question', 'editor:title': '/title', 'editor:rule': '/rule', 'editor:examples': '/examples', 'editor:traps': '/traps', 'editor:help': '/editor_help' };
    if (data.startsWith('editor:type:') && state.editors?.[id]?.step !== 'type') return send(state, id, 'Выбор типа уже завершён. Продолжи текущий вопрос.');
    const editorExtra: Record<string, string> = { 'editor:back': '/editor', 'editor:questions': '/questions', 'editor:level': '/level', 'editor:level:A1': '/level A1', 'editor:level:A2': '/level A2' };
    if (Object.hasOwn(editorExtra, data)) return handleEditor(state, user, editorExtra[data], { teacher, admin, send: (value, extra) => send(state, id, value, extra) });
    if (editMatch || editPage || Object.hasOwn(editActions, data)) return handleEditor(state, user, editMatch ? `/edit ${editMatch[1]}` : editPage ? `/editor ${editPage[1]}` : editActions[data], { teacher, admin, send: (value, extra) => send(state, id, value, extra) });
    const homeworkMatch = /^h:([a-f0-9]{16})$/u.exec(data);
    if (homeworkMatch) {
      const assignment = state.assignments?.[homeworkMatch[1]];
      if (!assignment || assignment.studentId !== id || assignment.completedAt) return send(state, id, 'Это задание недоступно или уже сдано. /homework');
      return startLesson(state, user, assignment.lesson.id, assignment);
    }
    const catalogMatch = /^l:(A1|A2|B1|B2|C1|C2):(\d+)$/u.exec(data);
    if (catalogMatch) return showCatalog(state, user, catalogMatch[1] as Level, Number(catalogMatch[2]), messageId);
    const groupMatch = /^g:(A1|A2):(foundation|grammar|vocabulary|situations):(\d+)$/u.exec(data);
    if (groupMatch) return showCatalog(state, user, groupMatch[1] as Level, Number(groupMatch[3]), messageId, groupMatch[2] as Category);
    const topicMatch = /^(t|p):([a-z0-9-]{1,40})$/u.exec(data);
    if (topicMatch) return topicMatch[1] === 't' ? showLesson(state, user, topicMatch[2], messageId) : startLesson(state, user, topicMatch[2]);
    const [, attemptId, index, optionIndex] = /^a:([a-f0-9]{16}):(\d+):(\d+)$/u.exec(callback.data ?? '') ?? [];
    const attempt = user.activeAttempt ? state.attempts[user.activeAttempt] : undefined;
    if (!attempt || attempt.id !== attemptId || attempt.answers.length !== Number(index)) {
      send(state, id, 'Эта кнопка уже неактуальна. Открой текущий вопрос: /practice');
      return;
    }
    const question = attempt.lesson.questions[Number(index)];
    const answer = question.type === 'choice' ? question.options[Number(optionIndex)] : undefined;
    if (answer !== undefined) acceptAnswer(state, user, answer, access);
    return;
  }

  const incoming = message?.text?.trim();
  const text = incoming && Object.hasOwn(textActions, incoming) ? textActions[incoming] : incoming;
  if (!text) {
    const draft = state.editors?.[id];
    const photo = message?.photo?.at(-1);
    if (photo && teacher && draft?.awaitingPhoto) {
      draft.lesson.rulePhoto = photo.file_id; delete draft.awaitingPhoto;
      send(state, id, '✅ Картинка сохранена в черновике. Опубликуй изменения, когда всё готово.');
      return handleEditor(state, user, '/editor', { teacher, admin, send: (value, extra) => send(state, id, value, extra) });
    }
    send(state, id, photo ? 'Для картинки сначала открой черновик и нажми «🖼 Своя картинка правила».' : 'Используй текстовые ответы и кнопки. /help'); return;
  }
  if (text.startsWith('/')) user.searching = false;
  if (handleClassrooms(state, user, { text }, classroomContext)) return;
  const [rawCommand, argument] = text.split(/\s+/u);
  const command = rawCommand.split('@')[0].toLowerCase();
  if (command === '/search' || (user.searching && !text.startsWith('/'))) {
    const query = command === '/search' ? text.slice(rawCommand.length).trim() : text;
    user.searching = !query;
    if (!query) return send(state, id, '🔎 Напиши название или слово из темы.\n\nНапример:\n• семья\n• артикли\n• Past Simple\n\nДля выхода нажми 🏠 Главное меню.');
    const normalized = query.toLocaleLowerCase('ru');
    const found = availableLessons(state).filter((item) => `${item.title} ${item.id}`.toLocaleLowerCase('ru').includes(normalized));
    return panel(state, user, found.length ? `🔎 Найдено тем: ${found.length}\n\n👇 Выбери тему.${found.length > 8 ? '\nПоказаны первые 8 — уточни запрос для остальных.' : ''}` : '🔎 Пока ничего не нашлось.\nПопробуй другое слово: /search запрос', { inline_keyboard: [...found.slice(0, 8).map((item) => [{ text: `${item.icon ?? '📘'} ${item.title}`, callback_data: `t:${item.id}` }]), [{ text: '📚 Все темы', callback_data: 'levels' }]] });
  }
  if (text.startsWith('/')) user.searching = false;
  if (command === '/menu') return showHome(state, user, access);
  if (command === '/continue') {
    if (user.activeAttempt) return ask(state, user);
    const saved = user.reading;
    const lesson = saved && accessibleLesson(state, user, saved.lessonId);
    if (!lesson) return showCatalog(state, user);
    if (saved.version !== lesson.version) send(state, id, '📖 Репетитор обновил тему. Открываю раздел с начала.');
    return showSection(state, user, saved.lessonId, saved.section, saved.version === lesson.version ? saved.page : 0);
  }
  if (command === '/mode') return showMode(state, user);
  if (command === '/teacher') {
    if (!teacher) return send(state, id, 'Кабинет доступен репетитору.');
    return send(state, id, '👩‍🏫 Кабинет репетитора\n\n🏫 Мои классы — ученики, темы, домашние задания.\n📝 Мои ДЗ — создать своё задание и назначить.\n📤 Отправленные работы — кто сдал, ответы и время.\n✏️ Редактор — общие материалы учебника.\n\n👇 Выбери действие.', { reply_markup: { keyboard: [['🏫 Мои классы', '📝 Мои ДЗ'], ['📤 Отправленные работы', '📊 Работы учеников'], ['✏️ Редактор', '👥 Ученики'], ['🔗 Пригласить ученика'], ['🏠 Главное меню']], resize_keyboard: true } });
  }
  if (['/admin', '/add_teacher', '/remove_teacher'].includes(command)) {
    if (!admin) return send(state, id, 'Команда доступна администратору.');
    if (command === '/admin') return send(state, id, `🛠 Кабинет администратора\n\n🔑 /add_teacher ID — выдать права\n🔒 /remove_teacher ID — снять права\n✏️ /editor — материалы\n👥 /students — все ученики\n📊 /results — работы\n🕘 /history ID — версии урока\n\n👩‍🏫 Репетиторы: ${roles.teacherIds.join(', ') || 'нет'}`, { reply_markup: mainMenu(access) });
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
  if (handleEditor(state, user, text, { teacher, admin, send: (value, extra) => send(state, id, value, extra) })) return;
  if (command === '/assign') {
    if (!teacher) return send(state, id, 'Назначение доступно репетитору или администратору.');
    const [, studentId, lessonId, due] = text.split(/\s+/u);
    const student = state.users[studentId];
    const lesson = findLesson(state, lessonId);
    const deadline = parseDeadline(due);
    if (!student || (!admin && studentId !== id && student.teacherId !== id && !Object.values(state.classes ?? {}).some(c => c.ownerId === id && c.studentIds.includes(studentId)))) return send(state, id, 'Ученик не найден или не подключён к тебе. /students');
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
    if (command === '/start' && teacher && state.teacherWelcome?.[id]) {
      send(state, id, 'Вам выданы права репетитора 👩‍🏫\n/editor — уроки и редактор\n/invite — пригласить ученика\n/students — ученики\n/results — результаты');
      delete state.teacherWelcome[id];
    }
    if (command === '/start') {
      showHome(state, user, access);
      if (!user.learningMode) showMode(state, user);
      return;
    }
    send(state, id, 'Добро пожаловать!\n/classes — мои классы, темы и задания\n/join_class КОД — вступить в класс\n/topics — каталог тем по уровням\n/topics A1 — темы уровня\n/lesson to-be — открыть конкретную тему\n/practice — практика по выбранной теме или продолжение\n/practice past-simple — практика по указанной теме\n/progress — результаты\n/cancel — отменить текущую попытку\n/join КОД — подключиться к репетитору и отправлять ему ответы на будущие задания\n/whoami — твой ID' +
      '\n/homework — мои домашние задания\n/continue — продолжить с места остановки\n/mode — выбрать подачу\n/menu — главное меню\n\n⬇️ Объяснения приходят новыми карточками внизу чата.' + (teacher ? '\n\n👩‍🏫 /teacher — кабинет репетитора\n/editor — создать или исправить урок\n/invite — одноразовый код ученику (24 часа)\n/students — ученики и ID\n/assign ID_УЧЕНИКА ID_ТЕМЫ СРОК — назначить ДЗ\n/results — последние работы' : '') + (admin ? '\n/admin — управление ролями и полный доступ' : ''), { reply_markup: mainMenu(access) });
  } else if (command === '/topics' || text === '📚 Темы') {
    showCatalog(state, user, command === '/topics' ? argument?.toUpperCase() as Level : undefined);
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
    const students = Object.values(state.users).filter((student) => admin || student.teacherId === id || Object.values(state.classes ?? {}).some(c => c.ownerId === id && c.studentIds.includes(student.id)));
    if (command === '/students') send(state, id, students.map((student) => `${student.name} · ${student.id}`).join('\n') || 'Учеников пока нет. Создай /invite');
    else {
      const attempts = Object.values(state.attempts).filter((attempt) => (admin || attempt.teacherId === id) && attempt.completedAt).slice(-5);
      if (!attempts.length) send(state, id, 'Выполненных заданий пока нет.');
      for (const attempt of attempts) send(state, id, buildReport(attempt, state.users[attempt.studentId].name));
    }
  } else if (command === '/progress' || text === '📊 Мой прогресс') {
    const attempts = Object.values(state.attempts).filter((attempt) => attempt.studentId === id && attempt.completedAt);
    send(state, id, attempts.length ? attempts.slice(-10).map((attempt) => `${attempt.reviewOf ? '🔁 Повторение ошибок' : '✏️ Практика'} · ${attempt.lesson.title}: ${attempt.answers.filter((answer) => answer.correct).length}/${attempt.lesson.questions.length}`).join('\n') : 'Результатов пока нет. Начать: /practice');
  } else if (text.startsWith('/')) {
    send(state, id, 'Неизвестная команда. /help');
  } else if (user.activeAttempt) {
    const attempt = state.attempts[user.activeAttempt];
    if (attempt.lesson.questions[attempt.answers.length].type === 'choice') return send(state, id, 'Выбери вариант кнопкой под вопросом.');
    if (text.length > 300) return send(state, id, 'Ответ слишком длинный. Впиши только пропущенное слово.');
    acceptAnswer(state, user, text, access);
  } else send(state, id, '🧭 Выбери 📚 Темы или ▶️ Практика на кнопках внизу.', { reply_markup: mainMenu(access) });
}
