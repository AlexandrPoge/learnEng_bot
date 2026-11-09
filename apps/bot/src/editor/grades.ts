import { draftButtons } from './controls.js';
import type { EditorRequest } from './request.js';

export function handleEditorGrades(request: EditorRequest): boolean {
  const { command, body, draft, send } = request;
  if (command === '/school_grades') {
    if (draft.destination === 'homework') {
      send('Свои ДЗ назначаются ученикам или группам. Школьные классы выбираются для тем общего учебника.');
      return true;
    }
    if (draft.step || draft.awaitingPhoto) {
      send('Сначала закончи вопрос или картинку.');
      return true;
    }
    if (!body) {
      draft.inputField = 'school_grades';
      send(
        '🏫 В каких школьных классах показывать тему?\n\nОтправь номера от 1 до 11 через запятую: 3, 4, 5\n0 — оставить только в уровнях.\n\nЭто разделы учебника, не группы учеников. Изменение применится после публикации.',
      );
      return true;
    }
    const grades = body === '0' ? [] : body.split(/[,\s]+/u).map(Number);
    if (grades.some((g) => !Number.isInteger(g) || g < 1 || g > 11)) {
      draft.inputField = 'school_grades';
      send('Нужны номера от 1 до 11, например 3, 4, 5. Или 0 — убрать из школьных классов.');
      return true;
    }
    draft.lesson.schoolGrades = [...new Set(grades)].sort((a, b) => a - b);
    send(
      `✅ В черновике: ${grades.length ? `классы ${draft.lesson.schoolGrades.join(', ')}` : 'только уровни'}.`,
      { reply_markup: draftButtons() },
    );
    return true;
  }
  return false;
}
