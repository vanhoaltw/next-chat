import { MongoDBAdapter } from '@auth/mongodb-adapter';
import type { NextAuthOptions, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { getServerSession } from 'next-auth/next';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { generateAccessToken } from './lib/auth';
import { getMongoClient } from './lib/mongoDb';

import { env } from '@/env.mjs';

declare module 'next-auth' {
  interface User {
    id: string;
    avatar: string;
  }
  interface Session {
    user: User;
    accessToken: string;
  }

  interface Adapter {
    createUser(User: AdapterUser): () => Promise<User> | undefined;
  }
}

const mongoClient = getMongoClient();

export const authOptions: NextAuthOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: MongoDBAdapter(mongoClient) as any,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,
  },
  providers: [
    GitHubProvider({
      clientId: env.NEXT_PUBLIC_GITHUB_ID!,
      clientSecret: env.NEXT_PUBLIC_GITHUB_SECRET!,
      profile: async (user) => {
        return {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          role: user?.role || 'user',
          isBlocked: !!user.isBlocked,
          avatar: user?.avatar_url,
          isVerifiedEmail: !!user?.email_verified,
          createdAt: user?.createdAt || new Date().toISOString(),
          updatedAt: user?.updatedAt || new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };
      },
    }),
    GoogleProvider({
      clientId: env.NEXT_PUBLIC_GOOGLE_ID!,
      clientSecret: env.NEXT_PUBLIC_GOOGLE_SECRET!,
      profile: async (user) => {
        return {
          id: user?.id ? user?.id : user?.sub,
          name: user?.name,
          email: user?.email,
          role: user?.role || 'user',
          isBlocked: !!user.isBlocked,
          isVerifiedEmail: !!user?.email_verified,
          avatar: user?.picture,
          createdAt: user?.createdAt || new Date().toISOString(),
          updatedAt: user?.updatedAt || new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token?.user as User;
        session.accessToken = token?.accessToken as string;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (token && user) {
        const _user = {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        };
        const accessToken = await generateAccessToken({
          accessToken: token?.accessToken as string,
          user: _user,
          isRefresh: false,
        });
        token.user = _user;
        token.accessToken = accessToken;
      }
      if (token && !user) {
        const _user = token?.user as User;
        const accessToken = await generateAccessToken({
          accessToken: token?.accessToken as string,
          user: _user,
          isRefresh: true,
        });
        token.user = _user;
        token.accessToken = accessToken;
      }
      return token;
    },
  },
};

export const getNextAuthServerSession = () => getServerSession(authOptions);
