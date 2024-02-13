import { memo } from 'react';
import { Avatar, AvatarGroup } from '@nextui-org/react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { TConversation } from '@/types/conversation';

const ConversationItem = ({
  data,
  isActive,
}: {
  data: TConversation;
  isActive?: boolean;
}) => {
  const { _id, recipients = [], content } = data || {};

  const name = recipients.map((i) => i.name).join(', ');

  return (
    <Link href={`/chat?id=${_id}`}>
      <div
        className={cn(
          'hover:bg-default-100 flex items-center gap-2 rounded-md p-2 py-3',
          isActive && '!bg-default-200'
        )}
      >
        <AvatarGroup max={2}>
          {recipients.map((u) => (
            <Avatar key={`${u?._id}`} alt={u.name as string} src={u.avatar} />
          ))}
        </AvatarGroup>
        <dl className="flex-1 overflow-hidden">
          <dt className="truncate break-words font-semibold">{name}</dt>
          <dd className="text-default-400 min-w-0 truncate break-words text-xs">
            {content}
          </dd>
        </dl>
      </div>
    </Link>
  );
};

export default memo(ConversationItem);
