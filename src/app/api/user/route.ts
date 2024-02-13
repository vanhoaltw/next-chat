import { getCurrentUser } from '@/lib/session';
import UserModel from '@/server/models/User';

export const GET = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthenticated');

    const users = await UserModel.find({
      _id: { $ne: user.id },
    });

    return Response.json(users);
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
};
