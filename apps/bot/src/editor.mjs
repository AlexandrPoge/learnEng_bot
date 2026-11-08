import { lessons, validateCatalog } from '../../../packages/content/catalog.mjs';

export const availableLessons = (state) => {
  const merged = new Map(lessons.map((item) => [item.id, item]));
  for (const item of Object.values(state.lessonOverrides ?? {})) merged.set(item.id, item);
  return [...merged.values()];
};
export const findLesson = (state, id) => availableLessons(state).find((item) => item.id === id);

const editorHelp = 'Редактор:\n/edit ID — открыть урок\n/new ID — новый урок\n/title НАЗВАНИЕ\n/level A1\n/theory ТЕКСТ — правило, примеры, ловушки\n/add_question — добавить вопрос пошагово\n/edit_question q1 — заменить вопрос\n/remove_question q1 — удалить вопрос\n/preview — черновик и ключи\n/publish — опубликовать\n/discard — закрыть черновик\n/history ID — история\n/restore ID ВЕРСИЯ — восстановить (админ)';

export function handleEditor(state, user, text, { teacher, admin, send }) {
  const [raw, ...parts] = text.split(/\s+/u);
  const command = raw.split('@')[0].toLowerCase();
  const body = text.slice(raw.length).trim();
  const commands = ['/editor', '/edit', '/new', '/title', '/level', '/theory', '/add_question', '/edit_question', '/remove_question', '/preview', '/publish', '/discard', '/history', '/restore'];
  state.editors ??= {};
  let draft = state.editors[user.id];
  if (!commands.includes(command) && !(draft?.step && !text.startsWith('/'))) return false;
  if (!teacher) { send('Редактор доступен репетитору или администратору.'); return true; }
  if (command === '/editor') { send(editorHelp); return true; }
  if (command === '/discard') { delete state.editors[user.id]; send('Черновик закрыт.'); return true; }
  if (command === '/new' || command === '/edit') {
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
    send(`Открыт черновик: ${current?.title ?? id}. Ученики увидят изменения после /publish.\n\n${editorHelp}`);
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
    send(`Восстановлено как новая версия ${findLesson(state, id).version}.`);
    return true;
  }
  if (!draft) { send('Сначала открой /edit ID или /new ID'); return true; }
  if (draft.step && ['/add_question', '/edit_question', '/remove_question'].includes(command)) {
    send('Сначала закончи текущий вопрос или закрой черновик: /discard'); return true;
  }
  if (command === '/title') {
    if (!body || body.length > 100) send('Название: от 1 до 100 символов.');
    else { draft.lesson.title = body; send('Название сохранено в черновике.'); }
  } else if (command === '/level') {
    const level = body.toUpperCase();
    if (!['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(level)) send('Укажи уровень A1–C2.');
    else { draft.lesson.level = level; send('Уровень сохранён.'); }
  } else if (command === '/theory') {
    if (!body || body.length > 3500) send('Отправь /theory и текст до 3500 символов: правило, примеры и ловушки.');
    else { draft.lesson.theory = body; send('Объяснение сохранено в черновике.'); }
  } else if (command === '/add_question' || command === '/edit_question') {
    if (command === '/add_question' && draft.lesson.questions.length >= 20) { send('В одном уроке максимум 20 вопросов.'); return true; }
    if (command === '/edit_question' && !draft.lesson.questions.some((item) => item.id === parts[0])) { send('ID вопроса не найден. Посмотри /preview'); return true; }
    draft.pending = { replaceId: command === '/edit_question' ? parts[0] : null };
    draft.step = 'type';
    send('Тип вопроса: отправь choice (варианты) или text (пропуск).');
  } else if (command === '/remove_question') {
    const before = draft.lesson.questions.length;
    draft.lesson.questions = draft.lesson.questions.filter((item) => item.id !== parts[0]);
    send(before === draft.lesson.questions.length ? 'ID вопроса не найден.' : 'Вопрос удалён из черновика.');
  } else if (command === '/preview') {
    send(`${draft.lesson.title || '(без названия)'} · ${draft.lesson.level}\n\n${draft.lesson.theory || '(нет объяснения)'}`);
    for (const item of draft.lesson.questions) send(`${item.id}. ${item.prompt}\n${item.options?.map((option, index) => `${index + 1}. ${option}`).join('\n') ?? ''}\nКлюч: ${item.accepted.join(' / ')}\n${item.explanation}`);
    if (draft.step) send(`Добавление вопроса не закончено: ${draft.step}. Продолжи или /discard.`);
  } else if (command === '/publish') {
    if (draft.step) { send('Сначала закончи добавление вопроса.'); return true; }
    if ((findLesson(state, draft.lesson.id)?.version ?? 0) !== draft.baseVersion) { send('Урок изменён другим редактором. Сохрани свой текст, затем /discard и /edit ID для свежей версии.'); return true; }
    try { validateCatalog([draft.lesson]); }
    catch { send('Нужны название, объяснение и хотя бы один вопрос с правильным ключом. /preview'); return true; }
    publish(state, user.id, draft.lesson);
    send(`Опубликовано: ${draft.lesson.title}, версия ${findLesson(state, draft.lesson.id).version}.`);
    delete state.editors[user.id];
  } else if (draft.step && !text.startsWith('/')) {
    addQuestion(draft, text, send);
  }
  return true;
}

function publish(state, editorId, lesson) {
  state.lessonOverrides ??= {};
  state.lessonHistory ??= {};
  const old = findLesson(state, lesson.id);
  if (old) {
    state.lessonHistory[lesson.id] ??= [];
    state.lessonHistory[lesson.id].push({ lesson: structuredClone(old), editedBy: editorId, savedAt: new Date().toISOString() });
  }
  state.lessonOverrides[lesson.id] = { ...structuredClone(lesson), version: (old?.version ?? 0) + 1 };
}

function addQuestion(draft, text, send) {
  const pending = draft.pending;
  if (text.length > 1000) { send('Сократи ответ до 1000 символов.'); return; }
  if (draft.step === 'type') {
    if (!['choice', 'text'].includes(text.toLowerCase())) { send('Отправь choice или text.'); return; }
    pending.type = text.toLowerCase(); draft.step = 'prompt'; send('Отправь формулировку вопроса.');
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
      if (!Number.isInteger(index) || !pending.options[index]) { send('Укажи номер варианта из списка.'); return; }
      pending.accepted = [pending.options[index]];
    } else {
      pending.accepted = text.split(';').map((value) => value.trim()).filter(Boolean);
      if (!pending.accepted.length || pending.accepted.some((value) => value.length > 300)) { send('Каждый допустимый ответ должен быть от 1 до 300 символов.'); return; }
    }
    draft.step = 'explanation'; send('Объясни правильный ответ и типичную ошибку.');
  } else if (draft.step === 'explanation') {
    const { replaceId, ...question } = pending;
    question.explanation = text;
    if (replaceId) {
      draft.lesson.questions = draft.lesson.questions.map((item) => item.id === replaceId ? { id: replaceId, ...question } : item);
    } else {
      let number = 1;
      while (draft.lesson.questions.some((item) => item.id === `q${number}`)) number++;
      draft.lesson.questions.push({ id: `q${number}`, ...question });
    }
    draft.step = null; delete draft.pending;
    send('Вопрос сохранён в черновике. /add_question, /preview или /publish');
  }
}
