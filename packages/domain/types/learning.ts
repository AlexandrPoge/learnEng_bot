/** Типы области: learning. Сериализуемые данные совместимы с прежним хранилищем. */
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type Category = 'foundation' | 'grammar' | 'vocabulary' | 'situations';

export type GrammarStrand = 'tenses' | 'nouns' | 'modifiers' | 'verbs' | 'sentences';

export type Section = 'rule' | 'examples' | 'traps';

export interface QuestionBase {
  id: string;
  prompt: string;
  accepted: string[];
  explanation: string;
}

export interface ChoiceQuestion extends QuestionBase {
  type: 'choice';
  options: string[];
}

export interface TextQuestion extends QuestionBase {
  type: 'text';
  options?: undefined;
}

export type Question = ChoiceQuestion | TextQuestion;

export type QuestionInput = Omit<ChoiceQuestion, 'id'> | Omit<TextQuestion, 'id'>;

export interface Resource {
  title: string;
  url: string;
  note: string;
  kind: 'article' | 'video';
  provider: string;
  language?: string;
  checkedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  level: Level;
  category: Category;
  version: number;
  estimatedMinutes: number;
  theory: string;
  questions: Question[];
  icon?: string;
  goal?: string;
  memory?: string;
  childIntro?: string;
  resources?: Resource[];
  rulePhoto?: string;
  schoolGrades?: number[];
  strand?: GrammarStrand;
}

export interface Answer {
  questionId: string;
  value: string;
  correct: boolean;
}

export interface Attempt {
  id: string;
  studentId: string;
  teacherId: string | null;
  lesson: Lesson;
  assignmentId?: string | null;
  reviewOf?: string | null;
  startedAt: string;
  completedAt: string | null;
  cancelledAt?: string;
  answers: Answer[];
  deadline?: string;
  late?: boolean;
  hintsUsed?: number[];
  mode?: 'practice' | 'test';
  lastActivityAt?: string;
  engagedMs?: number;
}
