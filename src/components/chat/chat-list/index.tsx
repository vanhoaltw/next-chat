'use client';

import { memo, UIEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Button } from '@nextui-org/react';
import {
  defaultRangeExtractor,
  Range,
  useVirtualizer,
} from '@tanstack/react-virtual';
import { ChevronDown } from 'lucide-react';

import ChatBubble from '../chat-bubble';

import { useSubscribe } from '@/hooks/use-subscribe';
import { cn } from '@/lib/utils';
import { getMessages } from '@/service';
import { TMessage } from '@/types/message';

const END_OFFSET = 200;

const ChatList = ({ chatId, userId }: { chatId?: string; userId: string }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const messageSoundRef = useRef(new Audio('/sounds/new-message.mp3'));
  const [reachBottom, setReachBottom] = useState(true);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => getMessages(chatId!),
    enabled: !!chatId,
  });

  const rowVirtualizer = useVirtualizer({
    count: data?.results?.length || 0,
    overscan: 10,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 35, []),
    rangeExtractor: useCallback((r: Range) => defaultRangeExtractor(r), []),
  });

  const listMessages = data?.results || [];

  const scrollToBottom = () => {
    rowVirtualizer?.scrollToIndex?.(listMessages?.length - 1, {
      align: 'start',
    });
  };

  const scrollHandler = (event: UIEvent<HTMLElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget || {};
    const isEndReached = scrollTop + clientHeight + END_OFFSET >= scrollHeight;
    setReachBottom(isEndReached);
  };

  useSubscribe<TMessage>(`conversation-${chatId}`, {
    onMessage: (pubData) => {
      if (!pubData) return;
      if (pubData?.authorId?._id === userId) return;
      messageSoundRef.current.play();
      queryClient.setQueryData<{ results: TMessage[] | undefined }>(
        ['messages', chatId],
        (old) => {
          return { results: [...(old?.results || []), pubData] };
        }
      );
    },
  });

  useEffect(() => {
    const justSend =
      listMessages?.[listMessages.length - 1]?.authorId?._id === userId;
    if ((!isLoading || justSend) && !!listMessages?.length) scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, isLoading, listMessages?.length]);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden [overflow-anchor:none]">
      <div
        ref={parentRef}
        onScroll={scrollHandler}
        className="relative inset-0 flex-1 touch-manipulation overflow-y-auto overflow-x-hidden pt-2 will-change-transform"
      >
        <div
          className="relative"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map(({ index, key, start }) => (
            <div
              key={key}
              data-index={index}
              ref={rowVirtualizer.measureElement}
              className="absolute left-0 top-0 w-full px-4"
              style={{ transform: `translateY(${start}px)` }}
            >
              <ChatBubble
                authId={userId}
                nextData={listMessages?.[index + 1]}
                prevData={listMessages?.[index - 1]}
                data={listMessages[index]}
              />
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="solid"
        color="primary"
        onClick={() => scrollToBottom()}
        radius="full"
        isIconOnly
        size="sm"
        className={cn(
          'absolute bottom-4 left-1/2 -translate-x-1/2 transition-transform',
          reachBottom ? 'translate-y-20' : 'translate-y-0'
        )}
      >
        <ChevronDown />
      </Button>
    </div>
  );
};

export default memo(ChatList);
