export const presentSimple = {
  id: 'present-simple',
  version: 1,
  title: 'Present Simple',
  level: 'A1',
  theory: [
    'Present Simple — привычки, регулярные действия и общие факты.',
    'I / you / we / they + глагол: I work every day.',
    'He / she / it + глагол с -s / -es: She works every day.',
    'Отрицание: I do not work. She does not work.',
    'Вопрос: Do you work? Does she work?',
    'Примеры: We play football on Sundays. He watches TV in the evening.',
    'Ловушка: после does / doesn’t глагол без -s: Does she work? (не works).',
    'Обрати внимание: глагол be имеет формы am / is / are и не требует do / does.',
  ].join('\n\n'),
  questions: [
    {
      id: 'q1', type: 'choice', prompt: 'She ___ to school every day.',
      options: ['go', 'goes', 'going'], accepted: ['goes'],
      explanation: 'С she в утверждении добавляем -s / -es: she goes.',
    },
    {
      id: 'q2', type: 'choice', prompt: '___ you like tea?',
      options: ['Does', 'Are', 'Do'], accepted: ['Do'],
      explanation: 'Вопрос с you и like начинается с Do.',
    },
    {
      id: 'q3', type: 'text', prompt: 'Впиши глагол: He does not ___ (play) tennis.',
      accepted: ['play'], explanation: 'После does not используем начальную форму: play.',
    },
    {
      id: 'q4', type: 'choice', prompt: 'Выбери правильное предложение.',
      options: ['Does she works here?', 'Does she work here?', 'Do she work here?'],
      accepted: ['Does she work here?'],
      explanation: 'С she нужен Does, а основной глагол после него — без -s.',
    },
    {
      id: 'q5', type: 'text', prompt: 'Впиши форму watch: My brother ___ TV every evening.',
      accepted: ['watches'], explanation: 'My brother = he. К watch добавляем -es: watches.',
    },
  ],
};

export const lessons = [presentSimple];
