export function normalizeAnswer(value) {
  return value.normalize('NFKC').trim().toLocaleLowerCase('en')
    .replace(/[’‘]/gu, "'").replace(/\s+/gu, ' ').replace(/[.!?]+$/gu, '').trim();
}

export function gradeAnswer(question, answer) {
  return question.accepted.some((value) => normalizeAnswer(value) === normalizeAnswer(answer));
}

export function buildReport(attempt, studentName) {
  const score = attempt.answers.filter((answer) => answer.correct).length;
  const seconds = Math.max(0, Math.round((Date.parse(attempt.completedAt) - Date.parse(attempt.startedAt)) / 1000));
  return [
    `Ученик: ${studentName}`,
    `Тема: ${attempt.lesson.title} (${attempt.lesson.level}), версия ${attempt.lesson.version}`,
    `Результат: ${score}/${attempt.lesson.questions.length}`,
    `Время между началом и отправкой: ${seconds} сек. (включая перерывы)`,
    ...(attempt.assignmentId ? [`Домашнее задание: ${attempt.late ? 'сдано после срока' : 'сдано вовремя'}\nСрок (UTC): ${attempt.deadline}`] : []),
    ...attempt.answers.map((answer, index) => {
      const question = attempt.lesson.questions[index];
      return `${index + 1}. ${question.prompt}\nОтвет: ${answer.value}\n${answer.correct ? '✅ Верно' : `❌ Правильно: ${question.accepted[0]}\n${question.explanation}`}`;
    }),
  ].join('\n\n');
}
