import { memo, useMemo } from 'react';
import { Avatar } from '@nextui-org/react';
import dayjs from 'dayjs';

import ExtraContent from './ExtraContent';

import { cn } from '@/lib/utils';
import { TMessage } from '@/types/message';

const GROUP_TIME = 15; // Minutes

const ChatBubble = ({
  data,
  prevData,
  nextData,
  authId,
}: {
  authId: string;
  data: TMessage;
  prevData?: TMessage;
  nextData?: TMessage;
}) => {
  const { authorId: author, content, attachments, createdAt } = data || {};
  const isMine = authId === author?._id;
  const dir = isMine ? 'right' : 'left';

  const prevSame = prevData?.authorId?._id === author?._id;
  const nextSame = nextData?.authorId?._id === author?._id;

  const isNextInGroupTime = useMemo(
    () =>
      dayjs(dayjs(createdAt)).diff(nextData?.createdAt, 'minute') < GROUP_TIME,
    [createdAt, nextData?.createdAt]
  );

  const isGroupFirst = !prevSame && nextSame && !!prevData;
  const isInGroup = prevSame && nextSame;
  const isGroupLast = prevSame && !nextSame;
  const isSingle = !prevSame && !nextSame;

  if (!isNextInGroupTime && !!prevData)
    return (
      <div className="text-default-400 my-6 flex items-center gap-1.5 text-center text-xs">
        <div className="flex-1 border-t" /> {dayjs(createdAt).calendar()}
        <div className="flex-1 border-t" />
      </div>
    );

  return (
    <div
      dir={dir}
      data-is-in={isInGroup}
      data-is-first={isGroupFirst}
      data-is-last={isGroupLast}
      className={cn(
        'bubble relative flex select-none items-end gap-2',
        dir === 'left' ? 'justify-start' : 'flex-row-reverse justify-items-end',
        {
          'mb-6': isGroupLast || isSingle,
          'mb-0.5': isInGroup || isGroupFirst,
        }
      )}
    >
      {!isMine && (
        <div className="bubble-avatar relative w-10 shrink-0">
          {(isGroupLast || isSingle) && (
            <Avatar
              size="md"
              className="absolute bottom-0 left-0"
              src={author?.avatar}
              alt={author?.name as string}
            />
          )}
        </div>
      )}

      <div
        className={cn(
          'bubble-content relative grid min-h-[40px] max-w-[70%] items-center',
          !isMine ? 'bg-default-100' : 'bg-primary-200'
        )}
      >
        {(isGroupFirst || isSingle) && !isMine && (
          <small className="text-default-300 absolute -top-5 whitespace-nowrap">
            {author?.name}
          </small>
        )}
        <div className=" min-w-0 select-text whitespace-pre-wrap break-words">
          {content}
        </div>
        {!!attachments?.length && <ExtraContent attachments={attachments} />}
      </div>
    </div>
  );
};

export default memo(ChatBubble);
