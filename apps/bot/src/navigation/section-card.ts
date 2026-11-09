import { sectionPages } from '../../../../packages/content/presentation.js';
import { richText, readable, exampleBlocks, combine } from '../format.js';
import type { Lesson, Section } from '../../../../packages/domain/types.js';

/** Оформление страницы учебного раздела. */
export function sectionCard(lesson: Lesson, section: Section, page: number, child: boolean, path?: string) {
  const pages = sectionPages(lesson, section);
  if (!Number.isInteger(page) || page < 0 || page >= pages.length) return null;
  const labels = { rule: '📖 Правило', examples: '💡 Примеры', traps: '⚠️ Ловушки' };
  const header = richText()
    .add(`${lesson.icon ?? '📘'} ${lesson.title}`, 'bold')
    .add(
      `\n\n${path ? `${path}\n` : ''}${labels[section]}\n📍 ${lesson.level}  •  шаг ${page + 1} из ${pages.length}`,
    )
    .build();
  const intro = richText();
  if (page === 0 && section === 'rule') {
    if (child && lesson.childIntro)
      intro.add('\n\n💬 Простыми словами\n', 'bold').add(readable(lesson.childIntro));
    if (lesson.memory) intro.add('\n\n🧠 Запомни\n', 'bold').add(readable(lesson.memory), 'code');
  }
  const duplicateIntro = child && section === 'rule' && page === 0 && lesson.childIntro === pages[page];
  const body = duplicateIntro
    ? richText().build()
    : section === 'examples'
      ? exampleBlocks(pages[page])
      : richText()
          .add(
            readable(pages[page])
              .replace(/\s*(❌|✅)/gu, '\n\n$1')
              .replace(/\s*→\s*(?=✅)/gu, '\n\n'),
          )
          .build();
  return {
    ...combine(header, intro.build(), '\n\n', body, '\n\n👇 Продолжение — на кнопках ниже.'),
    pages: pages.length,
  };
}
