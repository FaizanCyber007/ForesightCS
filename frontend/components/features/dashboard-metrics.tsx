'use client';

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

import { GlassCard } from '@/components/ui/glass-card';
import { formatCompactNumber, formatPercent } from '@/lib/formatters';
import type { DashboardMetric } from '@/services/api';

export function DashboardMetrics({ metrics }: { metrics: DashboardMetric[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: index * 0.05 }}
          whileHover={reduceMotion ? undefined : { y: -4 }}
        >
          <GlassCard hoverable className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-zinc-400">{metric.label}</p>
              <div
                className={
                  metric.trend === 'up' ? 'text-emerald-300' : 'text-rose-300'
                }
              >
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-semibold text-white">
                {metric.label.toLowerCase().includes('score')
                  ? formatPercent(metric.value)
                  : formatCompactNumber(metric.value)}
              </p>
              <p className="text-sm text-zinc-500">{metric.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={
                  metric.trend === 'up'
                    ? 'h-2 flex-1 rounded-full bg-emerald-400/20'
                    : 'h-2 flex-1 rounded-full bg-rose-400/20'
                }
              >
                <motion.div
                  className={
                    metric.trend === 'up'
                      ? 'h-full rounded-full bg-emerald-300'
                      : 'h-full rounded-full bg-rose-300'
                  }
                  initial={{ width: 0 }}
                  whileInView={{
                    width: `${Math.min(100, Math.abs(metric.delta) * 4 + 24)}%`,
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <p
                className={
                  metric.trend === 'up'
                    ? 'text-sm text-emerald-300'
                    : 'text-sm text-rose-300'
                }
              >
                {metric.delta > 0 ? '+' : ''}
                {metric.delta}%
              </p>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
