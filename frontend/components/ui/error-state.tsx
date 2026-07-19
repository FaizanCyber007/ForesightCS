'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { PageWrapper } from '@/components/layout/page-wrapper';

export function ErrorState({
  eyebrow,
  title,
  description,
  reset,
  homeHref = '/',
  homeLabel = 'Go home',
}: {
  eyebrow: string;
  title: string;
  description: string;
  reset: () => void;
  homeHref?: string;
  homeLabel?: string;
}) {
  return (
    <PageWrapper className="flex min-h-screen items-center justify-center py-10">
      <GlassCard className="max-w-xl space-y-5 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">{eyebrow}</p>
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        <p className="text-zinc-400">{description}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Retry</Button>
          <Button variant="secondary" asChild>
            <Link href={homeHref}>{homeLabel}</Link>
          </Button>
        </div>
      </GlassCard>
    </PageWrapper>
  );
}
