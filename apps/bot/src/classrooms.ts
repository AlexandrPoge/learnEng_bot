import { randomBytes } from 'node:crypto';
import { availableLessons, findLesson } from './editor.js';
import { parseDeadline } from '../../../packages/domain/deadline.js';
import { buildReport } from '../../../packages/domain/grading.js';
import type { Assignment, BotState, Classroom, InlineButton, Lesson, Level, ReplyMarkup, TelegramPayload, User } from '../../../packages/domain/types.js';

interface Context {
  teacher: boolean; admin: boolean; isTeacher(id: string): boolean;
  send(text: string, extra?: TelegramPayload): void;
  notify(id: string, text: string, extra?: TelegramPayload): void;
  panel(text: string, markup: ReplyMarkup): void;
  editor(text: string): void;
  topic(id: string): void;
}
const button = (text: string, callback_data: string): InlineButton => ({ text, callback_data });
const levelButtons = (nonce: string) => ({ inline_keyboard: [['A1', 'A2'], ['B1', 'B2']].map(row => row.map(l => button(l, `class:level:${nonce}:${l}`))) });
const key = () => randomBytes(4).toString('hex');
const dueLabel = (date: string) => `${new Date(date).toLocaleString('ru-RU', { timeZone: 'Europe/Minsk', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} (UTC+3)`;
const manage = (c: Classroom, user: User, ctx: Context) => ctx.teacher && (ctx.admin || c.ownerId === user.id);
const canRead = (c: Classroom, user: User, ctx: Context) => manage(c, user, ctx) || (ctx.isTeacher(c.ownerId) && c.studentIds.includes(user.id));
const linkedStudents = (state: BotState, user: User, ctx: Context) => Object.values(state.users).filter(s => s.id === user.id ? ctx.teacher : ctx.admin || s.teacherId === user.id || Object.values(state.classes ?? {}).some(c => c.ownerId === user.id && c.studentIds.includes(s.id)));

function paged<T>(items: T[], page: number, row: (item: T) => InlineButton[], route: (page: number) => string, tail: InlineButton[][] = []) {
  const last = Math.max(0, Math.ceil(items.length / 6) - 1);
  const current = Number.isInteger(page) ? Math.min(Math.max(page, 0), last) : 0;
  const rows = items.slice(current * 6, current * 6 + 6).map(row);
  const arrows: InlineButton[] = [];
  if (current) arrows.push(button('⬅️ Назад', route(current - 1)));
  if (current < last) arrows.push(button('Дальше ➡️', route(current + 1)));
  if (arrows.length) rows.push(arrows);
  return { inline_keyboard: [...rows, ...tail] };
}

function showClass(state: BotState, user: User, c: Classroom, ctx: Context) {
  const ownTasks = Object.values(state.assignments ?? {}).filter(a => a.classId === c.id && a.studentId === user.id && !a.completedAt).length;
  ctx.panel(`🏫 ${c.name}\n\n🌱 Уровень: ${c.level}\n📚 Тем: ${c.lessonIds.length}\n${manage(c, user, ctx) ? `👥 Учеников: ${c.studentIds.length}` : `📝 ДЗ к выполнению: ${ownTasks}`}\n\nВыбери темы или домашние задания.`, { inline_keyboard: [
    [button('📚 Темы класса', `class:topics:${c.id}:0`), button('📝 Задания класса', `class:tasks:${c.id}:0`)],
    ...(manage(c, user, ctx) ? [
      [button('👥 Ученики', `class:students:${c.id}:0`), button('🔗 Приглашение', `class:invite:${c.id}`)],
      [button('➕ Добавить темы', `class:pick:${c.id}:0`), button('📨 Назначить ДЗ', 'work:list:0')],
      [button('✏️ Название класса', `class:rename:${c.id}`), button('🌱 Уровень класса', `class:change-level:${c.id}`)],
    ] : []),
    [button('👥 Учебные группы', 'class:list:0'), button('🏠 Меню', 'home')],
  ] });
}

