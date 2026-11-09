import { send } from '../ui/messages.js';
import { showHome, showMode } from '../ui/home.js';
import { showTextbook, showSchoolYears } from '../catalog/textbook.js';
import { showSchool } from '../catalog/school.js';
import { showCatalog } from '../catalog/levels.js';
import { showGroups } from '../catalog/groups.js';
import type { CallbackContext } from '../routing/context.js';
import type { Category, GrammarStrand, Level } from '../../../../packages/domain/types.js';

export function handleCatalogCallback(request: CallbackContext): boolean {
  const { state, id, user, access, data, messageId } = request;
  if (data === 'book') {
    showTextbook(state, user, messageId);
    return true;
  }
  if (data === 'book:school') {
    showSchoolYears(state, user, messageId);
    return true;
  }
  if (data === 'book:levels') {
    showCatalog(state, user, undefined, 0, messageId);
    return true;
  }
  const schoolMatch = /^school:(\d{1,2})(?::(foundation|grammar|vocabulary|situations|all):(\d+))?$/u.exec(
    data,
  );
  if (schoolMatch) {
    showSchool(
      state,
      user,
      Number(schoolMatch[1]),
      schoolMatch[2] ? (schoolMatch[2] === 'all' ? null : (schoolMatch[2] as Category)) : undefined,
      Number(schoolMatch[3] ?? 0),
      messageId,
    );
    return true;
  }
  const strandMatch = /^schg:(\d{1,2}):(tenses|nouns|modifiers|verbs|sentences|all):(\d+)$/u.exec(data);
  if (strandMatch) {
    showSchool(
      state,
      user,
      Number(strandMatch[1]),
      'grammar',
      Number(strandMatch[3]),
      messageId,
      strandMatch[2] as GrammarStrand | 'all',
    );
    return true;
  }
  if (data === 'levels') {
    showCatalog(state, user, undefined, 0, messageId);
    return true;
  }
  if (data === 'mode') {
    showMode(state, user, messageId);
    return true;
  }
  const groupsMatch = /^groups:(A1|A2|B1|B2|C1|C2)$/u.exec(data);
  if (groupsMatch) {
    showGroups(state, user, groupsMatch[1] as Level, messageId);
    return true;
  }
  if (data === 'mode:child' || data === 'mode:adult') {
    user.learningMode = data === 'mode:child' ? 'child' : 'adult';
    send(
      state,
      id,
      user.learningMode === 'child'
        ? '🧒 Включена простая подача. Будем учиться небольшими шагами.'
        : '🧑 Включена подача для взрослых.',
    );

    showHome(state, user, access);
    return true;
  }
  return false;
}
