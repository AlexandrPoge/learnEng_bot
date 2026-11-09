import type { Question, Lesson } from './learning.js';

/** Типы области: editor. Сериализуемые данные совместимы с прежним хранилищем. */
export interface EditorDraft {
  baseVersion: number;
  lesson: Lesson;
  step: 'type' | 'prompt' | 'options' | 'accepted' | 'explanation' | null;
  inputField?: string;
  destination?: 'homework';
  awaitingPhoto?: boolean;
  pending?: {
    replaceId: string | null;
    type?: Question['type'];
    prompt?: string;
    options?: string[];
    accepted?: string[];
  };
}
