import type { InlineButton, ReplyMarkup } from '../../../packages/domain/types.js';

export interface PanelContent {
  text: string;
  markup: ReplyMarkup;
}

export function button(text: string, callback_data: string): InlineButton {
  return { text, callback_data };
}

/** При изменении списка старая кнопка открывает ближайшую существующую страницу. */
export function paginate<T>(items: T[], requestedPage: number, size = 5) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const page = Number.isSafeInteger(requestedPage) ? Math.max(0, Math.min(requestedPage, pages - 1)) : 0;

  return { page, pages, items: items.slice(page * size, (page + 1) * size) };
}

export function pageButtons(page: number, pages: number, route: (page: number) => string): InlineButton[][] {
  const arrows: InlineButton[] = [];
  if (page > 0) {
    arrows.push(button('⬅️ Назад', route(page - 1)));
  }
  if (page + 1 < pages) {
    arrows.push(button('Дальше ➡️', route(page + 1)));
  }

  return arrows.length ? [arrows] : [];
}
