import { TUser } from './user';

export enum ConversationType {
  private = 'private',
  group = 'group',
}

export type TConversation = {
  _id: string;
  recipients: TUser[];
  content: string;
};
