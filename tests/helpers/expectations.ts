import assert from 'node:assert/strict';
import type { BotState, TelegramPayload } from '../../packages/domain/types.js';

/** Проверяет предпосылку теста и одновременно сужает тип значения. */
export function expectValue<T>(value: T, message = 'Expected a defined test value'): NonNullable<T> {
  assert.ok(value !== undefined && value !== null, message);
  return value;
}

export function expectText(payload: TelegramPayload): string {
  return expectValue(payload.text, 'Expected a text message');
}

export function expectInlineKeyboard(payload: TelegramPayload) {
  const markup = expectValue(payload.reply_markup, 'Expected reply markup');
  return expectValue(markup.inline_keyboard, 'Expected an inline keyboard');
}

export function expectReplyKeyboard(payload: TelegramPayload) {
  const markup = expectValue(payload.reply_markup, 'Expected reply markup');
  return expectValue(markup.keyboard, 'Expected a reply keyboard');
}

export function assignedHomework(state: BotState) {
  return expectValue(state.assignments, 'Expected assigned homework');
}
