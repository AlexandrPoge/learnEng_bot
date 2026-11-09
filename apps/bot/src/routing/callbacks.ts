import { enqueue } from '../ui/messages.js';
import type { HandlerContext } from './context.js';
import { handleStudentCallback } from '../callbacks/student.js';
import { handleTeacherCallback } from '../callbacks/teacher.js';
import { handleCatalogCallback } from '../callbacks/catalog.js';
import { handleMediaCallback } from '../callbacks/media.js';
import { handleHintsCallback } from '../callbacks/hints.js';
import { handleLearningCallback } from '../callbacks/learning.js';
import { handleEditorCallback } from '../callbacks/editor.js';
import { handleTopicsCallback } from '../callbacks/topics.js';
import { handleAnswersCallback } from '../callbacks/answers.js';
import { handleClassrooms } from '../classrooms.js';

/** Сначала специализированные маршруты; устаревшие ответы обрабатываются последними. */
export function handleCallback(context: HandlerContext) {
  const { state, user, callback, classroomContext, message } = context;
  user.searching = false;
  enqueue(state, 'answerCallbackQuery', {
    callback_query_id: callback!.id,
    text: '⬇️ Результат появится внизу чата',
  });
  const data = callback!.data ?? '';
  if (handleClassrooms(state, user, { data }, classroomContext)) return;
  const request = { ...context, data, messageId: message!.message_id };
  if (handleStudentCallback(request)) return;
  if (handleTeacherCallback(request)) return;
  if (handleCatalogCallback(request)) return;
  if (handleMediaCallback(request)) return;
  if (handleHintsCallback(request)) return;
  if (handleLearningCallback(request)) return;
  if (handleEditorCallback(request)) return;
  if (handleTopicsCallback(request)) return;
  if (handleAnswersCallback(request)) return;
}
