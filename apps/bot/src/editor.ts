import { lessons, validateCatalog } from '../../../packages/content/catalog.js';
import { lessonSections } from '../../../packages/content/presentation.js';
import { randomBytes } from 'node:crypto';
import type { BotState, User, Lesson, EditorDraft, Question, Section, Level, TelegramPayload } from '../../../packages/domain/types.js';

export const availableLessons = (state: BotState): Lesson[] => {
  const merged = new Map(lessons.map((item) => [item.id, item]));
  for (const item of Object.values(state.lessonOverrides ?? {})) merged.set(item.id, item);
  return [...merged.values()];
};
export const findLesson = (state: BotState, id: string | undefined) => availableLessons(state).find((item) => item.id === id);

const editorHelp = 'Редактор:\n/edit ID — открыть урок\n/new ID — новый урок\n/title НАЗВАНИЕ\n/level A1\n/theory ТЕКСТ — правило, примеры, ловушки\n/add_question — добавить вопрос пошагово\n/edit_question q1 — заменить вопрос\n/remove_question q1 — удалить вопрос\n/preview — черновик и ключи\n/publish — опубликовать\n/discard — закрыть черновик\n/history ID — история\n/restore ID ВЕРСИЯ — восстановить (админ)';

function draftButtons() {
  return { inline_keyboard: [
    [{ text: '🏷 Название', callback_data: 'editor:title' }, { text: '📖 Правило', callback_data: 'editor:rule' }],
    [{ text: '🌱 Уровень', callback_data: 'editor:level' }, { text: '🔧 Изменить вопросы', callback_data: 'editor:questions' }],
    [{ text: '💡 Примеры', callback_data: 'editor:examples' }, { text: '⚠️ Ловушки', callback_data: 'editor:traps' }],
    [{ text: '🖼 Своя картинка правила', callback_data: 'editor:photo' }, { text: '🧽 Убрать картинку', callback_data: 'editor:no-photo' }],
    [{ text: '➕ Вопрос', callback_data: 'editor:add' }, { text: '👀 Предпросмотр', callback_data: 'editor:preview' }],
    [{ text: '✅ Опубликовать', callback_data: 'editor:publish' }, { text: '🗑 Закрыть черновик', callback_data: 'editor:discard' }],
    [{ text: '❓ Все команды', callback_data: 'editor:help' }],
  ] };
}

