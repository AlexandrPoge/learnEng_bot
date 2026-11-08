import { timingSafeEqual, createHash } from 'node:crypto';
import type { BotState, TelegramUpdate } from '../../../packages/domain/types.js';

export function matches(value: string | null, secret: string | undefined) {
  if (!value || !secret || value.length !== secret.length) return false;
  const a = Buffer.from(value); const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function validUpdate(value: any): value is TelegramUpdate {
  if (!value || !Number.isSafeInteger(value.update_id) || value.update_id < 0) return false;
  const m = value.callback_query?.message ?? value.message;
  if (m?.text !== undefined && typeof m.text !== 'string') return false;
  if (value.callback_query?.data !== undefined && typeof value.callback_query.data !== 'string') return false;
  return true;
}
export function validateImport(value: any): asserts value is BotState {
  if (value?.version !== 1 || !Number.isSafeInteger(value.offset) || value.offset < 0 || !value.users || !value.attempts || !value.invites || !Array.isArray(value.outbox)) throw new Error('Invalid snapshot');
  for (const [id, user] of Object.entries(value.users) as [string, any][]) {
    if (user.id !== id || !/^[1-9]\d*$/u.test(id) || typeof user.name !== 'string') throw new Error('Invalid user');
    if (user.activeAttempt && (!value.attempts[user.activeAttempt] || value.attempts[user.activeAttempt].studentId !== id)) throw new Error('Invalid attempt reference');
  }
}
function canonical(value: any): any {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])]));
  return value;
}
export const fingerprint = (state: BotState) => createHash('sha256').update(JSON.stringify(canonical(state))).digest('hex');
