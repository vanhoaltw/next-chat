import { getNextAuthServerSession } from '@/auth';

export const getCurrentUser = async () => {
  const session = await getNextAuthServerSession();
  return session?.user;
};
