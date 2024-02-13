import { TUser } from './user';

export type MessageInput = {
  content?: string;
  conversationId: string;
  attachments?: { type: 'image' | 'video'; url: string }[];
};

export type TMessage = {
  _id: string;
  attachments: { type: 'image' | 'video'; url: string }[];
  authorId: TUser;
  conversationId: string;
  content: string;
  mentions: string[];
  messageReference?: {
    conversationId?: string;
    messageId?: string;
  };
  reactions?: [];
  pinned?: boolean;
  tts?: boolean;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
