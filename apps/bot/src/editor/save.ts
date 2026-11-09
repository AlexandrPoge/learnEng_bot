import { findLesson } from './catalog.js';
import { publish } from './publish.js';
import type { EditorRequest } from './request.js';
import { validateCatalog } from '../../../../packages/content/catalog.js';

export function handleEditorSave(request: EditorRequest): boolean {
  const { state, user, command, draft, admin, send } = request;
  if (command === '/publish') {
    if (draft.step || draft.inputField || draft.awaitingPhoto) {
      send('Сначала закончи редактирование текущего поля, картинки или вопроса.');
      return true;
    }
    const template = state.homeworkTemplates?.[draft.lesson.id];
    if (draft.destination === 'homework' && template && !admin && template.ownerId !== user.id) {
      send('Нет доступа к этому ДЗ.');
      return true;
    }
    const currentVersion =
      draft.destination === 'homework'
        ? template?.lesson.version
        : findLesson(state, draft.lesson.id)?.version;
    if ((currentVersion ?? 0) !== draft.baseVersion) {
      send('Материал изменён другим редактором. Сохрани свой текст и открой свежую версию после /discard.');
      return true;
    }
    try {
      validateCatalog([draft.lesson]);
    } catch {
      send('Нужны название, объяснение и хотя бы один вопрос с правильным ключом. /preview');
      return true;
    }
    if (draft.destination === 'homework') {
      state.homeworkTemplates ??= {};
      state.homeworkTemplates[draft.lesson.id] = {
        id: draft.lesson.id,
        ownerId: template?.ownerId ?? user.id,
        lesson: { ...structuredClone(draft.lesson), version: (currentVersion ?? 0) + 1 },
        updatedAt: new Date().toISOString(),
      };
      send(`✅ ДЗ сохранено: ${draft.lesson.title}\n\nТеперь выбери, кому его назначить.`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📨 Назначить', callback_data: `work:send:${draft.lesson.id}` }],
            [{ text: '📝 Мои ДЗ', callback_data: 'work:list:0' }],
          ],
        },
      });
    } else {
      publish(state, user.id, draft.lesson);
      send(`Опубликовано: ${draft.lesson.title}, версия ${findLesson(state, draft.lesson.id)!.version}.`);
    }
    delete state.editors?.[user.id];
    return true;
  }
  return false;
}
