import { send } from '../ui/messages.js';
import { richText } from '../format.js';
import { recordActivity } from '../../../../packages/domain/timing.js';
import type { BotState, User } from '../../../../packages/domain/types.js';

/** Показ текущего вопроса без изменения уже сохранённых ответов. */
export function ask(state: BotState, user: User) {
  const attempt = state.attempts[user.activeAttempt!];
  recordActivity(attempt);
  const index = attempt.answers.length;
  const question = attempt.lesson.questions[index];
  const choices =
    question.type === 'choice'
      ? question.options.map((option, optionIndex) => [
          {
            text: `${optionIndex + 1}. ${option}`,
            callback_data: `a:${attempt.id}:${index}:${optionIndex}`,
          },
        ])
      : [];
  const extra = {
    reply_markup: {
      inline_keyboard: [
        ...choices,
        ...(attempt.mode === 'test'
          ? []
          : [[{ text: '💡 Подсказка', callback_data: `hint:${attempt.id}:${index}` }]]),
      ],
    },
  };
  send(
    state,
    user.id,
    richText()
      .add(`✏️ ${attempt.lesson.title}`, 'bold')
      .add(
        `\n\n${'●'.repeat(index)}${'○'.repeat(attempt.lesson.questions.length - index)}\nВопрос ${index + 1} из ${attempt.lesson.questions.length}`,
      )
      .add(`\nОтвечено: ${index} из ${attempt.lesson.questions.length}`)
      .add('\n\n')
      .add(question.prompt, 'bold')
      .add(`\n\n${question.type === 'choice' ? '👇 Выбери ответ кнопкой.' : '⌨️ Напиши пропущенное слово.'}`)
      .build(),
    extra,
  );
}
