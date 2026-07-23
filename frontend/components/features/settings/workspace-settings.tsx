'use client';

import { GlassCard } from '@/components/ui/glass-card';

const integrationCategories = [
  { label: 'Salesforce', category: 'CRM' },
  { label: 'Stripe', category: 'Billing' },
  { label: 'Zendesk', category: 'Support' },
  { label: 'HubSpot', category: 'CRM' },
];

export function WorkspaceSettings() {
  return (
    <GlassCard className="space-y-6 relative overflow-hidden group">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500/20 via-transparent to-transparent" />
      <div>
        <h2 className="font-semibold text-white text-base">Signal Integrations</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Integration management isn&apos;t available yet -- these connections aren&apos;t live.
        </p>
      </div>
      <div className="space-y-2.5">
        {integrationCategories.map((integration) => (
          <div key={integration.label} className="flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg border border-white/5 bg-white/5 flex items-center justify-center text-xs font-bold text-zinc-400">
                {integration.label[0]}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{integration.label}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{integration.category}</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-zinc-400 border border-white/10 bg-white/5 px-2.5 py-1 rounded-full">
              Unavailable
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