function targetPicker(state: BotState, user: User, ctx: Context, page = 0) {
  const draft = user.workspace;
  if (draft?.kind !== 'assign' || draft.step !== 'target') return;
  const targets = [
    ...Object.values(state.classes ?? {}).filter(c => manage(c, user, ctx) && c.studentIds.length).map(c => ({ text: `🏫 ${c.name} · ${c.studentIds.length} уч.`, kind: 'class', id: c.id })),
    ...linkedStudents(state, user, ctx).map(s => ({ text: s.id === user.id ? '🧪 Себе · пробное задание' : `👤 ${s.name} · ${s.id}`, kind: 'student', id: s.id })),
  ];
  ctx.panel(`📨 ${draft.lesson.title}\n\nШаг 1 из 4 · Кому отправить?\n${targets.length ? 'Выбери одного ученика или весь класс.' : 'Пока нет учеников. Сначала пригласи их в класс или через /invite.'}`, paged(targets, page, t => [button(t.text, `work:target:${draft.nonce}:${t.kind}:${t.id}`)], p => `work:targets:${draft.nonce}:${p}`, [[button('✖️ Отменить', 'work:cancel')]]));
}

function beginAssignment(state: BotState, user: User, lesson: Lesson, ctx: Context) {
  if (user.activeAttempt || state.editors?.[user.id]) { ctx.send('Сначала заверши практику /cancel или закрой черновик /discard.'); return; }
  user.workspace = { kind: 'assign', nonce: key(), lesson: structuredClone(lesson), step: 'target' };
  targetPicker(state, user, ctx);
}

function deadlinePicker(user: User, ctx: Context) {
  const draft = user.workspace;
  if (draft?.kind !== 'assign') return;
  ctx.panel('📅 Шаг 2 из 4 · Срок сдачи\n\nВыбери срок кнопкой или отправь дату:\n2099-11-20T18:00+03:00\n\nЧасовой пояс обязателен. В карточках время показано по UTC+3.', { inline_keyboard: [
    [1, 3, 7].map(days => button(`Через ${days} дн.`, `work:due:${draft.nonce}:${days}`)),
    [button('✖️ Отменить', 'work:cancel')],
  ] });
}

function modePicker(user: User, ctx: Context) {
  const draft = user.workspace;
  if (draft?.kind !== 'assign') return;
  draft.step = 'mode';
  ctx.panel('⚙️ Шаг 3 из 4 · Как проверять?\n\n🌱 Тренировка — подсказки и объяснение после каждого ответа.\n\n🧪 Проверочная — правильные ответы и разбор только после сдачи. Можно читать учебник: это не экзамен под наблюдением.', { inline_keyboard: [
    [button('🌱 Тренировка', `work:mode:${draft.nonce}:practice`)],
    [button('🧪 Проверочная', `work:mode:${draft.nonce}:test`)], [button('✖️ Отменить', 'work:cancel')],
  ] });
}

function recipients(state: BotState, user: User, ctx: Context): string[] {
  const draft = user.workspace;
  if (draft?.kind !== 'assign' || !draft.target) return [];
  if (draft.target.kind === 'class') {
    const c = state.classes?.[draft.target.id];
    return c && manage(c, user, ctx) && ctx.isTeacher(c.ownerId) ? [...new Set(c.studentIds)].filter(id => Boolean(state.users[id])) : [];
  }
  return linkedStudents(state, user, ctx).some(s => s.id === draft.target!.id) ? [draft.target.id] : [];
}

function showBatch(state: BotState, user: User, batch: string, page: number, ctx: Context) {
  const tasks = Object.values(state.assignments ?? {}).filter(a => (a.batchId ?? a.id) === batch);
  if (!tasks.length || !ctx.teacher || (!ctx.admin && tasks[0].teacherId !== user.id)) { ctx.send('Работа недоступна.'); return; }
  const submitted = tasks.filter(a => a.completedAt).length;
  const rows = tasks.map(a => {
    const attempt = a.attemptId && state.attempts[a.attemptId];
    return { task: a, label: `${a.completedAt ? '✅' : '⏳'} ${state.users[a.studentId]?.name ?? 'Ученик'} · ${attempt ? `${attempt.answers.filter(x => x.correct).length}/${attempt.answers.length}` : 'не сдано'}` };
  });
  ctx.panel(`📊 ${tasks[0].lesson.title}\n\nСдано: ${submitted} из ${tasks.length}\nСрок: ${dueLabel(tasks[0].deadline)}\n\nВыбери ученика: ответы и время видны после сдачи.`, paged(rows, page, r => [button(r.label, `work:result:${r.task.id}`)], p => `work:batch:${batch}:${p}`, [[button('📤 Все отправленные', 'work:sent:0')]]));
}

