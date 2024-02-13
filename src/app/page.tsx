'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push('/chat'), 500);
    return () => {
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <section className="container mt-10 flex flex-col items-center gap-3 text-center md:absolute md:left-1/2 md:top-1/2 md:mt-0 md:-translate-x-1/2 md:-translate-y-1/2">
      <h1 className="animate-bounce text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        Next Chat
      </h1>
      <p className="text-muted-foreground flex max-w-2xl items-center gap-1.5">
        Next Chat is setting up, please wait...{' '}
        <Loader2 className="animate-spin" />
      </p>
    </section>
  );
};

export default Home;
