export function parseDeadline(value: string | undefined) {
  // Смещение явно: 2026-11-20T18:00+03:00. Не зависит от часового пояса сервера.
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(Z|[+-]\d{2}:\d{2})$/u.exec(value ?? '');
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  const calendar = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (calendar.getUTCFullYear() !== Number(year) || calendar.getUTCMonth() + 1 !== Number(month) || calendar.getUTCDate() !== Number(day) || Number(hour) > 23 || Number(minute) > 59) return null;
  const timestamp = Date.parse(value!);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}
