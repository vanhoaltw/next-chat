import { env } from '@/env.mjs';

export const siteConfig = {
  title: 'Next Chat',
  description: 'Fullstack chat application by Nextjs',
  keywords: [
    'Next.js',
    'Typesciprt',
    'Chat app',
    'React virtual',
    'Tankstack query',
    'Frontend',
    'React',
    'JavaScript',
    'CSS',
  ],
  url: env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  googleSiteVerificationId: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_ID || '',
};
