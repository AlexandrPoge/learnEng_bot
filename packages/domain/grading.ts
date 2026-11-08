import type { Attempt, Question } from './types.js';
import { timeSummary } from './timing.js';
export function normalizeAnswer(value: string) {
  return value.normalize('NFKC').trim().toLocaleLowerCase('en')
    .replace(/[’‘]/gu, "'").replace(/\s+/gu, ' ').replace(/[.!?]+$/gu, '').trim();
}

export function gradeAnswer(question: Pick<Question, 'accepted'>, answer: string) {
  return question.accepted.some((value) => normalizeAnswer(value) === normalizeAnswer(answer));
}

export function completionNotice(attempt: Attempt, studentName: string) {
  return `✅ Новое выполненное задание\n\n👤 ${studentName}\n📝 ${attempt.lesson.title}\n🎯 ${attempt.answers.filter(a => a.correct).length}/${attempt.lesson.questions.length}\n${timeSummary(attempt)}${attempt.assignmentId ? `\n📅 ${attempt.late ? 'Сдано после срока' : 'сдано вовремя'}` : ''}\n\nПолные ответы — по кнопке ниже.`;
}

export function buildReport(attempt: Attempt, studentName: string) {
  const score = attempt.answers.filter((answer) => answer.correct).length;
  return [
    `Ученик: ${studentName}`,
    `Тема: ${attempt.lesson.title} (${attempt.lesson.level}), версия ${attempt.lesson.version}`,
    `Результат: ${score}/${attempt.lesson.questions.length}`,
    ...(attempt.reviewOf ? ['Режим: повторение ошибок (отдельная тренировочная попытка)'] : []),
    ...(attempt.hintsUsed?.length ? [`Подсказки использованы: ${attempt.hintsUsed.length}`] : []),
    timeSummary(attempt),
    ...(attempt.mode === 'test' ? ['Режим: проверочная работа (разбор после сдачи)'] : []),
    ...(attempt.assignmentId ? [`Домашнее задание: ${attempt.late ? 'сдано после срока' : 'сдано вовремя'}\nСрок (UTC): ${attempt.deadline}`] : []),
    ...attempt.answers.map((answer, index) => {
      const question = attempt.lesson.questions[index];
      return `${index + 1}. ${question.prompt}\nОтвет: ${answer.value}\n${answer.correct ? '✅ Верно' : `❌ Правильно: ${question.accepted[0]}\n${question.explanation}`}`;
    }),
  ].join('\n\n');
}
