import { pusherServer } from '@/lib/pubsher.server';
import { getCurrentUser } from '@/lib/session';
import ConversationModel from '@/server/models/Conversation';
import MessageModel from '@/server/models/Message';
import { TConversation } from '@/types/conversation';

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const convId = searchParams.get('id');
    const user = await getCurrentUser();
    if (!user) return new Response('Unauthorized', { status: 401 });

    const conversation =
      await ConversationModel.findById<TConversation>(convId);

    if (
      !conversation ||
      !conversation?.recipients?.some?.((id) => id.toString() === user.id)
    ) {
      return new Response('Not permission', { status: 401 });
    }

    const messages = await MessageModel.find({ conversationId: convId })
      .populate('authorId')
      .sort()
      .lean();

    return Response.json({ results: messages });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
};

// Send message
export const POST = async (req: Request) => {
  const body = await req.json();
  const { conversationId, content } = body || {};

  const user = await getCurrentUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const conversation = await ConversationModel.findByIdAndUpdate(
    conversationId,
    { content }
  );
  if (
    !conversation ||
    !conversation?.recipients?.some?.((id: string) => id.toString() === user.id)
  ) {
    return new Response('Not permission', { status: 401 });
  }

  const params = {
    conversationId,
    authorId: user.id,
    content,
    ...body,
  };

  const newMessage = new MessageModel(params);
  await newMessage.save();
  await newMessage.populate('authorId');

  await pusherServer.trigger(
    [
      `conversation-${conversationId}`,
      ...conversation.recipients
        .filter((id: string) => id.toString() !== user.id)
        .map((id: string) => `user-${id}`),
    ],
    'new-message',
    newMessage
  );

  return Response.json(newMessage);
};
