import { signIn } from 'next-auth/react';

import ChatDesktop from './(desktop)';
import ChatMobile from './(mobile)';

import { getNextAuthServerSession } from '@/auth';
import { isMobileDevice } from '@/lib/responsive';

interface Props {
  searchParams: { id?: string };
}

const ChatPage = async ({ searchParams }: Props) => {
  const chatId = searchParams?.id;
  const session = await getNextAuthServerSession();

  const isMobile = isMobileDevice();

  if (!session?.user) return signIn();

  if (isMobile) return <ChatMobile />;
  return <ChatDesktop chatId={chatId} user={session?.user} />;
};

export default ChatPage;
