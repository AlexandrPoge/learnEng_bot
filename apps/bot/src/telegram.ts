import type { TelegramApi, TelegramPayload, TelegramResults } from '../../../packages/domain/types.js';
export class TelegramError extends Error {
  code: number | string;
  retryAfter?: number;
  constructor(code: number | string, retryAfter?: number) {
    super(`Telegram API: код ${code}`);
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

type Fetcher = (url: string, init: RequestInit) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;
export function telegramClient(token: string, fetcher: Fetcher = fetch): TelegramApi {
  return async <M extends keyof TelegramResults>(method: M, payload: TelegramPayload = {}, signal?: AbortSignal): Promise<TelegramResults[M]> => {
    let response;
    try {
      response = await fetcher(`https://api.telegram.org/bot${token}/${method}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), signal: signal ?? AbortSignal.timeout(45000),
      });
    } catch {
      // Не выводим URL запроса: он содержит токен.
      throw new TelegramError('network');
    }
    let data: { ok: boolean; result: TelegramResults[M]; error_code?: number; parameters?: { retry_after?: number } };
    try { data = await response.json() as typeof data; }
    catch { throw new TelegramError(response.status); }
    if (!response.ok || !data.ok) throw new TelegramError(data.error_code ?? response.status, data.parameters?.retry_after);
    return data.result;
  };
}
