import type { Resource } from '../../domain/types.js';

/** Единые подписи, адреса и даты проверки внешних источников. */
export const adult = 'https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/';

export const kids = 'https://learnenglishkids.britishcouncil.org/grammar-vocabulary/';

export const article = (
  title: string,
  url: string,
  note = 'Объяснение и упражнения на английском.',
): Resource => ({
  title,
  url,
  note,
  kind: 'article',
  provider: 'British Council',
  checkedAt: '2026-11-08',
});

export const video = (title: string, slug: string, note: string): Resource => ({
  title,
  url: `${kids}grammar-videos/${slug}`,
  note,
  kind: 'video',
  provider: 'British Council LearnEnglish Kids',
  language: 'en',
  checkedAt: '2026-11-08',
});

export const simpleVideo = video(
  'The woolly jumper',
  'woolly-jumper',
  'Сравни, что герой делает обычно и прямо сейчас. Видео на английском.',
);
