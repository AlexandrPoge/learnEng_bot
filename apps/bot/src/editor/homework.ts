import { draftButtons } from './controls.js';
import type { EditorBaseRequest } from './request.js';
import { randomBytes } from 'node:crypto';

export function handleEditorHomework(request: EditorBaseRequest): boolean {
  const { state, user, parts, command, draft, admin, send } = request;
  if (command === '/new_homework' || command === '/edit_homework') {
    if (user.activeAttempt || draft) {
      send('Сначала заверши практику /cancel или закрой черновик /discard.');
      return true;
    }
    delete user.workspace;
    const template = command === '/edit_homework' ? state.homeworkTemplates?.[parts[0]] : undefined;
    if (command === '/edit_homework' && (!template || (!admin && template.ownerId !== user.id))) {
      send('Своё ДЗ не найдено. /my_homework');
      return true;
    }
    const id = template?.id ?? `hw-${randomBytes(8).toString('hex')}`;
    (state.editors ??= {})[user.id] = {
      destination: 'homework',
      baseVersion: template?.lesson.version ?? 0,
      lesson: template
        ? structuredClone(template.lesson)
        : {
            id,
            title: '',
            level: 'A1',
            category: 'grammar',
            version: 1,
            estimatedMinutes: 10,
            theory: 'Выполни задания. Внимательно прочитай каждый вопрос.',
            questions: [],
          },
      step: null,
      ...(template ? {} : { inputField: 'title' }),
    };
    send(
      template
        ? `📝 Черновик ДЗ: ${template.lesson.title}`
        : '📝 Создаём своё ДЗ\n\nШаг 1. Отправь название. Затем добавь вопросы и правильные ответы.\n\nДЗ сохранится отдельно от общего учебника.',
      template ? { reply_markup: draftButtons() } : {},
    );
    return true;
  }
  return false;
}
