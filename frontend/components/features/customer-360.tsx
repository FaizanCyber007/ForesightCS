'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Mail, Phone, Users, ExternalLink, Calendar, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { formatCurrency } from '@/lib/formatters';
import type { CustomerDetail } from '@/services/api';

/** Radial health gauge — SVG ring that fills based on health score. */
function HealthGauge({ score, health }: { score: number; health: string }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const filled = circumference * (score / 100);
  const color =
    health === 'Healthy'
      ? '#34d399'
      : health === 'At-Risk'
        ? '#f59e0b'
        : '#fb7185';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - filled }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        <div className="text-center">
          <p className="font-mono-numeric text-2xl font-semibold text-white">{score}</p>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">score</p>
        </div>
      </div>
      <Badge
        variant={
          health === 'Healthy' ? 'success' : health === 'At-Risk' ? 'warning' : 'danger'
        }
      >
        {health}
      </Badge>
    </div>
  );
}

/** Score breakdown bar */
function SignalBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono-numeric text-zinc-300">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

interface PlaybookTask {
  text: string;
  icon: LucideIcon;
  done: boolean;
}

const initialTasks: PlaybookTask[] = [
  { text: 'Send QBR invite to executive sponsor', icon: Mail, done: true },
  { text: 'Review feature adoption drop with product team', icon: Users, done: false },
  { text: 'Sync on upcoming renewal terms', icon: Phone, done: false },
  { text: 'Schedule health review call', icon: Calendar, done: false },
];

export function Customer360({ customer }: { customer: CustomerDetail }) {
  const [tasks, setTasks] = useState(initialTasks);

  function toggleTask(index: number) {
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, done: !t.done } : t))
    );
  }

  const completedCount = tasks.filter((t) => t.done).length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  const categoryColors: Record<string, string> = {
    product: '#34d399',
    billing: '#a78bfa',
    support: '#f59e0b',
    signal: '#60a5fa',
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <GlassCard className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
              Customer 360
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              {customer.company}
            </h1>
            <p className="mt-1 text-zinc-400">
              {customer.name} · {customer.segment} · Owned by{' '}
              <span className="text-zinc-200">{customer.owner}</span>
            </p>
          </div>
          <HealthGauge score={customer.engagementScore} health={customer.health} />
        </div>

        {/* Key metrics row */}
        <div className="grid gap-3 md:grid-cols-5">
          {[
            { label: 'MRR', value: formatCurrency(customer.monthlyRecurringRevenue) },
            { label: 'ACV', value: formatCurrency(customer.annualContractValue) },
            { label: 'Billing', value: customer.billingStatus },
            { label: 'Churn risk', value: `${customer.churnProbability}%` },
            { label: 'NPS', value: customer.netPromoterScore > 0 ? `+${customer.netPromoterScore}` : String(customer.netPromoterScore) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-3xl border border-white/8 bg-black/20 p-4"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{label}</p>
              <p className="mt-2 font-mono-numeric text-xl font-semibold text-white">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Renewal & contact */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-4 py-2">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-zinc-400">Renewal:</span>
            <span className="text-white">
              {new Date(customer.renewalDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <a
            href={`mailto:${customer.accountOwnerEmail}`}
            className="flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-4 py-2 text-zinc-400 transition-colors hover:text-white"
          >
            <Mail className="h-3.5 w-3.5" />
            {customer.accountOwnerEmail}
            <ExternalLink className="h-3 w-3 text-zinc-600" />
          </a>
        </div>
      </GlassCard>

      {/* Telemetry + Playbook */}
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassCard className="space-y-5">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Telemetry
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Engagement signals &amp; adoption depth
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(customer.technologySignals).map(([key, value]) => (
              <div
                key={key}
                className="rounded-3xl border border-white/8 bg-white/4 p-4"
              >
                <p className="text-sm capitalize text-zinc-500">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="mt-2 font-mono-numeric text-2xl font-semibold text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Signal breakdown bars */}
          <div className="space-y-3 rounded-3xl border border-white/8 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              Health signal breakdown
            </p>
            <SignalBar label="Product adoption" value={customer.engagementScore} color="#34d399" />
            <SignalBar label="Support intensity" value={Math.min(100, customer.supportTickets * 9)} color="#f59e0b" />
            <SignalBar label="Expansion potential" value={customer.expansionPotential} color="#a78bfa" />
          </div>
        </GlassCard>

        {/* Playbook runner */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                Playbooks
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                Active tasks
              </h2>
            </div>
            <div className="text-right">
              <p className="font-mono-numeric text-2xl font-semibold text-white">
                {completedCount}/{tasks.length}
              </p>
              <p className="text-xs text-zinc-500">completed</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-violet-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="space-y-2">
            {tasks.map((task, i) => {
              const Icon = task.icon;
              return (
                <button
                  key={i}
                  onClick={() => toggleTask(i)}
                  className="flex w-full items-start gap-3 rounded-2xl border border-white/8 bg-black/20 p-3 text-left text-sm transition-colors hover:border-white/12 hover:bg-white/4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
                  aria-pressed={task.done}
                >
                  {task.done ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-zinc-600" />
                  )}
                  <div className="flex flex-1 items-center justify-between gap-2">
                    <span
                      className={
                        task.done
                          ? 'text-zinc-500 line-through'
                          : 'text-zinc-300'
                      }
                    >
                      {task.text}
                    </span>
                    <Icon className="h-4 w-4 shrink-0 text-zinc-600" />
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Timeline + Notes */}
      <div className="grid gap-4 xl:grid-cols-2">
        <GlassCard className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Timeline
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Recent events &amp; signal shifts
            </h2>
          </div>
          <div className="relative space-y-3 pl-6 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-px before:bg-white/8">
            {customer.timeline.map((event) => {
              const dotColor = categoryColors[event.category] ?? '#71717a';
              return (
                <div
                  key={event.id}
                  className="relative rounded-3xl border border-white/8 bg-black/20 p-4"
                >
                  {/* Timeline dot */}
                  <span
                    className="absolute -left-[14px] top-5 h-3 w-3 rounded-full border-2 border-[#0a0a0a]"
                    style={{ backgroundColor: dotColor }}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-white">{event.title}</p>
                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.3em]"
                      style={{
                        backgroundColor: `${dotColor}20`,
                        color: dotColor,
                        border: `1px solid ${dotColor}40`,
                      }}
                    >
                      {event.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{event.detail}</p>
                  <p className="mt-3 text-xs text-zinc-600">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="h-fit space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Account notes
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Context summary
            </h2>
          </div>
          <div className="space-y-3 text-sm text-zinc-300">
            {customer.notes.map((note, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/8 bg-black/20 p-4"
              >
                {note}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
