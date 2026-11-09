import type { Attempt, BotState, User } from '../../../packages/domain/types.js';
import { button, paginate, pageButtons } from './pagination.js';
import type { PanelContent } from './pagination.js';

export type ProgressTab = 'history' | 'weak';

function score(attempt: Attempt): string {
  return `${attempt.answers.filter((answer) => answer.correct).length}/${attempt.lesson.questions.length}`;
}

/** Повторы не увеличивают число тем и не меняют точность полных прохождений. */
export function progressPanel(
  state: BotState,
  user: User,
  tab: ProgressTab = 'history',
  requestedPage = 0,
): PanelContent {
  const attempts = Object.values(state.attempts)
    .filter((attempt) => attempt.studentId === user.id && attempt.completedAt && !attempt.cancelledAt)
    .sort((a, b) => b.completedAt!.localeCompare(a.completedAt!) || b.id.localeCompare(a.id));
  const fullAttempts = attempts.filter((attempt) => !attempt.reviewOf);
  const latestByTopic = new Map<string, Attempt>();
  for (const attempt of fullAttempts) {
    if (!latestByTopic.has(attempt.lesson.id)) {
      latestByTopic.set(attempt.lesson.id, attempt);
    }
  }

  const weakTopics = [...latestByTopic.values()].filter((attempt) =>
    attempt.answers.some((answer) => !answer.correct),
  );
  const total = fullAttempts.reduce((count, attempt) => count + attempt.answers.length, 0);
  const correct = fullAttempts.reduce(
    (count, attempt) => count + attempt.answers.filter((answer) => answer.correct).length,
    0,
  );
  const accuracy = total
    ? `${Math.round((correct / total) * 100)}% (${correct}/${total})`
    : 'пока нет данных';
  const repeats = attempts.length - fullAttempts.length;
  const { page, pages, items } = paginate(tab === 'weak' ? weakTopics : attempts, requestedPage);

  const rows = items.flatMap((attempt) => {
    const title = `${attempt.reviewOf ? '🔁' : '✏️'} ${attempt.lesson.title.slice(0, 65)} · ${score(attempt)}`;
    return [
      [button(title, `review:${attempt.id}`)],
      ...(attempt.answers.some((answer) => !answer.correct)
        ? [[button('🎯 Повторить только ошибки', `repeat:${attempt.id}`)]]
        : []),
    ];
  });

  return {
    text: [
      '📊 Мой прогресс',
      `✅ Пройдено уникальных тем: ${latestByTopic.size}\nПрохождение означает завершение практики, а не освоение темы.`,
      `🎯 Точность полных попыток: ${accuracy}\n🔁 Завершённых повторений ошибок: ${repeats} (отдельно от точности).`,
      `🌱 Тем с ошибками: ${weakTopics.length}\nПо последней полной попытке каждой темы. Успешные повторы отдельных вопросов показаны в истории.`,
      `${tab === 'history' ? '🕘 Последние работы' : '🌱 Темы с ошибками'} · Страница ${page + 1} из ${pages}`,
      ...(!items.length
        ? [
            tab === 'history'
              ? 'Результатов пока нет. Начни практику в учебнике.'
              : 'Тем с ошибками в последних полных попытках нет.',
          ]
        : ['Нажми на работу для разбора ответов.']),
    ].join('\n\n'),
    markup: {
      inline_keyboard: [
        [
          button('🕘 История', 'progress:history:0'),
          button(`🌱 Темы с ошибками · ${weakTopics.length}`, 'progress:weak:0'),
        ],
        ...rows,
        ...pageButtons(page, pages, (next) => `progress:${tab}:${next}`),
        [button('📚 Учебник', 'book'), button('🏠 Меню', 'home')],
      ],
    },
  };
}
