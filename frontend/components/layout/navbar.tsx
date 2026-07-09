import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

export function Navbar() {
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <span className="text-sm font-semibold">F</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-white/90">
              FORESIGHTCS
            </p>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
              Revenue intelligence
            </p>
          </div>
        </Link>
        <div className="hidden items-center gap-3 md:flex">
          <GlassCard className="rounded-full px-4 py-2 text-sm text-zinc-300">
            Signal scoring, retention plays, and renewal focus
          </GlassCard>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