interface EditorContext { teacher: boolean; admin: boolean; send(text: string, extra?: TelegramPayload): void }
export function handleEditor(state: BotState, user: User, text: string, { teacher, admin, send }: EditorContext): boolean {
  const [raw, ...parts] = text.split(/\s+/u);
  const command = raw.split('@')[0].toLowerCase();
  const body = text.slice(raw.length).trim();
  const commands = ['/editor', '/editor_help', '/edit', '/new', '/new_homework', '/edit_homework', '/attach_rule', '/remove_rule_photo', '/questions', '/question', '/title', '/level', '/theory', '/rule', '/examples', '/traps', '/add_question', '/edit_question', '/remove_question', '/preview', '/publish', '/discard', '/history', '/restore'];
  state.editors ??= {};
  let draft = state.editors[user.id];
  if (!commands.includes(command) && !((draft?.step || draft?.inputField) && !text.startsWith('/'))) return false;
  if (!teacher) { send('Редактор доступен репетитору или администратору.'); return true; }
  if (draft?.inputField && !text.startsWith('/')) {
    const field = draft.inputField;
    delete draft.inputField;
    return handleEditor(state, user, `/${field} ${text}`, { teacher, admin, send });
  }
  if (command === '/editor_help') { send(editorHelp + '\n/rule ТЕКСТ — только правило\n/examples ТЕКСТ — только примеры\n/traps ТЕКСТ — только ловушки'); return true; }
  if (command === '/editor') {
    if (draft) { send(`✏️ Черновик: ${draft.lesson.title || draft.lesson.id}\n\n👇 Выбери, что изменить.`, { reply_markup: draftButtons() }); return true; }
    const items = availableLessons(state);
    const page = Number(parts[0] ?? 0);
    if (!Number.isInteger(page) || page < 0 || page >= Math.ceil(items.length / 5)) { send('Страница не найдена. /editor'); return true; }
    const rows = items.slice(page * 5, page * 5 + 5).map((item) => [{ text: `${item.icon ?? '📘'} ${item.title}`, callback_data: `edit:${item.id}` }]);
    const arrows = [];
    if (page > 0) arrows.push({ text: '⬅️ Назад', callback_data: `editlist:${page - 1}` });
    if ((page + 1) * 5 < items.length) arrows.push({ text: 'Дальше ➡️', callback_data: `editlist:${page + 1}` });
    if (arrows.length) rows.push(arrows);
    rows.push([{ text: '❓ Все команды', callback_data: 'editor:help' }, { text: '🏠 Меню', callback_data: 'home' }]);
    send('✏️ Редактор уроков\n\n👇 Выбери тему для правки.\n➕ Новый урок: /new ID_ЛАТИНИЦЕЙ\n📦 Правки сохраняются в черновике до публикации.', { reply_markup: { inline_keyboard: rows } });
    return true;
  }
  if (command === '/discard') { delete state.editors[user.id]; send('Черновик закрыт.'); return true; }
  if (command === '/new_homework' || command === '/edit_homework') {
    if (user.activeAttempt || draft) { send('Сначала заверши практику /cancel или закрой черновик /discard.'); return true; }
    delete user.workspace;
    const template = command === '/edit_homework' ? state.homeworkTemplates?.[parts[0]] : undefined;
    if (command === '/edit_homework' && (!template || (!admin && template.ownerId !== user.id))) { send('Своё ДЗ не найдено. /my_homework'); return true; }
    const id = template?.id ?? `hw-${randomBytes(8).toString('hex')}`;
    state.editors[user.id] = { destination: 'homework', baseVersion: template?.lesson.version ?? 0,
      lesson: template ? structuredClone(template.lesson) : { id, title: '', level: 'A1', category: 'grammar', version: 1, estimatedMinutes: 10, theory: 'Выполни задания. Внимательно прочитай каждый вопрос.', questions: [] },
      step: null, ...(template ? {} : { inputField: 'title' }) };
    send(template ? `📝 Черновик ДЗ: ${template.lesson.title}` : '📝 Создаём своё ДЗ\n\nШаг 1. Отправь название. Затем добавь вопросы и правильные ответы.\n\nДЗ сохранится отдельно от общего учебника.', template ? { reply_markup: draftButtons() } : {});
    return true;
  }
  if (command === '/new' || command === '/edit') {
    if (user.workspace) { send('Сначала закрой настройку класса или назначения: /cancel_setup'); return true; }
    if (user.activeAttempt) { send('Сначала заверши практику или отмени её: /cancel'); return true; }
    if (draft) { send('Есть открытый черновик. Сначала /publish или /discard.'); return true; }
    const id = parts[0];
    if (!/^[a-z0-9-]{1,40}$/u.test(id ?? '')) { send('Укажи ID латиницей: /edit present-simple или /new my-topic'); return true; }
    const current = findLesson(state, id);
    if (command === '/edit' && !current) { send('Тема не найдена. /topics'); return true; }
    if (command === '/new' && current) { send('Такой ID уже есть. Используй /edit ID'); return true; }
    state.editors[user.id] = {
      baseVersion: current?.version ?? 0,
      lesson: current ? structuredClone(current) : { id, title: '', level: 'A1', category: 'grammar', estimatedMinutes: 7, version: 1, theory: '', questions: [] },
      step: null,
    };
    send(`✏️ Открыт черновик: ${current?.title ?? id}.\n\nУченики увидят изменения после публикации.\n👇 Что изменить?`, { reply_markup: draftButtons() });
    return true;
  }
  if (command === '/history') {
    const id = parts[0];
    const current = findLesson(state, id);
    if (!current) { send('Тема не найдена.'); return true; }
    const records = state.lessonHistory?.[id] ?? [];
    send(`${current.title}\nТекущая версия: ${current.version}\n` + records.map((entry) => `Версия ${entry.lesson.version} · ${entry.savedAt} · редактор ${entry.editedBy}`).join('\n'));
    return true;
  }
  if (command === '/restore') {
    if (!admin) { send('Восстановление доступно администратору.'); return true; }
    const [id, version] = parts;
    const entry = state.lessonHistory?.[id]?.find((item) => item.lesson.version === Number(version));
    if (!entry) { send('Версия не найдена. Посмотри /history ID'); return true; }
    publish(state, user.id, entry.lesson);
    send(`Восстановлено как новая версия ${findLesson(state, id)!.version}.`);
    return true;
  }
  if (!draft) { send('Сначала открой /edit ID или /new ID'); return true; }
  if (command === '/questions' || command === '/question') {
    if (draft.step || draft.inputField || draft.awaitingPhoto) { send('Сначала закончи текущее поле, картинку или вопрос.'); return true; }
    if (command === '/questions') {
      send('🔧 Вопросы черновика\n\nВыбери вопрос для правки или удаления.', { reply_markup: { inline_keyboard: [...draft.lesson.questions.map((q, i) => [{ text: `${i + 1}. ${q.prompt.slice(0, 60)}`, callback_data: `editor:q:${q.id}` }]), [{ text: '➕ Новый вопрос', callback_data: 'editor:add' }, { text: '✏️ К черновику', callback_data: 'editor:back' }]] } });
    } else {
      const q = draft.lesson.questions.find(q => q.id === parts[0]);
      if (!q) { send('Вопрос не найден в черновике.'); return true; }
      send(`🔧 ${q.prompt}\n\n${q.options?.join('\n') ?? 'Ответ вводится текстом'}\n\n🔑 Ключ: ${q.accepted.join(' / ')}\n💡 ${q.explanation}\n\nУдаление уберёт вопрос только из черновика.`, { reply_markup: { inline_keyboard: [[{ text: '✏️ Заменить вопрос', callback_data: `editor:replace:${q.id}` }], [{ text: '🗑 Удалить из черновика', callback_data: `editor:remove:${q.id}` }], [{ text: '🔧 Все вопросы', callback_data: 'editor:questions' }]] } });
    }
    return true;
  }
  if (command === '/attach_rule' || command === '/remove_rule_photo') {
    if (draft.step || draft.inputField) { send('Сначала закончи текущее поле или вопрос.'); return true; }
    if (command === '/remove_rule_photo') {
      delete draft.lesson.rulePhoto; delete draft.awaitingPhoto;
      send('Картинка убрана из черновика. Будут доступны карточки из текста.', { reply_markup: draftButtons() });
    } else {
      draft.awaitingPhoto = true;
      send('🖼 Отправь картинку правила как фото (не файл). Она сохранится в черновике. После этого нажми «Опубликовать». Отмена ожидания: /remove_rule_photo');
    }
    return true;
  }
  if (draft.step && ['/add_question', '/edit_question', '/remove_question'].includes(command)) {
    send('Сначала закончи текущий вопрос или закрой черновик: /discard'); return true;
  }
  if (['/title', '/rule', '/examples', '/traps'].includes(command) && !body) {
    if (draft.step) { send('Сначала закончи вопрос.'); return true; }
    draft.inputField = command.slice(1);
    const prompts: Record<string, string> = { '/title': '🏷 Отправь новое название.', '/rule': '📖 Отправь новое правило короткими абзацами.', '/examples': '💡 Отправь примеры. Каждый — с новой строки. Можно добавить перевод через «—».', '/traps': '⚠️ Отправь типичные ошибки и как их исправить. Каждый случай — с новой строки.' };
    send(prompts[command]);
    return true;
  }
  if (command === '/title') {
    if (!body || body.length > 100) send('Название: от 1 до 100 символов.');
    else { draft.lesson.title = body; send('🏷 Название сохранено.\n\nДобавь вопрос кнопкой «➕ Вопрос», затем сохрани готовое ДЗ кнопкой «✅ Опубликовать».', { reply_markup: draftButtons() }); }
  } else if (command === '/level') {
    if (!body) {
      send('🌱 Выбери уровень задания.', { reply_markup: { inline_keyboard: [[{ text: 'A1', callback_data: 'editor:level:A1' }, { text: 'A2', callback_data: 'editor:level:A2' }]] } }); return true;
    }
    const level = body.toUpperCase();
    if (!['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(level)) send('Укажи уровень A1–C2.');
    else { draft.lesson.level = level as Level; send('Уровень сохранён.', { reply_markup: draftButtons() }); }
  } else if (command === '/theory') {
    if (!body || body.length > 12000) send('Отправь /theory и текст до 12000 символов: правило, примеры и ловушки.');
    else { draft.lesson.theory = body; delete draft.lesson.childIntro; delete draft.lesson.memory; send('📖 Объяснение сохранено в черновике.', { reply_markup: draftButtons() }); }
  } else if (['/rule', '/examples', '/traps'].includes(command)) {
    if (body.length > 5000) { send('Сократи раздел до 5000 символов или раздели его на несколько сообщений-команд.'); return true; }
    const sections = lessonSections(draft.lesson, { fallback: false });
    sections[command.slice(1) as Section] = body.split('\n').filter((line) => line.trim());
    const theory = [sections.rule.join('\n'), `Примеры:\n${sections.examples.join('\n')}`, `Ловушки:\n${sections.traps.join('\n')}`].join('\n\n');
    if (theory.length > 12000) { send('Весь урок должен помещаться в 12000 символов. Сократи раздел.'); return true; }
    draft.lesson.theory = theory;
    if (command === '/rule') { delete draft.lesson.childIntro; delete draft.lesson.memory; }
    send('✅ Раздел сохранён в черновике.', { reply_markup: draftButtons() });
  } else if (command === '/add_question' || command === '/edit_question') {
    if (command === '/add_question' && draft.lesson.questions.length >= 20) { send('В одном уроке максимум 20 вопросов.'); return true; }
    if (command === '/edit_question' && !draft.lesson.questions.some((item) => item.id === parts[0])) { send('ID вопроса не найден. Посмотри /preview'); return true; }
    delete draft.inputField;
    draft.pending = { replaceId: command === '/edit_question' ? parts[0] : null };
    draft.step = 'type';
    send('Выбери тип вопроса.', { reply_markup: { inline_keyboard: [[{ text: '🔘 Варианты ответа', callback_data: 'editor:type:choice' }, { text: '⌨️ Вписать ответ', callback_data: 'editor:type:text' }]] } });
  } else if (command === '/remove_question') {
    const before = draft.lesson.questions.length;
    draft.lesson.questions = draft.lesson.questions.filter((item) => item.id !== parts[0]);
    send(before === draft.lesson.questions.length ? 'ID вопроса не найден.' : 'Вопрос удалён из черновика.', { reply_markup: draftButtons() });
  } else if (command === '/preview') {
    send(`${draft.lesson.title || '(без названия)'} · ${draft.lesson.level}\n\n${draft.lesson.theory || '(нет объяснения)'}`);
    for (const item of draft.lesson.questions) send(`${item.id}. ${item.prompt}\n${item.options?.map((option, index) => `${index + 1}. ${option}`).join('\n') ?? ''}\nКлюч: ${item.accepted.join(' / ')}\n${item.explanation}`);
    if (draft.step) send(`Добавление вопроса не закончено: ${draft.step}. Продолжи или /discard.`);
  } else if (command === '/publish') {
    if (draft.step || draft.inputField || draft.awaitingPhoto) { send('Сначала закончи редактирование текущего поля, картинки или вопроса.'); return true; }
    const template = state.homeworkTemplates?.[draft.lesson.id];
    if (draft.destination === 'homework' && template && !admin && template.ownerId !== user.id) { send('Нет доступа к этому ДЗ.'); return true; }
    const currentVersion = draft.destination === 'homework' ? template?.lesson.version : findLesson(state, draft.lesson.id)?.version;
    if ((currentVersion ?? 0) !== draft.baseVersion) { send('Материал изменён другим редактором. Сохрани свой текст и открой свежую версию после /discard.'); return true; }
    try { validateCatalog([draft.lesson]); }
    catch { send('Нужны название, объяснение и хотя бы один вопрос с правильным ключом. /preview'); return true; }
    if (draft.destination === 'homework') {
      state.homeworkTemplates ??= {};
      state.homeworkTemplates[draft.lesson.id] = { id: draft.lesson.id, ownerId: template?.ownerId ?? user.id,
        lesson: { ...structuredClone(draft.lesson), version: (currentVersion ?? 0) + 1 }, updatedAt: new Date().toISOString() };
      send(`✅ ДЗ сохранено: ${draft.lesson.title}\n\nТеперь выбери, кому его назначить.`, { reply_markup: { inline_keyboard: [[{ text: '📨 Назначить', callback_data: `work:send:${draft.lesson.id}` }], [{ text: '📝 Мои ДЗ', callback_data: 'work:list:0' }]] } });
    } else {
      publish(state, user.id, draft.lesson);
      send(`Опубликовано: ${draft.lesson.title}, версия ${findLesson(state, draft.lesson.id)!.version}.`);
    }
    delete state.editors[user.id];
  } else if (draft.step && !text.startsWith('/')) {
    addQuestion(draft, text, send);
  }
  return true;
}

function publish(state: BotState, editorId: string, lesson: Lesson) {
  state.lessonOverrides ??= {};
  state.lessonHistory ??= {};
  const old = findLesson(state, lesson.id);
  if (old) {
    state.lessonHistory[lesson.id] ??= [];
    state.lessonHistory[lesson.id].push({ lesson: structuredClone(old), editedBy: editorId, savedAt: new Date().toISOString() });
  }
  state.lessonOverrides[lesson.id] = { ...structuredClone(lesson), version: (old?.version ?? 0) + 1 };
}

function addQuestion(draft: EditorDraft, text: string, send: EditorContext['send']) {
  const pending = draft.pending!;
  if (text.length > 1000) { send('Сократи ответ до 1000 символов.'); return; }
  if (draft.step === 'type') {
    if (!['choice', 'text'].includes(text.toLowerCase())) { send('Отправь choice или text.'); return; }
    pending.type = text.toLowerCase() as Question['type']; draft.step = 'prompt'; send('Отправь формулировку вопроса.');
  } else if (draft.step === 'prompt') {
    pending.prompt = text; draft.step = pending.type === 'choice' ? 'options' : 'accepted';
    send(pending.type === 'choice' ? 'Отправь 2–6 вариантов, каждый с новой строки (до 80 символов на вариант).' : 'Отправь допустимые ответы через ; (например: do not; don’t).');
  } else if (draft.step === 'options') {
    const options = text.split('\n').map((value) => value.trim()).filter(Boolean);
    if (options.length < 2 || options.length > 6 || options.some((value) => value.length > 80) || new Set(options).size !== options.length) { send('Нужно 2–6 разных вариантов до 80 символов, каждый с новой строки.'); return; }
    pending.options = options; draft.step = 'accepted'; send('Отправь номер правильного варианта (1, 2, ...).');
  } else if (draft.step === 'accepted') {
    if (pending.type === 'choice') {
      const index = Number(text) - 1;
      if (!Number.isInteger(index) || !pending.options?.[index]) { send('Укажи номер варианта из списка.'); return; }
      pending.accepted = [pending.options[index]];
    } else {
      pending.accepted = text.split(';').map((value) => value.trim()).filter(Boolean);
      if (!pending.accepted.length || pending.accepted.some((value) => value.length > 300)) { send('Каждый допустимый ответ должен быть от 1 до 300 символов.'); return; }
    }
    draft.step = 'explanation'; send('Объясни правильный ответ и типичную ошибку.');
  } else if (draft.step === 'explanation') {
    const { replaceId, ...question } = pending;
    const complete = { ...question, explanation: text };
    if (replaceId) {
      draft.lesson.questions = draft.lesson.questions.map((item) => item.id === replaceId ? { id: replaceId, ...complete } as Question : item);
    } else {
      let number = 1;
      while (draft.lesson.questions.some((item) => item.id === `q${number}`)) number++;
      draft.lesson.questions.push({ id: `q${number}`, ...complete } as Question);
    }
    draft.step = null; delete draft.pending;
    send('✅ Вопрос сохранён в черновике.\n\nДобавь следующий вопрос или опубликуй готовое задание.', { reply_markup: draftButtons() });
  }
}
