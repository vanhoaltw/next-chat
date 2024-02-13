import { getCurrentUser } from '@/lib/session';
import dbConnect from '@/server/dbConnect';
import Conversation from '@/server/models/Conversation';
import { TUser } from '@/types/user';

export const GET = async () => {
  try {
    await dbConnect();
    const user = await getCurrentUser();

    const conversations = await Conversation.find({
      recipients: user?.id,
    })
      .populate('recipients')
      .lean();

    conversations.map((c) => {
      c.recipients = c.recipients.filter(
        (u: TUser) => u?._id?.toString?.() !== user?.id
      );
      return c;
    });

    return Response.json(conversations);
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
};

// Create new Conversation
export const POST = async (req: Request) => {
  try {
    await dbConnect();
    const body = await req.json();
    const user = await getCurrentUser();
    if (!user) return new Response('Unauthorized', { status: 401 });

    if (!Array.isArray(body?.userIds) || !body?.userIds?.length)
      throw Error('Invalid params');

    let conversation = await Conversation.findOne({
      recipients: { $all: [user.id, ...body.userIds] }, // Find direct conversations
    });

    if (!conversation) {
      const params = {
        ownerId: user.id,
        recipients: [user.id, ...body.userIds],
      };

      const newConv = new Conversation(params);
      await newConv.save();
      conversation = newConv;
    }

    return Response.json(conversation);
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
