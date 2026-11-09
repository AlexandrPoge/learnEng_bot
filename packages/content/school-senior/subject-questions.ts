import { schoolUnit } from '../school-builder.js';
import { choice, gap } from '../lesson-builder.js';

/** Учебная тема: subject-questions. Порядок курса задан в school-senior.ts. */
export const subjectQuestionsLesson = schoolUnit(
  'subject-questions',
  'Who called? и Who did you call?',
  'B1',
  [7, 8, 9, 10],
  'sentences',
  '👤',
  'Различай вопрос к действующему лицу и объекту.',
  'Who called you? · Who did you call?',
  [
    'Вопрос к подлежащему спрашивает, кто совершил действие.',
    'В обычном утвердительном вопросе к подлежащему do/does/did не добавляем: Who lives here?',
    'Вопрос к дополнению сохраняет подлежащее и часто требует do/does/did.',
    'Сравни: Who saw Anna? — кто видел Анну; Who did Anna see? — кого видела Анна.',
  ],
  [
    'Who opened the door? — Кто открыл дверь?',
    'Who did you invite? — Кого ты пригласил?',
    'What happened? — Что случилось?',
    'Who knows the answer? — Кто знает ответ?',
    'What did he buy? — Что он купил?',
    'Which team won? — Какая команда победила?',
  ],
  [
    '❌ Who did opened the door? → ✅ Who opened the door? в нейтральном вопросе.',
    'После did в вопросе к объекту — начальная форма.',
    'Не решай только по слову who: выясни, какую роль оно играет.',
  ],
  [
    choice('Кто пришёл?', ['Who came?', 'Who did came?', 'Who come did?'], 'Who came?', 'Who — подлежащее.'),
    gap('Who did you ___? (invite)', 'invite', 'После did — invite.'),
    choice(
      'Кого увидела Анна?',
      ['Who did Anna see?', 'Who saw Anna?', 'Who Anna saw did?'],
      'Who did Anna see?',
      'Anna — подлежащее; who — дополнение.',
    ),
    gap(
      'Who ___ the answer? (know; нейтральное настоящее)',
      'knows',
      'Who в нейтральном вопросе требует knows.',
    ),
    choice(
      'Вопрос к подлежащему:',
      ['Which team won?', 'What did the team win?', 'Where did they win?'],
      'Which team won?',
      'Спрашиваем, какая команда совершила действие.',
    ),
  ],
);
