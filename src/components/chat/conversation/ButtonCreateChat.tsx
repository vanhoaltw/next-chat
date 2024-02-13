import { Button, useDisclosure } from '@nextui-org/react';
import { Plus } from 'lucide-react';

import CreateConversation from '@/components/chat/conversation/CreateConversation';

const ButtonCreateChat = () => {
  const { isOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button isIconOnly size="sm" variant="flat" onClick={onOpenChange}>
        <Plus size={14} />
      </Button>

      <CreateConversation isOpen={isOpen} onClose={onOpenChange} />
    </>
  );
};

export default ButtonCreateChat;
