import type { Access, ReplyMarkup } from '../../../../packages/domain/types.js';

/** Постоянное меню и совместимые текстовые команды. */
export function mainMenu({ teacher = false, admin = false }: Access = {}): ReplyMarkup {
  return {
    keyboard: [
      ['📚 Учебник', '📍 Продолжить'],
      ['▶️ Практика', '📊 Мой прогресс'],
      ['📝 Домашние задания', '🔎 Найти тему'],
      ['⚙️ Режим', '❓ Помощь'],
      ...(teacher ? [['👩‍🏫 Кабинет']] : []),
      ...(admin ? [['🛠 Админ']] : []),
      ['🏠 Главное меню'],
    ],
    resize_keyboard: true,
  };
}

export const textActions: Record<string, string> = {
  '📚 Учебник': '/textbook',
  '👥 Учебные группы': '/classes',
  '🔔 Уведомления': '/notifications',
  '🏫 Мои классы': '/classes',
  '📝 Мои ДЗ': '/my_homework',
  '📤 Отправленные работы': '/sent_homework',
  '📚 Темы': '/topics',
  '▶️ Практика': '/practice',
  '📝 Домашние задания': '/homework',
  '📊 Мой прогресс': '/progress',
  '❓ Помощь': '/help',
  '📍 Продолжить': '/continue',
  '🔎 Найти тему': '/search',
  '🏠 Главное меню': '/menu',
  '⚙️ Режим': '/mode',
  '👩‍🏫 Кабинет': '/teacher',
  '🛠 Админ': '/admin',
  '✏️ Редактор': '/editor',
  '👥 Ученики': '/students',
  '📊 Работы учеников': '/results',
  '🔗 Пригласить ученика': '/invite',
};
