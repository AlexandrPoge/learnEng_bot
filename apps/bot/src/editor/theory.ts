import { draftButtons } from './controls.js';
import type { EditorRequest } from './request.js';
import { lessonSections } from '../../../../packages/content/presentation.js';
import type { Section } from '../../../../packages/domain/types.js';

export function handleEditorTheory(request: EditorRequest): boolean {
  const { command, body, draft, send } = request;
  if (command === '/theory') {
    if (!body || body.length > 12000)
      send('Отправь /theory и текст до 12000 символов: правило, примеры и ловушки.');
    else {
      draft.lesson.theory = body;
      delete draft.lesson.childIntro;
      delete draft.lesson.memory;
      send('📖 Объяснение сохранено в черновике.', { reply_markup: draftButtons() });
    }
    return true;
  }
  if (['/rule', '/examples', '/traps'].includes(command)) {
    if (body.length > 5000) {
      send('Сократи раздел до 5000 символов или раздели его на несколько сообщений-команд.');
      return true;
    }
    const sections = lessonSections(draft.lesson, { fallback: false });
    sections[command.slice(1) as Section] = body.split('\n').filter((line) => line.trim());
    const theory = [
      sections.rule.join('\n'),
      `Примеры:\n${sections.examples.join('\n')}`,
      `Ловушки:\n${sections.traps.join('\n')}`,
    ].join('\n\n');
    if (theory.length > 12000) {
      send('Весь урок должен помещаться в 12000 символов. Сократи раздел.');
      return true;
    }
    draft.lesson.theory = theory;
    if (command === '/rule') {
      delete draft.lesson.childIntro;
      delete draft.lesson.memory;
    }
    send('✅ Раздел сохранён в черновике.', { reply_markup: draftButtons() });
    return true;
  }
  return false;
}
