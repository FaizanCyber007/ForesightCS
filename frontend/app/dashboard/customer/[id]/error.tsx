'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { PageWrapper } from '@/components/layout/page-wrapper';

export default function CustomerError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <PageWrapper className="flex min-h-screen items-center justify-center py-10">
      <GlassCard className="max-w-xl space-y-5 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
          Customer 360 error
        </p>
        <h1 className="text-3xl font-semibold text-white">
          The account view could not be loaded.
        </h1>
        <p className="text-zinc-400">
          The telemetry payload was unavailable. Retry or return to the
          dashboard.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Retry</Button>
          <Button variant="secondary" asChild>
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </GlassCard>
    </PageWrapper>
  );
}
