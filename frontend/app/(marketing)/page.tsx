'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

import { LandingSections } from '@/components/features/landing-sections';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

const stats = [
  ['27%', 'average churn reduction'],
  ['4.3x', 'faster intervention'],
  ['98%', 'signal coverage'],
];

const riskRows = [
  { name: 'Acme Cloud', risk: 8, tone: 'bg-emerald-300' },
  { name: 'Northstar Health', risk: 41, tone: 'bg-amber-300' },
  { name: 'Atlas Retail', risk: 78, tone: 'bg-rose-300' },
  { name: 'Summit Ops', risk: 6, tone: 'bg-emerald-300' },
];

export default function Home() {
  const reduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <PageWrapper className="relative grid gap-10 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-32">
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <GlassCard className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm text-zinc-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                Predictive customer success for SMB revenue teams
              </GlassCard>
            </motion.div>

            <motion.div className="space-y-5" variants={itemVariants}>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl">
                Predict churn before it becomes a{' '}
                <span className="bg-gradient-to-r from-emerald-300 to-violet-400 bg-clip-text text-transparent">
                  revenue event.
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl">
                ForesightCS blends product telemetry, billing posture, support
                intensity, and account context into a premium operating system
                for modern customer success teams.
              </p>
            </motion.div>

            <motion.div className="flex flex-wrap gap-3" variants={itemVariants}>
              <Button asChild size="lg">
                <Link href="/register">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/login">View command center</Link>
              </Button>
            </motion.div>

            <motion.div
              className="grid gap-4 sm:grid-cols-3"
              variants={itemVariants}
            >
              {stats.map(([value, label]) => (
                <GlassCard key={label} className="space-y-1">
                  <p className="font-mono-numeric text-3xl font-semibold text-white">
                    {value}
                  </p>
                  <p className="text-sm text-zinc-500">{label}</p>
                </GlassCard>
              ))}
            </motion.div>
          </motion.div>

          {/* Live signal preview panel */}
          <motion.div
            initial={{ opacity: 0, x: reduceMotion ? 0 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroPreview />
          </motion.div>
        </PageWrapper>
      </section>
      <LandingSections />
    </>
  );
}

function HeroPreview() {
  return (
    <GlassCard className="relative space-y-4 p-5 backdrop-blur-2xl">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-zinc-500">
        <span>Live signal map</span>
        <span className="flex items-center gap-2 text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
          streaming
        </span>
      </div>
      <div className="space-y-2.5">
        {riskRows.map((row, i) => (
          <motion.div
            key={row.name}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
            className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/30 px-4 py-3"
          >
            <span className="text-sm text-white">{row.name}</span>
            <div className="flex-1" />
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className={`h-full rounded-full ${row.tone}`}
                initial={{ width: 0 }}
                animate={{ width: `${row.risk}%` }}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
              />
            </div>
            <span className="font-mono-numeric w-9 text-right text-xs text-zinc-400">
              {row.risk}%
            </span>
          </motion.div>
        ))}
      </div>

      {/* Mini chart preview */}
      <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
          <span>ARR momentum</span>
          <span className="text-emerald-300">↑ +12% MoM</span>
        </div>
        <div className="flex items-end gap-1.5 h-12">
          {[40, 55, 48, 62, 70, 78, 85, 92].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-sm bg-emerald-400/30"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.05 }}
              style={{ alignSelf: 'flex-end' }}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-zinc-500">
        Health, risk, and renewal posture consolidated into one revenue surface.
      </p>
    </GlassCard>
  );
}
