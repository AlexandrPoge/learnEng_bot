import type { EditorContext } from './controls.js';
import type { BotState, User, EditorDraft } from '../../../../packages/domain/types.js';

export interface EditorBaseRequest extends EditorContext {
  state: BotState;
  user: User;
  text: string;
  raw: string;
  parts: string[];
  command: string;
  body: string;
  draft?: EditorDraft;
}

export interface EditorRequest extends EditorBaseRequest {
  draft: EditorDraft;
}
