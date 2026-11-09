import assert from 'node:assert/strict';
import { emptyState } from '../../../apps/bot/src/store.js';
import { handleUpdate } from '../../../apps/bot/src/handler.js';
import { lessons } from '../../../packages/content/catalog.js';
import type { Assignment, Attempt, BotState, Lesson } from '../../../packages/domain/types.js';

/** Общие данные и Telegram-действия для сценариев этого набора. */
export const recordId = (value: number) => value.toString(16).padStart(16, '0');

export const past = '2000-01-01T00:00:00.000Z';

export const future = '2099-01-01T00:00:00.000Z';

export function harness(initial: BotState = emptyState()) {
  const state = initial;

  function send(id: number, text: string) {
    handleUpdate(
      state,
      {
        update_id: state.offset,
        message: { from: { id }, chat: { id, type: 'private' }, text },
      },
      ['10', '11'],
      ['99'],
    );
  }

  function click(id: number, data: string) {
    handleUpdate(
      state,
      {
        update_id: state.offset,
        callback_query: {
          id: `cb-${state.offset}`,
          from: { id },
          message: { message_id: 100, chat: { id, type: 'private' } },
          data,
        },
      },
      ['10', '11'],
      ['99'],
    );
  }

  const last = (id = 20) =>
    state.outbox.filter((task) => task.payload.chat_id === String(id) && task.payload.text).at(-1)!.payload;
  const buttons = (id = 20) => last(id).reply_markup!.inline_keyboard!.flat();

  function press(label: string, id = 20) {
    const selected = buttons(id).find((button) => button.text.includes(label));
    assert.ok(selected?.callback_data, `Missing button: ${label}`);
    click(id, selected.callback_data);
  }

  send(20, '/menu');
  return { state, send, click, last, buttons, press };
}

export function assignment(state: BotState, number: number, overrides: Partial<Assignment> = {}): Assignment {
  const result: Assignment = {
    id: recordId(number),
    studentId: '20',
    teacherId: '10',
    lesson: { ...structuredClone(lessons[0]), title: `Работа ${number}` },
    deadline: future,
    createdAt: past,
    completedAt: null,
    ...overrides,
  };
  (state.assignments ??= {})[result.id] = result;
  return result;
}

export function completedAttempt(
  state: BotState,
  number: number,
  topic: string,
  correct: boolean[],
  overrides: Partial<Attempt> = {},
): Attempt {
  const lesson: Lesson = {
    ...structuredClone(lessons[0]),
    id: topic,
    title: topic,
    questions: correct.map((_, index) => ({
      id: `q${index}`,
      type: 'text',
      prompt: `Снимок вопроса ${index}`,
      accepted: ['saved-answer'],
      explanation: 'Объяснение из снимка',
    })),
  };
  const result: Attempt = {
    id: recordId(number),
    studentId: '20',
    teacherId: '10',
    lesson,
    startedAt: past,
    completedAt: new Date(Date.UTC(2020, 0, number)).toISOString(),
    answers: correct.map((value, index) => ({
      questionId: `q${index}`,
      value: value ? 'saved-answer' : 'wrong',
      correct: value,
    })),
    ...overrides,
  };
  state.attempts[result.id] = result;
  return result;
}
