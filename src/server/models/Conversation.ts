import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    content: { type: String },
  },
  { timestamps: true }
);

const ConversationModel =
  mongoose.models?.Conversation ||
  mongoose.model('Conversation', ConversationSchema);

export default ConversationModel;
