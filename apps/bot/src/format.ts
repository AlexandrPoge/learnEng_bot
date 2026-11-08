import type { RichText, TextEntity } from '../../../packages/domain/types.js';
// Telegram entities используют UTF-16, как String.length в TypeScript.
// Учебный текст остаётся обычным текстом, разметка преподавателя не исполняется.
export function richText() {
  const value: RichText = { text: '', entities: [] };
  return {
    add(text: string, type?: TextEntity['type']) {
      const part = String(text ?? '');
      if (type && part.length) value.entities.push({ type, offset: value.text.length, length: part.length });
      value.text += part;
      return this;
    },
    build() { return value; },
  };
}

export function readable(text: string) {
  return text.replace(/\s+·\s+/gu, '\n').replace(/([.!?])\s+(?=[А-ЯЁA-Z])/gu, '$1\n\n').replace(/;\s+/gu, ';\n');
}

export function exampleBlocks(text: string) {
  const dash = text.indexOf(' — ');
  if (dash < 0) return richText().add(readable(text)).build();
  const english = text.slice(0, dash);
  const rest = text.slice(dash + 3);
  const match = /^(.*?[.!?])\s+(.+)$/u.exec(rest);
  const translation = match ? match[1] : rest;
  const explanation = match?.[2]?.replace(/^(Разбор|Почему):\s*/u, '');
  const result = richText().add('🇬🇧 Пример\n', 'bold').add(english, 'bold')
    .add('\n\n🇷🇺 Перевод\n', 'bold').add(translation);
  if (explanation) result.add('\n\n🔎 Почему так\n', 'bold').add(readable(explanation));
  return result.build();
}

export function splitMessage(text: string, entities: TextEntity[] = [], limit = 1900) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + limit, text.length);
    if (end < text.length && /[\uDC00-\uDFFF]/u.test(text[end])) end--;
    const slice = text.slice(start, end);
    const localEntities = entities.flatMap((entity) => {
      const left = Math.max(start, entity.offset);
      const right = Math.min(end, entity.offset + entity.length);
      return right > left ? [{ ...entity, offset: left - start, length: right - left }] : [];
    });
    chunks.push({ text: slice, ...(localEntities.length ? { entities: localEntities } : {}) });
    start = end;
  }
  return chunks;
}

export function combine(...parts: (string | RichText)[]): RichText {
  const result: RichText = { text: '', entities: [] };
  for (const part of parts) {
    const item = typeof part === 'string' ? { text: part, entities: [] } : part;
    result.entities.push(...(item.entities ?? []).map((entity) => ({ ...entity, offset: entity.offset + result.text.length })));
    result.text += item.text;
  }
  return result;
}
