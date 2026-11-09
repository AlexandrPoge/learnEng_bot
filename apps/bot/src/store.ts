import { mkdir, open, readFile, rename, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { BotState } from '../../../packages/domain/types.js';

export function emptyState(): BotState {
  return { version: 1, offset: 0, users: {}, attempts: {}, invites: {}, outbox: [] };
}

// Владелец файла — один процесс. Вторая копия бота не должна перезаписывать данные.
export async function openStore(path: string) {
  await mkdir(dirname(path), { recursive: true });
  let lock;
  try {
    lock = await open(`${path}.lock`, 'wx', 0o600);
  } catch (error) {
    if (error.code === 'EEXIST')
      throw new Error('Хранилище занято: проверьте, не запущена ли другая копия бота. См. README.');
    throw error;
  }
  let state: BotState;
  try {
    try {
      state = JSON.parse(await readFile(path, 'utf8'));
    } catch (error) {
      if (error.code === 'ENOENT') state = emptyState();
      else throw error;
    }
    if (state.version !== 1 || !state.users || !state.attempts || !Array.isArray(state.outbox)) {
      throw new Error('Неподдерживаемый или повреждённый файл данных.');
    }
  } catch (error) {
    await lock.close();
    await rm(`${path}.lock`);
    throw error;
  }
  return {
    get state() {
      return state;
    },
    async commit(next: BotState) {
      const file = await open(`${path}.tmp`, 'w', 0o600);
      try {
        await file.writeFile(JSON.stringify(next));
        await file.sync();
      } finally {
        await file.close();
      }
      await rename(`${path}.tmp`, path);
      state = next;
    },
    async close() {
      await lock.close();
      await rm(`${path}.lock`);
    },
  };
}
