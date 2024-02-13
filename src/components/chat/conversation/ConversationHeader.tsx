'use client';

import { useMemo } from 'react';
import { Avatar, AvatarGroup } from '@nextui-org/react';
import dayjs from 'dayjs';

import { TConversation } from '@/types/conversation';

const ConversationHeader = ({ data }: { data?: TConversation }) => {
  const { recipients } = data || {};
  const isGroup = recipients?.length || 0 > 2;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const recipient = recipients?.[0];
  const convName = recipients?.map((i) => i.name).join(', ');

  const _onlineStatus = useMemo(() => {
    if (!recipient?.lastActiveAt || isGroup) return null;
    const diff = dayjs(recipient?.lastActiveAt).diff(dayjs(), 'minute');
    if (diff > 15) return `Online ${dayjs(recipient.lastActiveAt).fromNow()}`;
    return (
      <>
        <span className="mb-0.5 mr-1 inline-block size-1.5 rounded-full bg-green-500" />
        Online
      </>
    );
  }, [isGroup, recipient?.lastActiveAt]);

  return (
    <div className="flex items-center gap-3">
      <AvatarGroup max={3}>
        {recipients?.map((i) => (
          <Avatar key={`${i?._id}`} src={i?.avatar} alt={i?.name as string} />
        ))}
      </AvatarGroup>
      <div className="flex flex-1 flex-col justify-center">
        <p className="line-clamp-2 min-w-0 break-words font-semibold">
          {convName}
        </p>
        <small className="text-tiny text-default-400">{_onlineStatus}</small>
      </div>
    </div>
  );
};

export default ConversationHeader;
