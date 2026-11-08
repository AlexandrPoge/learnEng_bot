export class TelegramError extends Error {
  constructor(code, retryAfter) {
    super(`Telegram API: код ${code}`);
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

export function telegramClient(token, fetcher = fetch) {
  return async (method, payload = {}, signal) => {
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
    let data;
    try { data = await response.json(); }
    catch { throw new TelegramError(response.status); }
    if (!response.ok || !data.ok) throw new TelegramError(data.error_code ?? response.status, data.parameters?.retry_after);
    return data.result;
  };
}
