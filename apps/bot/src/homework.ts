import {
  compareHomework,
  deadlineLabel,
  homeworkStatus,
  homeworkStatusLabels,
} from '../../../packages/domain/homework.js';
import type { Assignment, BotState, User } from '../../../packages/domain/types.js';
import { button, paginate, pageButtons } from './pagination.js';
import type { PanelContent } from './pagination.js';

export type HomeworkFilter = 'all' | 'pending' | 'submitted';

export function studentHomework(state: BotState, user: User): Assignment[] {
  return Object.values(state.assignments ?? {})
    .filter((assignment) => assignment.studentId === user.id)
    .sort(compareHomework);
}

/** Один экран вместо отдельного сообщения на каждое назначение. */
export function homeworkPanel(
  state: BotState,
  user: User,
  filter: HomeworkFilter = 'all',
  requestedPage = 0,
): PanelContent {
  const assignments = studentHomework(state, user);
  const pending = assignments.filter((assignment) => !assignment.completedAt);
  const submitted = assignments.filter((assignment) => assignment.completedAt);
  const filtered = filter === 'pending' ? pending : filter === 'submitted' ? submitted : assignments;
  const { page, pages, items } = paginate(filtered, requestedPage);
  const labels = { all: 'Все', pending: 'Не сданы', submitted: 'Сданы' };
  const descriptions = items.map((assignment, index) => {
    const status = homeworkStatus(state, assignment);
    return `${page * 5 + index + 1}. ${assignment.lesson.title.slice(0, 70)}\n${homeworkStatusLabels[status]} · ${deadlineLabel(assignment.deadline)}`;
  });

  return {
    text: [
      '📝 Домашние задания',
      `${labels[filter]} · Страница ${page + 1} из ${pages}`,
      ...descriptions,
      ...(!items.length
        ? [
            assignments.length
              ? 'В этом списке заданий нет.'
              : 'Домашних заданий пока нет. Открой учебник для самостоятельной практики.',
          ]
        : []),
      ...(items.some((assignment) => homeworkStatus(state, assignment) === 'overdue')
        ? ['⏰ Срок прошёл, но работу ещё можно сдать.']
        : []),
    ].join('\n\n'),
    markup: {
      inline_keyboard: [
        [
          button(`Все · ${assignments.length}`, 'homework:all:0'),
          button(`Не сданы · ${pending.length}`, 'homework:pending:0'),
          button(`Сданы · ${submitted.length}`, 'homework:submitted:0'),
        ],
        ...items.map((assignment) => [
          button(
            `${assignment.completedAt ? '🔎' : '✏️'} ${assignment.lesson.title.slice(0, 70)}`,
            `h:${assignment.id}`,
          ),
        ]),
        ...pageButtons(page, pages, (next) => `homework:${filter}:${next}`),
        [button('📚 Учебник', 'book'), button('🏠 Меню', 'home')],
      ],
    },
  };
}

export function nextHomeworkPanel(assignment: Assignment): PanelContent {
  const overdue = Date.now() > Date.parse(assignment.deadline);
  return {
    text: `📍 Продолжить обучение\n\n📝 Ближайшее несданное ДЗ\n${assignment.lesson.title}\n📅 ${deadlineLabel(assignment.deadline)}\n\n${overdue ? '⏰ Срок прошёл, но работу ещё можно сдать.' : 'Открой задание, когда будешь готов.'}`,
    markup: {
      inline_keyboard: [
        [button('✏️ Открыть ДЗ', `h:${assignment.id}`)],
        [button('📝 Все ДЗ', 'homework:all:0')],
        [button('📚 Учебник', 'book'), button('🏠 Меню', 'home')],
      ],
    },
  };
}
