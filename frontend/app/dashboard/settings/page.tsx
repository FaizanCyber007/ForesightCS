'use client';

import { useState } from 'react';
import {
  Bell,
  Building2,
  ChevronRight,
  Globe,
  Key,
  Shield,
  User,
  Settings,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { GlassCard } from '@/components/ui/glass-card';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/cn';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'workspace', label: 'Workspace', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

const integrationLinks = [
  { label: 'Salesforce', status: 'connected', category: 'CRM' },
  { label: 'Stripe', status: 'connected', category: 'Billing' },
  { label: 'Zendesk', status: 'not connected', category: 'Support' },
  { label: 'HubSpot', status: 'not connected', category: 'CRM' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();
  const { toast } = useToast();

  function handleSave() {
    toast({ title: 'Settings saved', description: 'Your preferences have been updated.', tone: 'success' });
  }

  return (
    <PageWrapper className="space-y-8 py-8 lg:py-10">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Workspace</p>
        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="h-7 w-7 text-emerald-400" />
          Settings
        </h1>
        <p className="max-w-2xl text-sm text-zinc-400 leading-relaxed">
          Manage your personal account, security parameters, notifications, and integration signals.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr] items-start">
        {/* Sidebar tabs */}
        <nav className="flex flex-col gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-4 py-3 text-xs font-semibold text-left transition-all',
                  isActive
                    ? 'border-emerald-400/25 bg-emerald-400/8 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.1)]'
                    : 'border-transparent text-zinc-500 hover:border-white/5 hover:bg-white/3 hover:text-zinc-300'
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-emerald-300' : 'text-zinc-500')} />
                {tab.label}
                {isActive && <ChevronRight className="ml-auto h-3 w-3 text-emerald-300/60" />}
              </button>
            );
          })}
        </nav>

        {/* Tab content wrapper */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && (
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

                  <Button onClick={handleSave} variant="brand" className="h-10 text-xs">Save profile changes</Button>
                </GlassCard>
              )}

              {activeTab === 'workspace' && (
                <GlassCard className="space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500/20 via-transparent to-transparent" />
                  <div>
                    <h2 className="font-semibold text-white text-base">Signal Integrations</h2>
                    <p className="text-xs text-zinc-400 mt-0.5">Manage live data connections feeds syncing into your health model.</p>
                  </div>
                  <div className="space-y-2.5">
                    {integrationLinks.map((integration) => (
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
                        {integration.status === 'connected' ? (
                          <span className="text-[10px] font-semibold text-emerald-300 border border-emerald-400/20 bg-emerald-400/8 px-2.5 py-1 rounded-full">Connected</span>
                        ) : (
                          <Button variant="secondary" size="xs">Connect API</Button>
                        )}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {activeTab === 'notifications' && (
                <GlassCard className="space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-transparent" />
                  <div>
                    <h2 className="font-semibold text-white text-base">Notification triggers</h2>
                    <p className="text-xs text-zinc-400 mt-0.5">Select when your team should receive slack and email notifications.</p>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Critical risk alerts', description: 'Notify when an account reaches Critical status', defaultOn: true },
                      { label: 'Renewal reminders', description: 'Alert 90, 60, and 30 days before renewal', defaultOn: true },
                      { label: 'Playbook triggers', description: 'Notify when a playbook activates on your accounts', defaultOn: false },
                      { label: 'Weekly digest', description: 'Summary of portfolio health every Monday', defaultOn: true },
                    ].map((pref) => {
                      const [on, setOn] = useState(pref.defaultOn);
                      return (
                        <div key={pref.label} className="flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-4 py-3">
                          <div>
                            <p className="text-xs font-semibold text-white">{pref.label}</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{pref.description}</p>
                          </div>
                          <button
                            onClick={() => setOn(!on)}
                            className={cn(
                              'h-5 w-9 rounded-full border transition-colors flex items-center',
                              on ? 'border-emerald-400/30 bg-emerald-500/80' : 'border-white/15 bg-white/10'
                            )}
                            aria-label={`Toggle ${pref.label}`}
                          >
                            <span className={cn(
                              'block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
                              on ? 'translate-x-[16px]' : 'translate-x-[2px]'
                            )} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <Button onClick={handleSave} variant="brand" className="h-10 text-xs">Save notification settings</Button>
                </GlassCard>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  <GlassCard className="space-y-5 relative overflow-hidden group">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500/20 via-transparent to-transparent" />
                    <div>
                      <h2 className="font-semibold text-white text-base">Password &amp; Security</h2>
                      <p className="text-xs text-zinc-400 mt-0.5">Keep your security posture robust with strong passwords.</p>
                    </div>
                    <div className="space-y-3 pt-2">
                      <label className="block space-y-1.5">
                        <span className="text-xs font-semibold text-zinc-400">Current password</span>
                        <Input className="h-10 text-sm" type="password" placeholder="••••••••" />
                      </label>
                      <label className="block space-y-1.5">
                        <span className="text-xs font-semibold text-zinc-400">New password</span>
                        <Input className="h-10 text-sm" type="password" placeholder="••••••••" />
                      </label>
                      <label className="block space-y-1.5">
                        <span className="text-xs font-semibold text-zinc-400">Confirm new password</span>
                        <Input className="h-10 text-sm" type="password" placeholder="••••••••" />
                      </label>
                    </div>
                    <Button onClick={handleSave} variant="brand" className="h-10 text-xs gap-1.5">
                      <Key className="h-4 w-4" /> Update password credentials
                    </Button>
                  </GlassCard>

                  <GlassCard className="space-y-4 relative overflow-hidden group">
                    <div>
                      <h2 className="font-semibold text-white text-base">Two-factor authentication</h2>
                      <p className="text-xs text-zinc-400 mt-0.5">Add an extra verification shield to your workspace.</p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/5 bg-black/20 text-zinc-500">
                          <Shield className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Authenticator app (TOTP)</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Not configured</p>
                        </div>
                      </div>
                      <Button variant="secondary" size="xs">Configure 2FA</Button>
                    </div>
                  </GlassCard>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
