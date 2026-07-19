'use client';

import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';

export function ProfileSettings() {
  const { user } = useAuth();

  return (
    <GlassCard className="space-y-6 relative overflow-hidden group">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-transparent" />
      <div>
        <h2 className="font-semibold text-white text-base">Profile settings</h2>
        <p className="text-xs text-zinc-400 mt-0.5">Update your personal identification information and team role.</p>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-violet-600 text-lg font-bold text-white shadow-[0_4px_16px_rgba(16,185,129,0.2)]">
          {user?.fullName?.split(' ').map((w: string) => w[0]).join('').slice(0, 2) || 'CS'}
        </div>
        <div>
          <p className="font-semibold text-white text-base leading-tight">{user?.fullName || 'CS User'}</p>
          <p className="text-xs text-zinc-500 mt-1">{user?.role || 'Customer Success Manager'}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 pt-2">
        <label className="space-y-1.5 block">
          <span className="text-xs font-semibold text-zinc-400">Full name</span>
          <Input className="h-10 text-sm" defaultValue={user?.fullName || ''} placeholder="Your name" />
        </label>
        <label className="space-y-1.5 block">
          <span className="text-xs font-semibold text-zinc-400">Role / Title</span>
          <Input className="h-10 text-sm" defaultValue={user?.role || ''} placeholder="e.g. CSM, VP CS" />
        </label>
        <label className="space-y-1.5 block">
          <span className="text-xs font-semibold text-zinc-400">Work email</span>
          <Input className="h-10 text-sm" defaultValue={user?.email || ''} type="email" placeholder="you@company.com" />
        </label>
        <label className="space-y-1.5 block">
          <span className="text-xs font-semibold text-zinc-400">Company name</span>
          <Input className="h-10 text-sm" defaultValue={user?.companyName || ''} placeholder="Your company" />
        </label>
      </div>

      <Button variant="brand" className="h-10 text-xs" disabled title="Profile editing isn't wired up to the backend yet.">
        Save profile changes
      </Button>
    </GlassCard>
  );
}
