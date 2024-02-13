import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    attachments: [
      {
        type: { type: 'string', enum: ['image', 'video'] },
        url: { type: 'string' },
      },
    ],
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    },
    content: { type: String },
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    messageReference: {
      conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
      },
      messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      },
    },
    reactions: [],
    pinned: { type: Boolean, default: false },
    tts: { type: Boolean, default: false },
    type: { type: String },
  },
  { timestamps: true }
);

const MessageModel =
  mongoose.models?.Message || mongoose.model('Message', MessageSchema);

export default MessageModel;
