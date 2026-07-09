'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { PageWrapper } from '@/components/layout/page-wrapper';

export default function DashboardError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <PageWrapper className="flex min-h-screen items-center justify-center py-10">
      <GlassCard className="max-w-xl space-y-5 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
          Dashboard error
        </p>
        <h1 className="text-3xl font-semibold text-white">
          The command center did not load.
        </h1>
        <p className="text-zinc-400">
          The route state failed to render. You can retry or return to the
          landing page.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Retry</Button>
          <Button variant="secondary" asChild>
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </GlassCard>
    </PageWrapper>
  );
}
