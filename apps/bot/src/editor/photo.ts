import { draftButtons } from './controls.js';
import type { EditorRequest } from './request.js';

export function handleEditorPhoto(request: EditorRequest): boolean {
  const { command, draft, send } = request;
  if (command === '/attach_rule' || command === '/remove_rule_photo') {
    if (draft.step || draft.inputField) {
      send('Сначала закончи текущее поле или вопрос.');
      return true;
    }
    if (command === '/remove_rule_photo') {
      delete draft.lesson.rulePhoto;
      delete draft.awaitingPhoto;
      send('Картинка убрана из черновика. Будут доступны карточки из текста.', {
        reply_markup: draftButtons(),
      });
    } else {
      draft.awaitingPhoto = true;
      send(
        '🖼 Отправь картинку правила как фото (не файл). Она сохранится в черновике. После этого нажми «Опубликовать». Отмена ожидания: /remove_rule_photo',
      );
    }
    return true;
  }
  return false;
}
