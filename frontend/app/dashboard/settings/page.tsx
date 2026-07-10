'use client';

import { useState } from 'react';
import {
  Bell,
  Building2,
  ChevronRight,
  Globe,
  Key,
  Palette,
  Shield,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { GlassCard } from '@/components/ui/glass-card';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/toast';

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
      <div className="space-y-1">
        <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Workspace</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Settings</h1>
        <p className="text-zinc-400">Manage your account, workspace, and integrations.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sidebar tabs */}
        <nav className="flex flex-col gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm text-left transition-all ${
                  isActive
                    ? 'border-emerald-400/20 bg-emerald-400/8 text-white'
                    : 'border-transparent text-zinc-400 hover:border-white/8 hover:bg-white/4 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-300' : 'text-zinc-500'}`} />
                {tab.label}
                {isActive && <ChevronRight className="ml-auto h-3 w-3 text-emerald-400/60" />}
              </button>
            );
          })}
        </nav>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'profile' && (
            <GlassCard className="space-y-6">
              <div>
                <h2 className="font-semibold text-white">Profile settings</h2>
                <p className="text-sm text-zinc-400">Update your personal information and preferences.</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-violet-500 text-xl font-bold text-white">
                  {user?.fullName?.split(' ').map((w: string) => w[0]).join('').slice(0, 2) || 'CS'}
                </div>
                <div>
                  <p className="font-medium text-white">{user?.fullName || 'CS User'}</p>
                  <p className="text-sm text-zinc-500">{user?.role || 'Customer Success Manager'}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Full name</span>
                  <Input defaultValue={user?.fullName || ''} placeholder="Your name" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Role / Title</span>
                  <Input defaultValue={user?.role || ''} placeholder="e.g. CSM, VP CS" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Work email</span>
                  <Input defaultValue={user?.email || ''} type="email" placeholder="you@company.com" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Company name</span>
                  <Input defaultValue={user?.companyName || ''} placeholder="Your company" />
                </label>
              </div>

              <Button onClick={handleSave} variant="brand">Save changes</Button>
            </GlassCard>
          )}

          {activeTab === 'workspace' && (
            <div className="space-y-4">
              <GlassCard className="space-y-5">
                <div>
                  <h2 className="font-semibold text-white">Integrations</h2>
                  <p className="text-sm text-zinc-400">Connect your existing tools to ForesightCS.</p>
                </div>
                <div className="space-y-3">
                  {integrationLinks.map((integration) => (
                    <div key={integration.label} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-zinc-500" />
                        <div>
                          <p className="text-sm font-medium text-white">{integration.label}</p>
                          <p className="text-xs text-zinc-500">{integration.category}</p>
                        </div>
                      </div>
                      {integration.status === 'connected' ? (
                        <span className="text-xs text-emerald-400 border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 rounded-full">Connected</span>
                      ) : (
                        <Button variant="secondary" size="sm">Connect</Button>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === 'notifications' && (
            <GlassCard className="space-y-5">
              <div>
                <h2 className="font-semibold text-white">Notification preferences</h2>
                <p className="text-sm text-zinc-400">Choose how and when you get alerted.</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Critical risk alerts', description: 'Notify when an account reaches Critical status', defaultOn: true },
                  { label: 'Renewal reminders', description: 'Alert 90, 60, and 30 days before renewal', defaultOn: true },
                  { label: 'Playbook triggers', description: 'Notify when a playbook activates on your accounts', defaultOn: false },
                  { label: 'Weekly digest', description: 'Summary of portfolio health every Monday', defaultOn: true },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{pref.label}</p>
                      <p className="text-xs text-zinc-500">{pref.description}</p>
                    </div>
                    <button
                      className={`h-6 w-11 rounded-full border transition-colors ${pref.defaultOn ? 'border-emerald-400/30 bg-emerald-400' : 'border-white/15 bg-white/10'}`}
                      aria-label={`Toggle ${pref.label}`}
                    >
                      <span className={`block h-4 w-4 rounded-full bg-white shadow transition-transform mx-1 ${pref.defaultOn ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <Button onClick={handleSave} variant="brand">Save preferences</Button>
            </GlassCard>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <GlassCard className="space-y-5">
                <div>
                  <h2 className="font-semibold text-white">Password & Security</h2>
                  <p className="text-sm text-zinc-400">Keep your account safe with a strong password.</p>
                </div>
                <div className="space-y-4">
                  <label className="block space-y-2">
                    <span className="text-sm text-zinc-300">Current password</span>
                    <Input type="password" placeholder="••••••••" />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm text-zinc-300">New password</span>
                    <Input type="password" placeholder="••••••••" />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm text-zinc-300">Confirm new password</span>
                    <Input type="password" placeholder="••••••••" />
                  </label>
                </div>
                <Button onClick={handleSave} variant="brand">
                  <Key className="h-4 w-4" /> Update password
                </Button>
              </GlassCard>

              <GlassCard className="space-y-4">
                <div>
                  <h2 className="font-semibold text-white">Two-factor authentication</h2>
                  <p className="text-sm text-zinc-400">Add an extra layer of security to your account.</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-zinc-500" />
                    <div>
                      <p className="text-sm text-white">Authenticator app</p>
                      <p className="text-xs text-zinc-500">Not configured</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Enable 2FA</Button>
                </div>
              </GlassCard>
            </div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
