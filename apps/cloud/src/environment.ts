import type { Storage } from './sql-store.js';

/** Окружение Worker и доступ к хранилищу Durable Object. */
export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TEACHER_IDS?: string;
  ADMIN_IDS: string;
  WEBHOOK_SECRET: string;
  CLOUD_ADMIN_KEY: string;
  BOT: {
    idFromName(name: string): unknown;
    get(id: unknown): { fetch(request: Request): Promise<Response> };
  };
}

export interface Context {
  storage: Storage;
  waitUntil(promise: Promise<unknown>): void;
}
