import { useQuery } from 'react-query';
import { Skeleton } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';

import ConversationItem from './ConversationItem';

import { getConversation } from '@/service';

const ConversationList = () => {
  const searchParams = useSearchParams();
  const currentConvId = searchParams.get('id');

  const { data = [], isLoading } = useQuery('conversations', {
    queryFn: () => getConversation(),
  });

  return (
    <div className="flex flex-col gap-0.5">
      {isLoading ? (
        <>
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </>
      ) : (
        data?.map((i) => (
          <ConversationItem
            isActive={currentConvId === i._id}
            data={i}
            key={i._id}
          />
        ))
      )}
    </div>
  );
};

export default ConversationList;
