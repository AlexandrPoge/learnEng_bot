import type { Attempt } from './types.js';

// Это оценка интервалов между действиями, не измерение внимания ученика.
export function recordActivity(attempt: Attempt, now = new Date().toISOString()) {
  if (attempt.lastActivityAt !== undefined && attempt.engagedMs !== undefined) {
    const interval = Date.parse(now) - Date.parse(attempt.lastActivityAt);
    if (interval >= 0 && interval <= 5 * 60_000) attempt.engagedMs += interval;
    attempt.lastActivityAt = now;
  }
}

export function timeSummary(attempt: Attempt) {
  const seconds = Math.max(0, Math.round((Date.parse(attempt.completedAt ?? new Date().toISOString()) - Date.parse(attempt.startedAt)) / 1000));
  return `⏱ Всего: ${seconds} сек. (включая перерывы)` +
    (attempt.engagedMs === undefined ? '' : `\nМежду действиями: ≈${Math.round(attempt.engagedMs / 1000)} сек.\nИнтервалы больше 5 минут исключены; это оценка.`);
}
