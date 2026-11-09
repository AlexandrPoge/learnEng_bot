import type { Context } from '../classrooms/shared.js';
import { button, key } from '../classrooms/shared.js';
import { targetPicker } from './targets.js';
import type { BotState, Lesson, User } from '../../../../packages/domain/types.js';

/** Подготовка назначения: срок и режим проверки. */
export function beginAssignment(state: BotState, user: User, lesson: Lesson, ctx: Context) {
  if (user.activeAttempt || state.editors?.[user.id]) {
    ctx.send('Сначала заверши практику /cancel или закрой черновик /discard.');
    return;
  }
  user.workspace = { kind: 'assign', nonce: key(), lesson: structuredClone(lesson), step: 'target' };
  targetPicker(state, user, ctx);
}

export function deadlinePicker(user: User, ctx: Context) {
  const draft = user.workspace;
  if (draft?.kind !== 'assign') return;
  ctx.panel(
    '📅 Шаг 2 из 4 · Срок сдачи\n\nВыбери срок кнопкой или отправь дату:\n2099-11-20T18:00+03:00\n\nЧасовой пояс обязателен. В карточках время показано по UTC+3.',
    {
      inline_keyboard: [
        [1, 3, 7].map((days) => button(`Через ${days} дн.`, `work:due:${draft.nonce}:${days}`)),
        [button('✖️ Отменить', 'work:cancel')],
      ],
    },
  );
}

export function modePicker(user: User, ctx: Context) {
  const draft = user.workspace;
  if (draft?.kind !== 'assign') return;
  draft.step = 'mode';
  ctx.panel(
    '⚙️ Шаг 3 из 4 · Как проверять?\n\n🌱 Тренировка — подсказки и объяснение после каждого ответа.\n\n🧪 Проверочная — правильные ответы и разбор только после сдачи. Можно читать учебник: это не экзамен под наблюдением.',
    {
      inline_keyboard: [
        [button('🌱 Тренировка', `work:mode:${draft.nonce}:practice`)],
        [button('🧪 Проверочная', `work:mode:${draft.nonce}:test`)],
        [button('✖️ Отменить', 'work:cancel')],
      ],
    },
  );
}
