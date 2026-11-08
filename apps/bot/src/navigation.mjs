import { sectionPages } from '../../../packages/content/presentation.mjs';

export function mainMenu({ teacher = false, admin = false } = {}) {
  return {
    keyboard: [
      ['📚 Темы', '▶️ Практика'], ['📝 Домашние задания', '📊 Мой прогресс'],
      ['⚙️ Режим', '❓ Помощь'],
      ...(teacher ? [['👩‍🏫 Кабинет']] : []),
      ...(admin ? [['🛠 Админ']] : []),
      ['🏠 Главное меню'],
    ], resize_keyboard: true,
  };
}

export function topicButtons(lesson, page) {
  const rows = [
    [{ text: '📖 Правило', callback_data: `s:${lesson.id}:rule:0` }, { text: '💡 Примеры', callback_data: `s:${lesson.id}:examples:0` }],
    [{ text: '⚠️ Ловушки', callback_data: `s:${lesson.id}:traps:0` }, { text: '✏️ Практика', callback_data: `p:${lesson.id}` }],
    [{ text: `📚 Темы ${lesson.level}`, callback_data: `l:${lesson.level}:${page ?? 0}` }, { text: '🏠 Меню', callback_data: 'home' }],
  ];
  return { inline_keyboard: rows };
}

export function topicCard(lesson, child) {
  return `${lesson.icon ?? '📘'} ${lesson.title}\n${lesson.level} · ⏱ около ${lesson.estimatedMinutes} мин\n\n🎯 ${lesson.goal ?? 'Разберись с темой и потренируйся.'}\n\n${child ? 'Шаг за шагом: правило → примеры → ловушки → практика.' : 'Выбери раздел ниже. К практике можно перейти сразу.'}`;
}

export function sectionCard(lesson, section, page, child) {
  const pages = sectionPages(lesson, section);
  if (!Number.isInteger(page) || page < 0 || page >= pages.length) return null;
  const labels = { rule: '📖 Правило', examples: '💡 Примеры', traps: '⚠️ Ловушки' };
  const intro = page === 0 && section === 'rule'
    ? [child ? lesson.childIntro : '', lesson.memory ? `🧠 Запомни: ${lesson.memory}` : ''].filter(Boolean).join('\n\n') : '';
  return { text: `${lesson.icon ?? '📘'} ${lesson.title}\n${labels[section]} · ${page + 1}/${pages.length}\n\n${intro ? `${intro}\n\n` : ''}${pages[page]}`, pages: pages.length };
}

export const textActions = {
  '📚 Темы': '/topics', '▶️ Практика': '/practice', '📝 Домашние задания': '/homework', '📊 Мой прогресс': '/progress', '❓ Помощь': '/help',
  '🏠 Главное меню': '/menu', '⚙️ Режим': '/mode', '👩‍🏫 Кабинет': '/teacher', '🛠 Админ': '/admin',
  '✏️ Редактор': '/editor', '👥 Ученики': '/students', '📊 Работы учеников': '/results', '🔗 Пригласить ученика': '/invite',
};
