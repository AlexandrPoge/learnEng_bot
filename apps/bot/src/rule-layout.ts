import { createHash } from 'node:crypto';
import { lessonSections } from '../../../packages/content/presentation.js';
import type { Lesson } from '../../../packages/domain/types.js';

const escapeXml = (s: string) => s.replace(/[<>&"']/gu, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]!));
function wrap(text: string, width: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/u)) {
    const chunks = Array.from(word).join('').match(new RegExp(`.{1,${width}}`, 'gu')) ?? [];
    for (const chunk of chunks) {
      if (line && Array.from(`${line} ${chunk}`).length > width) { lines.push(line); line = ''; }
      line += `${line ? ' ' : ''}${chunk}`;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function ruleImagePages(lesson: Lesson): string[][] {
  const pages: string[][] = [];
  let current: string[] = [];
  for (const paragraph of lessonSections(lesson).rule) {
    const lines = wrap(paragraph, 48);
    if (current.length && current.length + lines.length + 1 > 17) { pages.push(current); current = []; }
    while (lines.length > 17) pages.push(lines.splice(0, 17));
    if (lines.length) current.push(...(current.length ? [''] : []), ...lines);
  }
  if (current.length) pages.push(current);
  return pages.length ? pages : [['Правило пока не добавлено.']];
}
export function ruleImageKey(lesson: Lesson, page: number) {
  return createHash('sha256').update(JSON.stringify({ renderer: 1, title: lesson.title, level: lesson.level, memory: lesson.memory, rule: lessonSections(lesson).rule, page })).digest('hex');
}

export function ruleImageSvg(lesson: Lesson, page: number) {
  const pages = ruleImagePages(lesson);
  if (!pages[page]) throw new Error('Карточка не найдена');
  const titles = wrap(lesson.title, 31);
  const memory = lesson.memory ? wrap(lesson.memory, 48) : [];
  const bodyY = 210 + titles.length * 53 + (memory.length ? memory.length * 42 + 65 : 0);
  const height = bodyY + pages[page].length * 45 + 140;
  const line = (text: string, x: number, y: number, size = 32, fill = '#183244', weight = 400) => `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeXml(text)}</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="${height}" viewBox="0 0 1080 ${height}">
    <rect width="1080" height="${height}" fill="#edf4f8"/>
    <rect x="35" y="35" width="1010" height="${height - 70}" rx="35" fill="white"/>
    <rect x="75" y="75" width="175" height="47" rx="23" fill="#deefe8"/>
    ${line(`ENGLISH · ${lesson.level}`, 95, 106, 23, '#23715b', 700)}
    ${titles.map((t, i) => line(t, 75, 191 + i * 53, 43, '#102e42', 700)).join('')}
    ${memory.length ? `<rect x="65" y="${200 + titles.length * 53}" width="950" height="${memory.length * 42 + 30}" rx="22" fill="#eff7f2"/>${memory.map((t, i) => line(t, 85, 242 + titles.length * 53 + i * 42, 31, '#23715b', 600)).join('')}` : ''}
    ${line('ПРАВИЛО', 75, bodyY - 23, 22, '#6c7f8b', 700)}
    ${pages[page].map((t, i) => line(t, 75, bodyY + 38 + i * 45)).join('')}
    <line x1="75" x2="1005" y1="${height - 112}" y2="${height - 112}" stroke="#e4edf3"/>
    ${line('Прочитай → найди пример → попробуй сам', 75, height - 70, 24, '#6c7f8b')}
    ${line(`${page + 1} / ${pages.length}`, 945, 106, 23, '#6c7f8b')}
  </svg>`;
  return svg;
}
