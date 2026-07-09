'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { PageWrapper } from '@/components/layout/page-wrapper';

export default function RootError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <PageWrapper className="flex min-h-screen items-center justify-center py-10">
      <GlassCard className="max-w-xl space-y-5 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
          Application error
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Something interrupted the product shell.
        </h1>
        <p className="text-zinc-400">Try again or return to the homepage.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Retry</Button>
          <Button variant="secondary" asChild>
            <Link href="/">Home</Link>
          </Button>
        </div>
      </GlassCard>
    </PageWrapper>
  );
}
