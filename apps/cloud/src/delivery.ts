import { Resvg, initWasm } from '@resvg/resvg-wasm';
import wasm from '@resvg/resvg-wasm/index_bg.wasm';
import font from '../assets/NotoSans-Regular.ttf';
import bold from '../assets/NotoSans-Bold.ttf';
import symbols from '../assets/NotoSansSymbols2-Regular.ttf';
import basicSymbols from '../assets/NotoSansSymbols-Regular.ttf';
import { ruleImageKey, ruleImageSvg } from '../../bot/src/rule-layout.js';
import type { BotState, OutboxTask, TelegramApi } from '../../../packages/domain/types.js';
let initialized: Promise<void> | undefined;

export async function cloudDelivery(state: BotState, task: OutboxTask, api: TelegramApi) {
  if (task.method !== 'sendPhoto' || !task.ruleCard) {
    await api(task.method, task.payload);
    return;
  }
  const { lesson, page } = task.ruleCard;
  const key = ruleImageKey(lesson, page);
  const cached = state.ruleImages?.[key];
  if (cached) {
    try {
      await api('sendPhoto', { ...task.payload, photo: cached });
      return;
    } catch (error) {
      if (error.code !== 400) throw error;
    }
  }
  let photo: Blob;
  try {
    initialized ??= initWasm(wasm).catch((error) => {
      initialized = undefined;
      throw error;
    });
    await initialized;
    const svg = ruleImageSvg(lesson, page).replaceAll(
      'Arial, sans-serif',
      'Noto Sans, Noto Sans Symbols, Noto Sans Symbols 2, sans-serif',
    );
    const renderer = new Resvg(svg, {
      font: {
        fontBuffers: [
          new Uint8Array(font),
          new Uint8Array(bold),
          new Uint8Array(basicSymbols),
          new Uint8Array(symbols),
        ],
        defaultFontFamily: 'Noto Sans',
        sansSerifFamily: 'Noto Sans',
      },
    });
    try {
      const rendered = renderer.render();
      try {
        photo = new Blob([new Uint8Array(rendered.asPng())], { type: 'image/png' });
      } finally {
        rendered.free();
      }
    } finally {
      renderer.free();
    }
  } catch {
    await api('sendMessage', {
      chat_id: task.payload.chat_id,
      text: 'Картинка временно недоступна. Открой «📖 Правило» — весь текст сохранён там.',
      reply_markup: task.payload.reply_markup,
    });
    return;
  }
  const message = await api('sendPhoto', { ...task.payload, photo });
  const fileId = message.photo?.at(-1)?.file_id;
  return fileId ? { key, fileId } : undefined;
}
