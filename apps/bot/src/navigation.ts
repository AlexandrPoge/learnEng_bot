import { sectionPages } from '../../../packages/content/presentation.js';
import { richText, readable, exampleBlocks, combine } from './format.js';
import type { Access, Lesson, Section, ReplyMarkup } from '../../../packages/domain/types.js';

export function mainMenu({ teacher = false, admin = false }: Access = {}): ReplyMarkup {
  return {
    keyboard: [
      ['📚 Темы', '▶️ Практика'], ['📝 Домашние задания', '📊 Мой прогресс'],
      ['📍 Продолжить', '🔎 Найти тему'],
      ['⚙️ Режим', '❓ Помощь'],
      ...(teacher ? [['👩‍🏫 Кабинет']] : []),
      ...(admin ? [['🛠 Админ']] : []),
      ['🏠 Главное меню'],
    ], resize_keyboard: true,
  };
}

export function topicButtons(lesson: Lesson, page?: number, backData?: string): ReplyMarkup {
  const rows = [
    [{ text: '📖 Правило', callback_data: `s:${lesson.id}:rule:0` }, { text: '💡 Примеры', callback_data: `s:${lesson.id}:examples:0` }],
    [{ text: '⚠️ Ловушки', callback_data: `s:${lesson.id}:traps:0` }, { text: '✏️ Практика', callback_data: `p:${lesson.id}` }],
    [{ text: '🎬 Видео и источники', callback_data: `sources:${lesson.id}` }],
    [{ text: `📚 Темы ${lesson.level}`, callback_data: backData ?? `l:${lesson.level}:${page ?? 0}` }, { text: '🏠 Меню', callback_data: 'home' }],
  ];
  return { inline_keyboard: rows };
}

export function topicCard(lesson: Lesson, child: boolean) {
  return richText().add(`${lesson.icon ?? '📘'} ${lesson.title}`, 'bold')
    .add(`\n\n🌱 Уровень ${lesson.level}\n⏱ Около ${lesson.estimatedMinutes} минут`)
    .add('\n\n🎯 Чему научимся\n', 'bold').add(lesson.goal ?? 'Разберись с темой и потренируйся.')
    .add('\n\n🧭 Порядок урока\n', 'bold').add('1. 📖 Правило\n2. 💡 Примеры\n3. ⚠️ Ловушки\n4. ✏️ Практика')
    .add(child ? '\n\nНачни с правила. Не спеши — шаги короткие.' : '\n\nВыбери раздел на кнопках ниже.').build();
}

export function sectionCard(lesson: Lesson, section: Section, page: number, child: boolean) {
  const pages = sectionPages(lesson, section);
  if (!Number.isInteger(page) || page < 0 || page >= pages.length) return null;
  const labels = { rule: '📖 Правило', examples: '💡 Примеры', traps: '⚠️ Ловушки' };
  const header = richText().add(`${lesson.icon ?? '📘'} ${lesson.title}`, 'bold')
    .add(`\n\n${labels[section]}\n📍 ${lesson.level}  •  шаг ${page + 1} из ${pages.length}`).build();
  const intro = richText();
  if (page === 0 && section === 'rule') {
    if (child && lesson.childIntro) intro.add('\n\n💬 Простыми словами\n', 'bold').add(readable(lesson.childIntro));
    if (lesson.memory) intro.add('\n\n🧠 Запомни\n', 'bold').add(readable(lesson.memory), 'code');
  }
  const duplicateIntro = child && section === 'rule' && page === 0 && lesson.childIntro === pages[page];
  const body = duplicateIntro ? richText().build() : section === 'examples' ? exampleBlocks(pages[page]) : richText().add(readable(pages[page]).replace(/\s*(❌|✅)/gu, '\n\n$1').replace(/\s*→\s*(?=✅)/gu, '\n\n')).build();
  return { ...combine(header, intro.build(), '\n\n', body, '\n\n👇 Продолжение — на кнопках ниже.'), pages: pages.length };
}

export const textActions: Record<string, string> = {
  '📚 Темы': '/topics', '▶️ Практика': '/practice', '📝 Домашние задания': '/homework', '📊 Мой прогресс': '/progress', '❓ Помощь': '/help',
  '📍 Продолжить': '/continue',
  '🔎 Найти тему': '/search',
  '🏠 Главное меню': '/menu', '⚙️ Режим': '/mode', '👩‍🏫 Кабинет': '/teacher', '🛠 Админ': '/admin',
  '✏️ Редактор': '/editor', '👥 Ученики': '/students', '📊 Работы учеников': '/results', '🔗 Пригласить ученика': '/invite',
};
