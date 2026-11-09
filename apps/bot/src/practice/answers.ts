import { send } from '../ui/messages.js';
import { ask } from './questions.js';
import { gradeAnswer, completionNotice } from '../../../../packages/domain/grading.js';
import { richText, readable } from '../format.js';
import { recordActivity, timeSummary } from '../../../../packages/domain/timing.js';
import { button } from '../pagination.js';
import type { BotState, User } from '../../../../packages/domain/types.js';

/** Проверка ответа и завершение попытки. */
export function acceptAnswer(state: BotState, user: User, value: string) {
  const attempt = state.attempts[user.activeAttempt!];
  const question = attempt.lesson.questions[attempt.answers.length];
  const correct = gradeAnswer(question, value);
  recordActivity(attempt);
  attempt.answers.push({ questionId: question.id, value, correct });
  const feedback = richText().add(correct ? '✅ Верно!' : '💛 Давай разберёмся.', 'bold');
  if (!correct) feedback.add('\n\n✏️ Правильный ответ\n', 'bold').add(question.accepted[0], 'bold');
  feedback.add('\n\n💡 Объяснение\n', 'bold').add(readable(question.explanation));
  send(state, user.id, attempt.mode === 'test' ? '📩 Ответ сохранён.' : feedback.build());
  if (attempt.answers.length < attempt.lesson.questions.length) return ask(state, user);
  attempt.completedAt = new Date().toISOString();
  const assignment = attempt.assignmentId ? state.assignments?.[attempt.assignmentId] : undefined;
  if (assignment) {
    assignment.completedAt = attempt.completedAt;
    assignment.attemptId = attempt.id;
    attempt.deadline = assignment.deadline;
    attempt.late = Date.parse(attempt.completedAt) > Date.parse(assignment.deadline);
  }
  user.activeAttempt = null;
  const score = attempt.answers.filter((answer) => answer.correct).length;
  send(
    state,
    user.id,
    `🎉 ${attempt.mode === 'test' ? 'Проверочная' : 'Практика'} завершена!\n\n${attempt.lesson.icon ?? '📘'} ${attempt.lesson.title}\n✅ Верных ответов: ${score} из ${attempt.lesson.questions.length}\n\n${timeSummary(attempt)}\n\n${score === attempt.lesson.questions.length ? '🌟 Всё получилось!' : '🌱 Можно разобрать ответы и повторить ошибки.'}\n\n🧭 Что дальше?`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔎 Разобрать ответы', callback_data: `review:${attempt.id}` }],
          ...(score < attempt.lesson.questions.length
            ? [[{ text: '🎯 Повторить только ошибки', callback_data: `repeat:${attempt.id}` }]]
            : []),
          [
            { text: '🔁 Ещё раз', callback_data: `p:${attempt.lesson.id}` },
            { text: '📚 Темы', callback_data: 'levels' },
          ],
          [button('📊 Мой прогресс', 'progress:history:0')],
          [button('📚 Учебник', 'book'), button('🏠 Меню', 'home')],
        ],
      },
    },
  );
  if (attempt.teacherId && state.users[attempt.teacherId]?.resultNotifications !== 'off')
    send(state, attempt.teacherId, completionNotice(attempt, user.name), {
      requiredTeacher: true,
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔎 Посмотреть работу', callback_data: `report:${attempt.id}` },
            { text: '📊 Все результаты', callback_data: 'results:0' },
          ],
        ],
      },
    });
}
