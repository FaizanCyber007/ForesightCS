'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Play,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

import { GlassCard } from '@/components/ui/glass-card';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import mockData from '@/data/mock-data.json';

type Playbook = {
  id: string;
  name: string;
  description: string;
  trigger: string;
  status: string;
  accountsInPlay: number;
  lastTriggered: string;
  steps: string[];
};

const { playbooks } = mockData as typeof mockData & { playbooks: Playbook[] };

const statusConfig = {
  active: {
    label: 'Active',
    variant: 'success' as const,
    icon: Activity,
    dot: 'bg-emerald-400',
  },
  paused: {
    label: 'Paused',
    variant: 'neutral' as const,
    icon: Activity,
    dot: 'bg-zinc-500',
  },
};

export default function PlaybooksPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const activeCount = playbooks.filter((p) => p.status === 'active').length;
  const accountsInPlay = playbooks.reduce((sum, p) => sum + p.accountsInPlay, 0);

  return (
    <PageWrapper className="space-y-8 py-8 lg:py-10">
      {/* Header */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Automation</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Playbooks</h1>
            <p className="mt-1.5 text-zinc-400">
              Automated response workflows triggered by account health signals.
            </p>
          </div>
          <Button variant="brand" size="sm" asChild>
            <Link href="/dashboard/rules/new">
              <Zap className="h-4 w-4" /> New rule
            </Link>
          </Button>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <GlassCard className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
              <Activity className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Active playbooks</p>
              <p className="font-mono-numeric text-2xl font-semibold text-white">{activeCount}</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10">
              <ShieldAlert className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Accounts in play</p>
              <p className="font-mono-numeric text-2xl font-semibold text-white">{accountsInPlay}</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10">
              <BarChart3 className="h-5 w-5 text-violet-300" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Total playbooks</p>
              <p className="font-mono-numeric text-2xl font-semibold text-white">{playbooks.length}</p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Playbook list */}
      <section className="space-y-3">
        {playbooks.map((playbook, i) => {
          const cfg = statusConfig[playbook.status as keyof typeof statusConfig] ?? statusConfig.paused;
          const isExpanded = expandedId === playbook.id;

          return (
            <motion.div
              key={playbook.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <GlassCard hoverable className="space-y-0">
                <button
                  className="flex w-full items-start gap-4 text-left"
                  onClick={() => setExpandedId(isExpanded ? null : playbook.id)}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-emerald-300 mt-0.5">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-semibold text-white">{playbook.name}</p>
                      <Badge variant={cfg.variant} className="text-xs">
                        <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </Badge>
                      {playbook.accountsInPlay > 0 && (
                        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-xs text-amber-300">
                          {playbook.accountsInPlay} account{playbook.accountsInPlay !== 1 ? 's' : ''} in play
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400">{playbook.description}</p>
                    <p className="text-xs text-zinc-600">
                      Trigger: <span className="text-zinc-400">{playbook.trigger}</span> · Last run:{' '}
                      {new Date(playbook.lastTriggered).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 text-zinc-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-4 pt-4 border-t border-white/8 space-y-3"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Playbook steps</p>
                    <ol className="space-y-2">
                      {playbook.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/8 text-xs text-emerald-300">
                            {idx + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          );
        })}
      </section>
    </PageWrapper>
  );
}
