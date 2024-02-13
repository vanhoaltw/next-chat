'use client';

import PusherClient from 'pusher-js';

import { env } from '@/env.mjs';

export const pusherClient = new PusherClient(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
  cluster: 'ap1',
});
