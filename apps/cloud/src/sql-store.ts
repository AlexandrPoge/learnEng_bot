import type { BotState, TelegramUpdate } from '../../../packages/domain/types.js';

export interface Cursor<T> extends Iterable<T> { toArray(): T[]; rowsWritten: number }
export interface Sql { exec<T = Record<string, unknown>>(query: string, ...values: (string | number | null)[]): Cursor<T> }
export interface Storage { sql: Sql; transactionSync<T>(fn: () => T): T; getAlarm(): Promise<number | null>; setAlarm(time: number): Promise<void>; deleteAlarm(): Promise<void> }
const mapKeys = new Set(['users', 'attempts', 'invites', 'teacherWelcome', 'assignments', 'editors', 'lessonOverrides', 'lessonHistory', 'classes', 'classInvites', 'homeworkTemplates', 'ruleImages']);
function rows(state: BotState) {
  const result = new Map<string, { bucket: string; id: string; value: string }>();
  const put = (bucket: string, id: string, value: unknown) => result.set(JSON.stringify([bucket, id]), { bucket, id, value: JSON.stringify(value) });
  put('meta', 'mapFields', Object.keys(state).filter(key => mapKeys.has(key)));
  for (const [key, value] of Object.entries(state)) {
    if (key === 'outbox') {
      put('meta', 'outboxOrder', state.outbox.map(t => t.id));
      for (const task of state.outbox) put('outbox', task.id, task);
    } else if (mapKeys.has(key)) for (const [id, item] of Object.entries(value)) put(key, id, item);
    else put('meta', key, value);
  }
  return result;
}

export class SqlStore {
  constructor(readonly storage: Storage) {
    storage.sql.exec('CREATE TABLE IF NOT EXISTS records (bucket TEXT NOT NULL, id TEXT NOT NULL, value TEXT NOT NULL, PRIMARY KEY(bucket,id))');
    storage.sql.exec('CREATE TABLE IF NOT EXISTS inbox (id INTEGER PRIMARY KEY, payload TEXT NOT NULL)');
    storage.sql.exec('CREATE TABLE IF NOT EXISTS processed (id INTEGER PRIMARY KEY)');
    storage.sql.exec('CREATE TABLE IF NOT EXISTS settings (id TEXT PRIMARY KEY, value TEXT NOT NULL)');
  }
  setting(key: string) { return this.storage.sql.exec<{ value: string }>('SELECT value FROM settings WHERE id = ?', key).toArray()[0]?.value; }
  set(key: string, value: string) { this.storage.sql.exec('INSERT INTO settings(id,value) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value', key, value); }
  initialized() { return this.setting('initialized') === '1'; }
  load(): BotState {
    const state: Record<string, any> = { users: {}, attempts: {}, invites: {}, outbox: [] };
    const tasks: Record<string, any> = {};
    let order: string[] = [];
    for (const row of this.storage.sql.exec<{ bucket: string; id: string; value: string }>('SELECT bucket,id,value FROM records')) {
      const value = JSON.parse(row.value);
      if (row.bucket === 'meta') {
        if (row.id === 'outboxOrder') order = value;
        else if (row.id === 'mapFields') for (const key of value) state[key] ??= {};
        else state[row.id] = value;
      }
      else if (row.bucket === 'outbox') tasks[row.id] = value;
      else (state[row.bucket] ??= {})[row.id] = value;
    }
    state.outbox = order.map(id => tasks[id]).filter(Boolean);
    if (state.version !== 1 || !Number.isSafeInteger(state.offset)) throw new Error('Cloud state is not initialized');
    return state as BotState;
  }
  save(before: BotState | undefined, next: BotState) {
    const oldRows = before ? rows(before) : new Map();
    const newRows = rows(next);
    for (const [key, row] of newRows) if (oldRows.get(key)?.value !== row.value) this.storage.sql.exec('INSERT INTO records(bucket,id,value) VALUES(?,?,?) ON CONFLICT(bucket,id) DO UPDATE SET value=excluded.value', row.bucket, row.id, row.value);
    for (const [key, row] of oldRows) if (!newRows.has(key)) this.storage.sql.exec('DELETE FROM records WHERE bucket=? AND id=?', row.bucket, row.id);
  }
  import(state: BotState) {
    if (this.initialized()) throw new Error('Already initialized');
    this.storage.transactionSync(() => {
      this.save(undefined, state);
      this.set('floor', String(state.offset)); this.set('initialized', '1'); this.set('active', '0');
    });
  }
  enqueue(update: TelegramUpdate) {
    if (update.update_id < Number(this.setting('floor') ?? 0)) return;
    this.storage.sql.exec('INSERT OR IGNORE INTO inbox(id,payload) SELECT ?,? WHERE NOT EXISTS(SELECT 1 FROM processed WHERE id=?)', update.update_id, JSON.stringify(update), update.update_id);
  }
  pending() { return this.storage.sql.exec<{ id: number; payload: string }>('SELECT id,payload FROM inbox ORDER BY id LIMIT 10').toArray(); }
  applied(updateId: number, before: BotState, next: BotState) {
    this.storage.transactionSync(() => {
      this.save(before, next);
      this.storage.sql.exec('INSERT OR IGNORE INTO processed(id) VALUES(?)', updateId);
      this.storage.sql.exec('DELETE FROM inbox WHERE id=?', updateId);
    });
  }
}
