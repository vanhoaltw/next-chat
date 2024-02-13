import { useEffect } from 'react';

import { pusherClient } from '@/lib/pubsher.client';

export const useSubscribe = <TData>(
  channelName: string,
  { onMessage }: { onMessage?: (data: TData) => void } = {}
) => {
  useEffect(() => {
    if (!channelName) return;
    pusherClient.subscribe(channelName);
    pusherClient.bind('new-message', onMessage!);

    return () => {
      pusherClient.unsubscribe(channelName);
      pusherClient.unbind('new-message', onMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName]);
};
