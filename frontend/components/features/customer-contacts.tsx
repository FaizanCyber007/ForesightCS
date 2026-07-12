import { GlassCard } from '@/components/ui/glass-card';
import { Mail, MoreHorizontal } from 'lucide-react';
import type { CustomerDetail } from '@/services/api';

export function CustomerContacts({ contacts }: { contacts: CustomerDetail['contacts'] }) {
  return (
    <GlassCard className="h-fit space-y-4">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          Key Contacts
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          Account stakeholders
        </h2>
      </div>
      <div className="space-y-3">
        {contacts.map((contact, i) => (
          <div
            key={i}
            className="group relative flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 p-3 transition-colors hover:border-white/12 hover:bg-white/4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-zinc-300">
                {contact.avatar}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-white">{contact.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                  {contact.role}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <a
                href={`mailto:${contact.email}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                title="Send email"
              >
                <Mail className="h-4 w-4" />
              </a>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                title="More actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
