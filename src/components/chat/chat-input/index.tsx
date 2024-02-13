import { KeyboardEvent, useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Button, Textarea } from '@nextui-org/react';
import { Send as SendIcon } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useSession } from 'next-auth/react';

import EmojiPicker from '@/components/chat/chat-input/EmojiPicker';
import FileUpload from '@/components/chat/chat-input/FileUpload';
import { cn } from '@/lib/utils';
import { sendMessage } from '@/service';
import { TConversation } from '@/types/conversation';
import { MessageInput, TMessage } from '@/types/message';

const ChatInput = ({ chatId }: { chatId: string }) => {
  const session = useSession();
  const messageSoundRef = useRef(new Audio('/sounds/send-message.mp3'));
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputMessage, setInputMessage] = useState<string>('');
  const queryClient = useQueryClient();
  const queryKey = ['messages', chatId];

  const { user } = session.data || {};

  const { mutate: doSendMessage } = useMutation({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mutationFn: sendMessage,
    onMutate: async (input: MessageInput) => {
      if (!user) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const optimisticMessage: any = {
        ...input,
        _id: nanoid(8),
        authorId: { _id: user.id, ...user },
      };
      await queryClient.cancelQueries({ queryKey });
      const existedMessages = queryClient.getQueryData(queryKey);

      // Update last message
      queryClient.setQueryData<TConversation[]>('conversations', (old) => {
        const clone = [...(old || [])];
        const curConvIdx = clone.findIndex((c) => c._id === chatId);
        if (curConvIdx > -1)
          clone[curConvIdx] = { ...clone[curConvIdx], ...input };
        return clone;
      });

      queryClient.setQueryData<{ results: TMessage[] | undefined }>(
        queryKey,
        (old) => {
          return {
            ...old,
            results: [...(old?.results || []), optimisticMessage],
          };
        }
      );

      messageSoundRef.current.play();
      return { previousMessages: existedMessages };
    },
    onError: (_, newTodo, context?: { previousMessages: TMessage[] }) => {
      queryClient.setQueryData(queryKey, context?.previousMessages);
    },
  });

  const onSend = () => {
    if (!chatId || !inputMessage) return;
    const body = { content: inputMessage.trim(), conversationId: chatId };
    doSendMessage(body);
    setInputMessage('');
  };

  const sendImageHandler = (imageUrl: string) => {
    doSendMessage({
      conversationId: chatId,
      attachments: [{ type: 'image', url: imageUrl }],
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* <SendVoice />  TODO: Send voice message */}
      <Textarea
        placeholder="Aa"
        minRows={1}
        maxRows={4}
        autoFocus
        ref={textareaRef}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={onKeyDown}
        classNames={{
          inputWrapper: 'py-0 pr-1',
          innerWrapper: 'flex flex-rows items-center',
        }}
        endContent={
          <>
            <FileUpload onSend={sendImageHandler} />
            <EmojiPicker
              textareaRef={textareaRef}
              value={inputMessage}
              callback={setInputMessage}
            />
          </>
        }
      />
      <div
        className={cn(
          'overflow-hidden transition-[width]',
          inputMessage ? 'w-8' : 'w-0'
        )}
      >
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onClick={onSend}
          disabled={!inputMessage}
        >
          <SendIcon size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
