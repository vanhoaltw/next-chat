'use client';
import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NextUIProvider } from '@nextui-org/react';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import relativeTime from 'dayjs/plugin/relativeTime';
import { domAnimation, LazyMotion } from 'framer-motion';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

dayjs.extend(relativeTime);
dayjs.extend(calendar);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

const RootProvider = ({
  children,
  session,
}: PropsWithChildren & { session: Session | null }) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <LazyMotion features={domAnimation}>{children}</LazyMotion>
        </NextUIProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default RootProvider;
