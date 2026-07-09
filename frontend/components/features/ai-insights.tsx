import { Bot, ChevronRight } from 'lucide-react';

import { GlassCard } from '@/components/ui/glass-card';

export function AIInsights() {
  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center gap-2 text-emerald-300">
        <Bot className="h-4 w-4" />
        <span className="text-sm uppercase tracking-[0.3em]">AI insights</span>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white">
          Recommended actions
        </h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Live recommendations are ranked by churn pressure, commercial impact,
          and expansion upside.
        </p>
      </div>
      <div className="space-y-3">
        {[
          [
            'Northstar Health',
            'Escalate executive outreach within 24h and reopen the adoption review with the customer owner.',
          ],
          [
            'Orbit Finance',
            'Trigger billing follow-up and feature coaching to reduce renewal pressure before the next checkpoint.',
          ],
          [
            'Summit Ops',
            'Package the expansion motion now. Usage is strong and the account is ready for commercial growth.',
          ],
        ].map(([title, text]) => (
          <div
            key={title}
            className="rounded-3xl border border-white/10 bg-black/25 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-white">{title}</p>
              <ChevronRight className="h-4 w-4 text-zinc-500" />
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
        Model confidence is strong across the top risk accounts this week.
      </div>
    </GlassCard>
  );
}
