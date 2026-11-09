import { renderRuleImage, ruleImageKey } from './rule-images.js';
import type { BotState, OutboxTask, TelegramApi } from '../../../packages/domain/types.js';

export async function deliverTask(
  state: BotState,
  task: OutboxTask,
  api: TelegramApi,
  signal?: AbortSignal,
): Promise<{ key: string; fileId: string } | undefined> {
  if (task.method !== 'sendPhoto' || !task.ruleCard) {
    await api(task.method, task.payload, signal);
    return;
  }
  const { lesson, page } = task.ruleCard;
  const key = ruleImageKey(lesson, page);
  const cached = state.ruleImages?.[key];
  if (cached) {
    try {
      await api('sendPhoto', { ...task.payload, photo: cached }, signal);
      return;
    } catch (error) {
      if (error.code !== 400) throw error;
    }
  }
  let photo: Blob;
  try {
    photo = new Blob([new Uint8Array(await renderRuleImage(lesson, page))], { type: 'image/png' });
  } catch {
    await api(
      'sendMessage',
      {
        chat_id: task.payload.chat_id,
        text: 'Картинка временно недоступна. Открой «📖 Правило» — весь текст сохранён там.',
        reply_markup: task.payload.reply_markup,
      },
      signal,
    );
    return;
  }
  const result = await api('sendPhoto', { ...task.payload, photo }, signal);
  const fileId = result.photo?.at(-1)?.file_id;
  return fileId ? { key, fileId } : undefined;
}
