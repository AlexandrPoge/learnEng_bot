import { randomBytes } from 'node:crypto';
import { deadlineLabel } from '../../../../packages/domain/homework.js';
import type {
  BotState,
  Classroom,
  InlineButton,
  ReplyMarkup,
  TelegramPayload,
  User,
} from '../../../../packages/domain/types.js';

/** Общие проверки доступа и элементы управления учебными группами. */
export interface Context {
  teacher: boolean;
  admin: boolean;
  isTeacher(id: string): boolean;
  send(text: string, extra?: TelegramPayload): void;
  notify(id: string, text: string, extra?: TelegramPayload): void;
  panel(text: string, markup: ReplyMarkup): void;
  editor(text: string): void;
  topic(id: string): void;
}

export const button = (text: string, callback_data: string): InlineButton => ({ text, callback_data });

export const levelButtons = (nonce: string) => ({
  inline_keyboard: [
    ['A1', 'A2'],
    ['B1', 'B2'],
  ].map((row) => row.map((l) => button(l, `class:level:${nonce}:${l}`))),
});

export const key = () => randomBytes(4).toString('hex');

export const dueLabel = deadlineLabel;

export const manage = (c: Classroom, user: User, ctx: Context) =>
  ctx.teacher && (ctx.admin || c.ownerId === user.id);

export const canRead = (c: Classroom, user: User, ctx: Context) =>
  manage(c, user, ctx) || (ctx.isTeacher(c.ownerId) && c.studentIds.includes(user.id));

export const linkedStudents = (state: BotState, user: User, ctx: Context) =>
  Object.values(state.users).filter((s) =>
    s.id === user.id
      ? ctx.teacher
      : ctx.admin ||
        s.teacherId === user.id ||
        Object.values(state.classes ?? {}).some((c) => c.ownerId === user.id && c.studentIds.includes(s.id)),
  );

export function paged<T>(
  items: T[],
  page: number,
  row: (item: T) => InlineButton[],
  route: (page: number) => string,
  tail: InlineButton[][] = [],
) {
  const last = Math.max(0, Math.ceil(items.length / 6) - 1);
  const current = Number.isInteger(page) ? Math.min(Math.max(page, 0), last) : 0;
  const rows = items.slice(current * 6, current * 6 + 6).map(row);
  const arrows: InlineButton[] = [];
  if (current) arrows.push(button('⬅️ Назад', route(current - 1)));
  if (current < last) arrows.push(button('Дальше ➡️', route(current + 1)));
  if (arrows.length) rows.push(arrows);
  return { inline_keyboard: [...rows, ...tail] };
}
