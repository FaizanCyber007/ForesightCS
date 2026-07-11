'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
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
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Automation ledger</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">Save-Play Playbooks</h1>
            <p className="mt-1 text-sm text-zinc-400 leading-relaxed max-w-xl">
              Automated response workflows triggered by custom health signals, login drop thresholds, or critical support trends.
            </p>
          </div>
          <Button variant="brand" size="sm" asChild>
            <Link href="/dashboard/rules/new">
              <Zap className="h-4 w-4" /> Define new rule
            </Link>
          </Button>
        </div>

        {/* Summary stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <GlassCard className="flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/20 to-transparent" />
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/8 text-emerald-300">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Active playbooks</p>
              <p className="font-mono-numeric text-2xl font-bold text-white mt-0.5">{activeCount}</p>
            </div>
          </GlassCard>
          
          <GlassCard className="flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500/20 to-transparent" />
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/8 text-amber-300">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Accounts in play</p>
              <p className="font-mono-numeric text-2xl font-bold text-white mt-0.5">{accountsInPlay}</p>
            </div>
          </GlassCard>

          <GlassCard className="flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500/20 to-transparent" />
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/8 text-violet-300">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Total playbooks</p>
              <p className="font-mono-numeric text-2xl font-bold text-white mt-0.5">{playbooks.length}</p>
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
              <div className={`rounded-2xl border p-5 transition-all ${
                isExpanded ? 'border-white/12 bg-white/[0.04]' : 'border-white/8 bg-white/[0.02] hover:bg-white/[0.03]'
              }`}>
                <button
                  className="flex w-full items-start gap-4 text-left focus-visible:outline-none"
                  onClick={() => setExpandedId(isExpanded ? null : playbook.id)}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-black/20 text-zinc-400 mt-0.5">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-semibold text-white text-base">{playbook.name}</p>
                      <Badge variant={cfg.variant} className="text-[10px] font-semibold">
                        <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </Badge>
                      {playbook.accountsInPlay > 0 && (
                        <span className="rounded-full border border-amber-400/20 bg-amber-400/8 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                          {playbook.accountsInPlay} active account{playbook.accountsInPlay !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 leading-normal">{playbook.description}</p>
                    <p className="text-xs text-zinc-500 font-medium">
                      Trigger rule: <span className="text-zinc-300 font-semibold">{playbook.trigger}</span> · Last run:{' '}
                      {new Date(playbook.lastTriggered).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center border border-white/5 hover:bg-white/5 transition-colors">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-zinc-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-zinc-500" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-white/8 space-y-4">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Playbook execution path</p>
                        <ol className="space-y-3 pl-1">
                          {playbook.steps.map((step, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-sm text-zinc-300">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/8 text-xs font-bold text-emerald-300 font-mono-numeric">
                                {idx + 1}
                              </span>
                              <span className="leading-none">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </section>
    </PageWrapper>
  );
}
