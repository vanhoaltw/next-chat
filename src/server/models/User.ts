import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { env } from '@/env.mjs';

const { Schema } = mongoose;

mongoose.connect(env.DB_URI);

mongoose.Promise = global.Promise;

const UserSchema = new Schema(
  {
    id: { type: Schema.ObjectId },
    name: String,
    email: String,
    password: String,
    role: String,
    avatar: { type: String },
    isVerifiedEmail: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    lastActiveAt: { type: Date, default: new Date().toISOString() },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.hash_password);
};

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export default UserModel;
