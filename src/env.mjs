import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_ID: z.string().min(1).optional(),
    NEXT_PUBLIC_GITHUB_ID: z.string().min(1).optional(),
    NEXT_PUBLIC_GITHUB_SECRET: z.string().min(1).optional(),
    NEXT_PUBLIC_GOOGLE_ID: z.string().min(1).optional(),
    NEXT_PUBLIC_GOOGLE_SECRET: z.string().min(1).optional(),
    PUSHER_APP_ID: z.string().min(1),
    PUSHER_APP_SECRET: z.string().min(1),
    NEXT_PUBLIC_PUSHER_APP_KEY: z.string().min(1),
    DB_URI: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_PUSHER_APP_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_ID:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_ID,

    // Github
    NEXT_PUBLIC_GITHUB_ID: process.env.NEXT_PUBLIC_GITHUB_ID,
    NEXT_PUBLIC_GITHUB_SECRET: process.env.NEXT_PUBLIC_GITHUB_SECRET,

    // Google
    NEXT_PUBLIC_GOOGLE_ID: process.env.NEXT_PUBLIC_GOOGLE_ID,
    NEXT_PUBLIC_GOOGLE_SECRET: process.env.NEXT_PUBLIC_GOOGLE_SECRET,

    // pusher
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_APP_SECRET: process.env.PUSHER_APP_SECRET,
    NEXT_PUBLIC_PUSHER_APP_KEY: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,

    // DATABASE_
    DB_URI: process.env.DB_URI,
  },
});
