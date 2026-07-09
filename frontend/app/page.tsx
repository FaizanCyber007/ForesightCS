import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Hero3D } from '@/components/features/hero-3d';
import { LandingSections } from '@/components/features/landing-sections';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.18),transparent_38%),radial-gradient(circle_at_75%_25%,rgba(139,92,246,0.16),transparent_32%)]" />
        <PageWrapper className="relative grid gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div className="space-y-8">
            <GlassCard className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Predictive customer success for SMB revenue teams
            </GlassCard>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
                Predict churn before it becomes a revenue event.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl">
                ForesightCS blends product telemetry, billing posture, support
                intensity, and account context into a premium operating system
                for modern customer success teams.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/register">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/login">View command center</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['27%', 'average churn reduction'],
                ['4.3x', 'faster intervention'],
                ['98%', 'signal coverage'],
              ].map(([value, label]) => (
                <GlassCard key={label} className="space-y-1">
                  <p className="text-3xl font-semibold text-white">{value}</p>
                  <p className="text-sm text-zinc-500">{label}</p>
                </GlassCard>
              ))}
            </div>
          </div>
          <Hero3D />
        </PageWrapper>
      </section>
      <LandingSections />
      <Footer />
    </main>
  );
}
