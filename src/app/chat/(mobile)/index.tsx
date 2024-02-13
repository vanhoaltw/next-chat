'use client';

import { useMemo } from 'react';
import { Modal, ModalBody, ModalContent } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import ChatScreen from './_components/ChatScreen';
import Navbar from './_components/Navbar';

import ButtonCreateChat from '@/components/chat/conversation/ButtonCreateChat';
import ConversationList from '@/components/chat/conversation/ConversationList';

const ChatMobile = () => {
  const searchParams = useSearchParams();
  const convId = useMemo(() => searchParams.get('id'), [searchParams]);
  const router = useRouter();
  const { data } = useSession();

  const { user } = data || {};

  if (!user) return null;

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b px-4 py-2 text-center shadow-sm">
        <h1 className="text-lg font-bold">Next Chat</h1>
      </header>
      <main className="flex-1 p-4 py-2">
        <div className="mb-4 flex items-center justify-between">
          <h3>Message</h3>
          <ButtonCreateChat />
        </div>
        <ConversationList />
      </main>

      <Modal
        size="full"
        isOpen={!!convId}
        onClose={() => router.push('/chat')}
        hideCloseButton
      >
        <ModalContent>
          {(doClose) => (
            <ModalBody className="p-0">
              <ChatScreen onBack={doClose} userId={user?.id} chatId={convId!} />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
      <Navbar />
    </div>
  );
};

export default ChatMobile;
