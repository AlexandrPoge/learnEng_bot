import type { Context } from './shared.js';
import { button, manage } from './shared.js';
import type { BotState, Classroom, User } from '../../../../packages/domain/types.js';

/** Сводка выбранной учебной группы. */
export function showClass(state: BotState, user: User, c: Classroom, ctx: Context) {
  const ownTasks = Object.values(state.assignments ?? {}).filter(
    (a) => a.classId === c.id && a.studentId === user.id && !a.completedAt,
  ).length;
  ctx.panel(
    `🏫 ${c.name}\n\n🌱 Уровень: ${c.level}\n📚 Тем: ${c.lessonIds.length}\n${manage(c, user, ctx) ? `👥 Учеников: ${c.studentIds.length}` : `📝 ДЗ к выполнению: ${ownTasks}`}\n\nВыбери темы или домашние задания.`,
    {
      inline_keyboard: [
        [
          button('📚 Темы класса', `class:topics:${c.id}:0`),
          button('📝 Задания класса', `class:tasks:${c.id}:0`),
        ],
        ...(manage(c, user, ctx)
          ? [
              [
                button('👥 Ученики', `class:students:${c.id}:0`),
                button('🔗 Приглашение', `class:invite:${c.id}`),
              ],
              [button('➕ Добавить темы', `class:pick:${c.id}:0`), button('📨 Назначить ДЗ', 'work:list:0')],
              [
                button('✏️ Название класса', `class:rename:${c.id}`),
                button('🌱 Уровень класса', `class:change-level:${c.id}`),
              ],
            ]
          : []),
        [button('👥 Учебные группы', 'class:list:0'), button('🏠 Меню', 'home')],
      ],
    },
  );
}
