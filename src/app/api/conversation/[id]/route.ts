import { getCurrentUser } from '@/lib/session';
import ConversationModel from '@/server/models/Conversation';
import { TUser } from '@/types/user';

export const GET = async (
  _: Request,
  { params }: { params?: { id: string } }
) => {
  try {
    const id = params?.id;
    if (!id) throw new Error('Invalid id');

    const user = await getCurrentUser();
    if (!user) return new Response('Unauthorized', { status: 401 });

    const conversation =
      await ConversationModel.findById(id).populate('recipients');

    conversation.recipients = conversation.recipients.filter(
      (u: TUser) => u?._id?.toString() !== user?.id
    );

    return Response.json(conversation);
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
};
