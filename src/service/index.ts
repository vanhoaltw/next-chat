import { request } from '@/lib/request';
import { TConversation } from '@/types/conversation';
import { MessageInput, TMessage } from '@/types/message';
import { TUser } from '@/types/user';

export const getConversationById = (id: string) => {
  return request<TConversation>(`/api/conversation/${id}`);
};

export const getConversation = () => {
  return request<TConversation[]>('/api/conversation');
};

export const createConversation = (userIds: string[]) => {
  return request<TConversation>('/api/conversation', {
    method: 'POST',
    body: { userIds: userIds },
  });
};

export const getUsers = () => {
  return request<TUser[]>('/api/user');
};

export const getMessages = (chatId: string) => {
  return request<{ results: TMessage[] }>(`/api/message?id=${chatId}`);
};
export const sendMessage = (input: MessageInput) => {
  return request<TMessage[]>(`/api/message`, {
    method: 'POST',
    body: input,
  });
};
