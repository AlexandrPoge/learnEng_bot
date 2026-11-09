import type { Context } from './shared.js';
import type { BotState, Classroom, User } from '../../../../packages/domain/types.js';

export interface ClassroomRequest {
  state: BotState;
  user: User;
  ctx: Context;
  text: string;
  data: string;
  draft: User['workspace'];
  area: string;
  action: string;
  id: string;
  detail: string;
  extra: string;
}
export type ClassMemberRequest = ClassroomRequest & { c: Classroom };
export type AssignmentRequest = ClassroomRequest & {
  draft: Extract<NonNullable<User['workspace']>, { kind: 'assign' }>;
};
