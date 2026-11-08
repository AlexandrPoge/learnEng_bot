export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type Category = 'foundation' | 'grammar' | 'vocabulary' | 'situations';
export type Section = 'rule' | 'examples' | 'traps';
interface QuestionBase { id: string; prompt: string; accepted: string[]; explanation: string }
export interface ChoiceQuestion extends QuestionBase { type: 'choice'; options: string[] }
export interface TextQuestion extends QuestionBase { type: 'text'; options?: undefined }
export type Question = ChoiceQuestion | TextQuestion;
export type QuestionInput = Omit<ChoiceQuestion, 'id'> | Omit<TextQuestion, 'id'>;
export interface Resource { title: string; url: string; note: string; kind: 'article' | 'video'; provider: string; language?: string; checkedAt: string }
export interface Lesson {
  id: string; title: string; level: Level; category: Category; version: number;
  estimatedMinutes: number; theory: string; questions: Question[];
  icon?: string; goal?: string; memory?: string; childIntro?: string; resources?: Resource[];
}
export interface Answer { questionId: string; value: string; correct: boolean }
export interface Attempt {
  id: string; studentId: string; teacherId: string | null; lesson: Lesson;
  assignmentId?: string | null; reviewOf?: string | null; startedAt: string;
  completedAt: string | null; cancelledAt?: string; answers: Answer[];
  deadline?: string; late?: boolean; hintsUsed?: number[];
}
export interface User {
  id: string; name: string; activeAttempt: string | null; teacherId?: string;
  learningMode?: 'child' | 'adult'; selectedLesson?: string; searching?: boolean;
  reading?: { lessonId: string; section: Section; page: number; version: number };
  catalog?: { level: Level; page: number; category: Category | null };
}
export interface Assignment { id: string; studentId: string; teacherId: string; lesson: Lesson; deadline: string; createdAt: string; completedAt: string | null; attemptId?: string }
export interface EditorDraft {
  baseVersion: number; lesson: Lesson; step: 'type' | 'prompt' | 'options' | 'accepted' | 'explanation' | null;
  inputField?: string;
  pending?: { replaceId: string | null; type?: Question['type']; prompt?: string; options?: string[]; accepted?: string[] };
}
export interface Access { teacher?: boolean; admin?: boolean }
export interface TextEntity { type: 'bold' | 'code'; offset: number; length: number }
export interface RichText { text: string; entities: TextEntity[] }
export interface InlineButton { text: string; callback_data?: string; url?: string }
export interface ReplyMarkup { inline_keyboard?: InlineButton[][]; keyboard?: string[][]; resize_keyboard?: boolean }
export interface TelegramPayload {
  [key: string]: unknown;
  chat_id?: string | number; text?: string; entities?: TextEntity[];
  message_id?: number; callback_query_id?: string; reply_markup?: ReplyMarkup;
}
export interface TelegramPerson { id: number; first_name?: string; username?: string; is_bot?: boolean }
export interface TelegramMessage { message_id?: number; chat: { id: number; type: string }; from?: TelegramPerson; text?: string; entities?: TextEntity[]; reply_markup?: ReplyMarkup }
export interface TelegramUpdate { update_id: number; message?: TelegramMessage; callback_query?: { id: string; from: TelegramPerson; message?: TelegramMessage; data?: string } }
export interface BotCommand { command: string; description: string }
export interface TelegramResults {
  getMe: TelegramPerson; getWebhookInfo: { url: string; pending_update_count: number };
  getUpdates: TelegramUpdate[]; getMyCommands: BotCommand[];
  sendMessage: TelegramMessage; editMessageText: TelegramMessage; editMessageReplyMarkup: TelegramMessage;
  answerCallbackQuery: boolean; setMyName: boolean; setMyDescription: boolean;
  setMyShortDescription: boolean; setMyCommands: boolean;
}
export type TelegramApi = <M extends keyof TelegramResults>(method: M, payload?: TelegramPayload, signal?: AbortSignal) => Promise<TelegramResults[M]>;
export interface OutboxTask { id: string; method: keyof TelegramResults; payload: TelegramPayload; requiredTeacher: boolean }
export interface BotState {
  version: 1; offset: number; users: Record<string, User>; attempts: Record<string, Attempt>;
  invites: Record<string, { teacherId: string; expiresAt: number }>; outbox: OutboxTask[];
  teacherIds?: string[]; revokedTeacherIds?: string[]; teacherWelcome?: Record<string, boolean>;
  assignments?: Record<string, Assignment>; editors?: Record<string, EditorDraft>;
  lessonOverrides?: Record<string, Lesson>;
  lessonHistory?: Record<string, { lesson: Lesson; editedBy: string; savedAt: string }[]>;
}
