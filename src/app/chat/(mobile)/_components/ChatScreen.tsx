import { useQuery } from 'react-query';
import { Button } from '@nextui-org/react';
import { ChevronLeft } from 'lucide-react';

import ChatInput from '@/components/chat/chat-input';
import ChatList from '@/components/chat/chat-list';
import ConversationHeader from '@/components/chat/conversation/ConversationHeader';
import { getConversationById } from '@/service';

const ChatScreen = ({
  onBack,
  chatId,
  userId,
}: {
  onBack: () => void;
  chatId: string;
  userId: string;
}) => {
  const { data: convData } = useQuery(['conversation', chatId], {
    queryFn: () => getConversationById(chatId!),
    enabled: !!chatId,
  });

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-2 border-b px-4 py-2 shadow-sm">
        <Button variant="light" isIconOnly onClick={onBack} size="sm">
          <ChevronLeft />
        </Button>
        <ConversationHeader data={convData} />
      </header>
      <ChatList chatId={chatId} userId={userId} />
      <div className="p-4">
        <ChatInput chatId={chatId} />
      </div>
    </div>
  );
};

export default ChatScreen;
