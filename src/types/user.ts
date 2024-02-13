import type { User } from 'next-auth';

export type TUser = { _id?: string; lastActiveAt?: Date } & User;