/** Native Telegram flows. Every callback rechecks the current role and ownership. */
export function handleClassrooms(state: BotState, user: User, input: { text?: string; data?: string }, ctx: Context): boolean {
  const text = input.text ?? '';
  const [raw = '', ...args] = text.split(/\s+/u);
  const command = raw.split('@')[0].toLowerCase();
  let data = input.data ?? '';
  if (command === '/classes') data = 'class:list:0';
  if (command === '/new_class') data = 'class:new';
  if (command === '/my_homework') data = 'work:list:0';
  if (command === '/sent_homework') data = 'work:sent:0';
  if (command === '/cancel_setup') data = 'work:cancel';
  if (command === '/join_class') data = `class:join:${args[0] ?? ''}`;
  const draft = user.workspace;
  if (!data && draft && text && !text.startsWith('/')) {
    if (!ctx.teacher) { delete user.workspace; ctx.send('Доступ к настройке закрыт.'); return true; }
    if (draft.kind === 'class' && !draft.name) {
      if (text.length > 70) { ctx.send('Название — до 70 символов. Например: «3 класс» или «Взрослые · вечер».'); return true; }
      if (draft.classId) {
        const c = state.classes?.[draft.classId];
        if (!c || !manage(c, user, ctx)) { delete user.workspace; ctx.send('Класс недоступен.'); return true; }
        c.name = text; delete user.workspace; showClass(state, user, c, ctx); return true;
      }
      draft.name = text;
      ctx.panel('🌱 Выбери уровень группы.\n\nНомер школьного класса и языковой уровень — разные вещи.', levelButtons(draft.nonce));
      return true;
    }
    if (draft.kind === 'assign' && draft.step === 'deadline') {
      const deadline = parseDeadline(text);
      if (!deadline || Date.parse(deadline) <= Date.now()) { ctx.send('Нужна будущая дата с часовым поясом. Например: 2099-11-20T18:00+03:00. Отмена: /cancel_setup'); return true; }
      draft.deadline = deadline; modePicker(user, ctx); return true;
    }
    ctx.send('Выбери следующий шаг кнопкой. Отмена: /cancel_setup'); return true;
  }
  if (!data.startsWith('class:') && !data.startsWith('work:')) return false;
  const [area, action, id, detail, extra] = data.split(':');
  if (data === 'work:cancel') { delete user.workspace; ctx.send('Настройка закрыта. Созданные классы, ДЗ и назначенные работы сохранены.'); return true; }

  if (area === 'class') {
    if (action === 'list') {
      delete user.classContext;
      const classes = Object.values(state.classes ?? {}).filter(c => canRead(c, user, ctx));
      ctx.panel(`👥 Учебные группы\n\n${classes.length ? 'Выбери группу учеников: участники, темы и домашние задания.' : 'Групп пока нет. ' + (ctx.teacher ? 'Создай группу и пригласи учеников.' : 'Попроси у репетитора команду /join_class с кодом.')}\n\n🏫 Темы по школьным классам находятся в «📚 Учебнике».`, paged(classes, Number(id), c => [button(`${c.name} · ${c.level}`, `class:view:${c.id}`)], p => `class:list:${p}`, [...(ctx.teacher ? [[button('➕ Создать группу', 'class:new')]] : []), [button('📚 Учебник', 'book'), button('🏠 Меню', 'home')]]));
      return true;
    }
    if (action === 'new') {
      if (!ctx.teacher) { ctx.send('Создать класс может репетитор или администратор.'); return true; }
      if (state.editors?.[user.id] || user.activeAttempt || user.workspace) { ctx.send('Закончи текущую настройку /cancel_setup, черновик /discard или практику /cancel.'); return true; }
      user.workspace = { kind: 'class', nonce: key() };
      ctx.send('🏫 Новый класс\n\nОтправь название, например «2 класс», «Подростки A2» или «Взрослые».\n\nОтмена: /cancel_setup'); return true;
    }
    if (action === 'level') {
      if (!ctx.teacher || draft?.kind !== 'class' || draft.nonce !== id || !draft.name || !['A1', 'A2', 'B1', 'B2'].includes(detail)) { ctx.send('Этот шаг уже закрыт. /classes'); return true; }
      if (draft.classId) {
        const c = state.classes?.[draft.classId];
        if (!c || !manage(c, user, ctx)) { delete user.workspace; ctx.send('Класс недоступен.'); return true; }
        c.level = detail as Level; delete user.workspace;
        ctx.send('Уровень изменён. Ранее выбранные темы и ДЗ сохранены.'); showClass(state, user, c, ctx); return true;
      }
      const c: Classroom = { id: key(), name: draft.name, level: detail as Level, ownerId: user.id, studentIds: [], lessonIds: [], createdAt: new Date().toISOString() };
      (state.classes ??= {})[c.id] = c;
      delete user.workspace; showClass(state, user, c, ctx); return true;
    }
    if (action === 'join' || action === 'accept') {
      const invite = state.classInvites?.[id];
      const c = invite && state.classes?.[invite.classId];
      if (!invite || invite.expiresAt < Date.now() || !c || !ctx.isTeacher(c.ownerId) || c.ownerId === user.id) { ctx.send('Приглашение недействительно. Попроси новое у репетитора.'); return true; }
      if (c.studentIds.includes(user.id)) { showClass(state, user, c, ctx); return true; }
      if (action === 'join') {
        ctx.panel(`🏫 Приглашение: ${c.name}\n\nРепетитор: ${state.users[c.ownerId]?.name ?? c.ownerId}\n🌱 ${c.level}\n\nРепетитор увидит твоё имя, Telegram ID, ответы и время выполнения ДЗ этого класса.`, { inline_keyboard: [[button('✅ Вступить в класс', `class:accept:${id}`)], [button('🏠 Меню', 'home')]] });
      } else {
        c.studentIds.push(user.id);
        // Членство в классе не меняет подключение к другому репетитору.
        showClass(state, user, c, ctx);
        ctx.notify(c.ownerId, `👤 В класс «${c.name}» вступил ученик: ${user.name}`, { requiredTeacher: true });
      }
      return true;
    }
    const c = state.classes?.[id];
    if (!c || !canRead(c, user, ctx)) { ctx.send('Класс недоступен. /classes'); return true; }
    if (action === 'view') { showClass(state, user, c, ctx); return true; }
    if (action === 'topics') {
      const topics = c.lessonIds.map(t => findLesson(state, t)).filter((t): t is Lesson => Boolean(t));
      ctx.panel(`📚 ${c.name} → темы\n\n${topics.length ? 'Выбери тему: правило → примеры → ловушки → практика.' : 'Репетитор пока не выбрал темы. Общий учебник доступен в разделе «Темы».'}`, paged(topics, Number(detail), t => [button(`${t.icon ?? '📘'} ${t.title}`, `class:open:${c.id}:${t.id}`)], p => `class:topics:${c.id}:${p}`, [[button('🏫 К классу', `class:view:${c.id}`)]]));
      return true;
    }
    if (action === 'open') {
      if (!c.lessonIds.includes(detail)) { ctx.send('Тема больше не входит в этот класс.'); return true; }
      user.classContext = c.id; ctx.topic(detail); return true;
    }
    if (action === 'tasks') {
      const tasks = Object.values(state.assignments ?? {}).filter(a => a.classId === c.id && (manage(c, user, ctx) || a.studentId === user.id));
      if (manage(c, user, ctx)) {
        const batches = [...new Map(tasks.map(a => [a.batchId ?? a.id, a])).values()].reverse();
        ctx.panel(`📝 ${c.name} → задания\n\n${batches.length ? 'Выбери работу для просмотра сдачи.' : 'Заданий ещё нет.'}`, paged(batches, Number(detail), a => [button(a.lesson.title, `work:batch:${a.batchId ?? a.id}:0`)], p => `class:tasks:${c.id}:${p}`, [[button('📨 Назначить ДЗ', 'work:list:0')], [button('🏫 К классу', `class:view:${c.id}`)]]));
      } else {
        ctx.panel(`📝 ${c.name} → мои ДЗ\n\n${tasks.length ? '✅ — сдано. ⏳ — ещё можно выполнить.' : 'Заданий ещё нет.'}`, paged(tasks.reverse(), Number(detail), a => [button(`${a.completedAt ? '✅' : '⏳'} ${a.lesson.title}`, a.completedAt && a.attemptId ? `review:${a.attemptId}` : `h:${a.id}`)], p => `class:tasks:${c.id}:${p}`, [[button('🏫 К классу', `class:view:${c.id}`)]]));
      }
      return true;
    }
    if (!manage(c, user, ctx)) { ctx.send('Настройки доступны репетитору класса и администратору.'); return true; }
    if (action === 'rename' || action === 'change-level') {
      if (user.activeAttempt || state.editors?.[user.id] || user.workspace) { ctx.send('Сначала закрой настройку /cancel_setup, черновик /discard или практику /cancel.'); return true; }
      user.workspace = { kind: 'class', nonce: key(), classId: c.id, ...(action === 'change-level' ? { name: c.name } : {}) };
      if (action === 'rename') ctx.send('✏️ Отправь новое название класса (до 70 символов). Отмена: /cancel_setup');
      else ctx.panel('🌱 Выбери уровень. Ранее выбранные темы и назначенные ДЗ сохранятся.', levelButtons(user.workspace.nonce));
      return true;
    }
    if (action === 'invite') {
      if (!ctx.isTeacher(c.ownerId)) { ctx.send('У владельца класса больше нет прав репетитора.'); return true; }
      for (const [code, inv] of Object.entries(state.classInvites ?? {})) if (inv.classId === c.id) delete state.classInvites![code];
      const code = randomBytes(12).toString('hex');
      (state.classInvites ??= {})[code] = { classId: c.id, expiresAt: Date.now() + 86400000 };
      ctx.send(`🔗 Приглашение в «${c.name}»\n\nПередай ученикам команду:\n/join_class ${code}\n\nКод действует 24 часа, подходит для нескольких учеников. Новый код отменяет предыдущий. Участник увидит объяснение перед вступлением.`); return true;
    }
    if (action === 'pick' || action === 'toggle') {
      if (action === 'toggle') {
        if (!findLesson(state, detail)) { ctx.send('Тема не найдена.'); return true; }
        c.lessonIds = c.lessonIds.includes(detail) ? c.lessonIds.filter(t => t !== detail) : [...c.lessonIds, detail];
      }
      const page = Number(action === 'toggle' ? extra : detail);
      const topics = availableLessons(state).filter(t => t.level === c.level || c.lessonIds.includes(t.id));
      ctx.panel(`📚 Темы для «${c.name}»\n\nНажми тему, чтобы добавить или убрать её. ✅ — уже в классе.\nВыбрано: ${c.lessonIds.length}`, paged(topics, page, t => [button(`${c.lessonIds.includes(t.id) ? '✅' : '➕'} ${t.title}`, `class:toggle:${c.id}:${t.id}:${Number.isInteger(page) ? page : 0}`)], p => `class:pick:${c.id}:${p}`, [[button('🏫 Готово · к классу', `class:view:${c.id}`)]])); return true;
    }
    if (action === 'students' || action === 'remove' || action === 'remove-confirm') {
      if (action === 'remove') {
        if (!c.studentIds.includes(detail)) { ctx.send('Ученик уже вышел из класса.'); return true; }
        ctx.panel(`Убрать ${state.users[detail]?.name ?? 'ученика'} из «${c.name}»?\nРанее назначенные работы и результаты сохранятся. Новые задания класса он получать не будет.`, { inline_keyboard: [[button('Убрать из класса', `class:remove-confirm:${c.id}:${detail}`)], [button('Назад', `class:students:${c.id}:0`)]] }); return true;
      }
      if (action === 'remove-confirm') c.studentIds = c.studentIds.filter(s => s !== detail);
      ctx.panel(`👥 ${c.name}\n\nУчеников: ${c.studentIds.length}\nНажми имя, чтобы убрать ученика из класса. Подключение — по приглашению.`, paged(c.studentIds, action === 'students' ? Number(detail) : 0, sid => [button(`${state.users[sid]?.name ?? 'Ученик'} · ${sid}`, `class:remove:${c.id}:${sid}`)], p => `class:students:${c.id}:${p}`, [[button('🔗 Пригласить', `class:invite:${c.id}`)], [button('🏫 К классу', `class:view:${c.id}`)]])); return true;
    }
    ctx.send('Открой класс заново: /classes'); return true;
  }

  if (!ctx.teacher) { ctx.send('Создание и назначение ДЗ доступно репетитору и администратору.'); return true; }
  if (action === 'list') {
    const templates = Object.values(state.homeworkTemplates ?? {}).filter(t => ctx.admin || t.ownerId === user.id);
    ctx.panel(`📝 Мои ДЗ\n\n${templates.length ? 'Сохранённые задания можно менять и назначать повторно.' : 'Создай задание с вопросами и ключами или выбери тему из учебника.'}\n\nОтветы учеников хранятся отдельно от ключей.`, paged(templates, Number(id), t => [button(t.lesson.title, `work:view:${t.id}`)], p => `work:list:${p}`, [[button('➕ Создать своё ДЗ', 'work:new')], [button('📚 Назначить тему учебника', 'work:course:0')], [button('📤 Отправленные работы', 'work:sent:0')], [button('🏠 Меню', 'home')]])); return true;
  }
  if (action === 'new') { ctx.editor('/new_homework'); return true; }
  if (action === 'course') {
    ctx.panel('📚 Какую тему назначить?\n\nУченики получат упражнения из выбранной темы.', paged(availableLessons(state), Number(id), l => [button(`${l.level} · ${l.title}`, `work:send:${l.id}`)], p => `work:course:${p}`, [[button('📝 Мои ДЗ', 'work:list:0')]])); return true;
  }
  if (action === 'view' || action === 'edit' || action === 'send') {
    const template = state.homeworkTemplates?.[id];
    const lesson = template ? (ctx.admin || template.ownerId === user.id ? template.lesson : undefined) : action === 'send' ? findLesson(state, id) : undefined;
    if (!lesson) { ctx.send('Задание недоступно. /my_homework'); return true; }
    if (action === 'edit') ctx.editor(`/edit_homework ${id}`);
    else if (action === 'send') beginAssignment(state, user, lesson, ctx);
    else ctx.panel(`📝 ${lesson.title}\n\n🌱 ${lesson.level} · ${lesson.questions.length} вопросов · версия ${lesson.version}\n\nПравки не меняют уже назначенные работы. Ключи доступны в предпросмотре редактора.`, { inline_keyboard: [[button('📨 Назначить', `work:send:${id}`), button('✏️ Изменить', `work:edit:${id}`)], [button('📝 Мои ДЗ', 'work:list:0')]] });
    return true;
  }
  if (action === 'sent') {
    const tasks = Object.values(state.assignments ?? {}).filter(a => ctx.admin || a.teacherId === user.id);
    const batches = [...new Map(tasks.map(a => [a.batchId ?? a.id, a])).values()].reverse();
    ctx.panel('📤 Отправленные работы\n\nВыбери задание, чтобы увидеть, кто сдал, ответы и время.', paged(batches, Number(id), a => [button(`${a.lesson.title} · ${new Date(a.createdAt).toLocaleDateString('ru-RU')}`, `work:batch:${a.batchId ?? a.id}:0`)], p => `work:sent:${p}`, [[button('📝 Мои ДЗ', 'work:list:0')]])); return true;
  }
  if (action === 'batch') { showBatch(state, user, id, Number(detail), ctx); return true; }
  if (action === 'result') {
    const a = state.assignments?.[id];
    if (!a || (!ctx.admin && a.teacherId !== user.id)) { ctx.send('Нет доступа к работе.'); return true; }
    const attempt = a.attemptId ? state.attempts[a.attemptId] : undefined;
    ctx.send(attempt?.completedAt ? buildReport(attempt, state.users[a.studentId]?.name ?? 'Ученик') : `⏳ ${state.users[a.studentId]?.name ?? 'Ученик'} ещё не сдал работу.\nСрок: ${dueLabel(a.deadline)}`, { reply_markup: { inline_keyboard: [[button('📊 К работе', `work:batch:${a.batchId ?? a.id}:0`)]] } }); return true;
  }
  if (draft?.kind !== 'assign' || draft.nonce !== id) { ctx.send('Этот шаг уже закрыт. /my_homework'); return true; }
  if (action === 'targets' && draft.step === 'target') { targetPicker(state, user, ctx, Number(detail)); return true; }
  if (action === 'target' && draft.step === 'target' && ['student', 'class'].includes(detail)) {
    draft.target = { kind: detail as 'student' | 'class', id: extra };
    if (!recipients(state, user, ctx).length) { delete draft.target; ctx.send('Получатели недоступны. Пригласи учеников в класс.'); return true; }
    draft.step = 'deadline'; deadlinePicker(user, ctx); return true;
  }
  if (action === 'due' && draft.step === 'deadline' && ['1', '3', '7'].includes(detail)) {
    draft.deadline = new Date(Date.now() + Number(detail) * 86400000).toISOString(); modePicker(user, ctx); return true;
  }
  if (action === 'mode' && draft.step === 'mode' && ['practice', 'test'].includes(detail)) {
    draft.mode = detail as 'practice' | 'test'; draft.recipients = recipients(state, user, ctx); draft.step = 'confirm';
    const target = draft.target?.kind === 'class' ? state.classes?.[draft.target.id]?.name : state.users[draft.target!.id]?.name;
    ctx.panel(`📨 Шаг 4 из 4 · Проверь задание\n\n📝 ${draft.lesson.title}\n🔢 Вопросов: ${draft.lesson.questions.length}\n👥 Получатель: ${target}\nУчеников: ${draft.recipients.length}\n📅 ${dueLabel(draft.deadline!)}\n⚙️ ${draft.mode === 'test' ? 'Проверочная · разбор после сдачи' : 'Тренировка · разбор после каждого ответа'}\n\nПосле нажатия ученикам придут задания.`, { inline_keyboard: [[button('✅ Назначить', `work:confirm:${draft.nonce}`)], [button('✖️ Отменить', 'work:cancel')]] }); return true;
  }
  if (action === 'confirm' && draft.step === 'confirm') {
    const current = recipients(state, user, ctx).sort();
    if (!draft.deadline || Date.parse(draft.deadline) <= Date.now() || !current.length || current.join(',') !== [...(draft.recipients ?? [])].sort().join(',')) {
      delete user.workspace; ctx.send('Состав учеников или срок изменился. Назначь ДЗ заново: /my_homework'); return true;
    }
    const classId = draft.target?.kind === 'class' ? draft.target.id : undefined;
    const owner = classId ? state.classes![classId].ownerId : user.id;
    const batchId = randomBytes(8).toString('hex');
    state.assignments ??= {};
    for (const studentId of current) {
      const assignment: Assignment = { id: randomBytes(8).toString('hex'), batchId, studentId, teacherId: owner, lesson: structuredClone(draft.lesson), deadline: draft.deadline, createdAt: new Date().toISOString(), completedAt: null, mode: draft.mode, ...(classId ? { classId } : {}) };
      state.assignments[assignment.id] = assignment;
      ctx.notify(studentId, `📝 Новое домашнее задание\n\n${assignment.lesson.title}\n${classId ? `🏫 ${state.classes![classId].name}\n` : ''}📅 Срок: ${dueLabel(assignment.deadline)}\n⚙️ ${assignment.mode === 'test' ? 'Проверочная: разбор после сдачи.' : 'Тренировка: объяснения после каждого ответа.'}\n\nОтветы и время получит репетитор.`, { reply_markup: { inline_keyboard: [[button('✏️ Открыть ДЗ', `h:${assignment.id}`)]] } });
    }
    delete user.workspace;
    ctx.panel(`✅ ДЗ назначено\n\nПолучателей: ${current.length}\nРезультаты появятся в «Отправленных работах».`, { inline_keyboard: [[button('📊 Смотреть сдачу', `work:batch:${batchId}:0`)]] }); return true;
  }
  ctx.send('Этот шаг уже выполнен. Открой /my_homework'); return true;
}
