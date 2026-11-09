import { guides } from './presentation/guides.js';
import type { Lesson, Section } from '../domain/types.js';

export function enrichLesson(lesson: Lesson): Lesson {
  const guide = guides[lesson.id];
  return guide
    ? { ...lesson, icon: guide[0], goal: guide[1], memory: guide[2], childIntro: guide[3] }
    : lesson;
}

export function lessonSections(
  lesson: Pick<Lesson, 'theory'>,
  { fallback = true } = {},
): Record<Section, string[]> {
  const sections: Record<Section, string[]> = { rule: [], examples: [], traps: [] };
  let section: Section = 'rule';
  for (const raw of lesson.theory.split('\n')) {
    let line = raw.trim();
    if (!line) continue;
    if (/^Примеры:/iu.test(line)) {
      section = 'examples';
      line = line.replace(/^Примеры:\s*/iu, '');
    }
    if (/^Ловушк[аи]:/iu.test(line)) {
      section = 'traps';
      line = line.replace(/^Ловушк[аи]:\s*/iu, '');
    }
    if (line) sections[section].push(line);
  }
  if (fallback && !sections.rule.length)
    sections.rule.push('Начни с примеров и обрати внимание на форму предложения.');
  if (fallback && !sections.examples.length)
    sections.examples.push('Репетитор ещё не добавил отдельные примеры к этому уроку.');
  if (fallback && !sections.traps.length)
    sections.traps.push('Не спеши: прочитай предложение целиком и сравни свой ответ с правилом.');
  return sections;
}

export function sectionPages(lesson: Lesson, section: Section) {
  // Одна мысль на карточку. Длинный текст репетитора тоже разбивается.
  const pages: string[] = [];
  for (const paragraph of lessonSections(lesson)[section] ?? []) {
    const words = paragraph.split(/\s+/u);
    let chunk = '';
    for (const word of words) {
      if (chunk && chunk.length + word.length + 1 > 650) {
        pages.push(chunk);
        chunk = '';
      }
      chunk += `${chunk ? ' ' : ''}${word}`;
    }
    if (chunk) pages.push(chunk);
  }
  return pages;
}
