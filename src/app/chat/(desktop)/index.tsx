'use client';

import { useQuery } from 'react-query';
import { LoaderIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

import ButtonCreateChat from '../../../components/chat/conversation/ButtonCreateChat';
import Navbar from './_components/Navbar';

import ChatInput from '@/components/chat/chat-input';
import ChatList from '@/components/chat/chat-list';
import ChatHeader from '@/components/chat/conversation/ConversationHeader';
import ConversationList from '@/components/chat/conversation/ConversationList';
import Responsive from '@/components/Responsive';
import { getConversationById } from '@/service';
import { TUser } from '@/types/user';

const LazyMobile = dynamic(() => import('../(mobile)'), { ssr: false });

const ChatDesktop = ({ chatId, user }: { chatId?: string; user: TUser }) => {
  const { data: convData, isLoading } = useQuery(['conversation', chatId], {
    queryFn: () => getConversationById(chatId!),
    enabled: !!chatId,
  });

  return (
    <Responsive Mobile={LazyMobile}>
      <div className="flex h-screen">
        <Navbar user={user} />
        <aside className="flex w-72 flex-col gap-4 border-r px-2">
          <div className="flex items-center justify-between pt-5">
            <h3>Message</h3>
            <ButtonCreateChat />
          </div>

          <ConversationList />
        </aside>

        <main className="relative flex min-h-0 flex-1 flex-col">
          {chatId ? (
            isLoading ? (
              <LoaderIcon className="m-auto animate-spin" />
            ) : (
              <>
                <div className="border-b p-4 shadow-sm">
                  <ChatHeader data={convData} />
                </div>
                <ChatList chatId={chatId} userId={user.id!} />
                <div className="p-4">
                  <ChatInput chatId={chatId} />
                </div>
              </>
            )
          ) : (
            <div className="m-auto text-3xl font-bold">{"Let's chat 👋"}</div>
          )}
        </main>
      </div>
    </Responsive>
  );
};

export default ChatDesktop;
