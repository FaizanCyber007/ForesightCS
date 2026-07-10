'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Bot,
  ChevronRight,
  Crown,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldAlert,
  Users,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

const navigation = [
  {
    href: '/dashboard',
    label: 'Command Center',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/dashboard/rules/new',
    label: 'Rule Builder',
    icon: Zap,
    exact: false,
  },
  {
    href: '/dashboard/customer/acme-cloud',
    label: 'Customer 360',
    icon: Users,
    exact: false,
  },
];

const secondaryNav = [
  { href: '/dashboard', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard', label: 'Playbooks', icon: ShieldAlert },
  { href: '/dashboard', label: 'AI Copilot', icon: Bot },
  { href: '/dashboard', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-full w-full flex-col gap-5 border-r border-white/10 bg-[#0a0a0a]/80 p-5 backdrop-blur-2xl lg:w-80">
      {/* Logo + badge */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-lg font-bold text-emerald-200 shadow-[0_0_24px_rgba(16,185,129,0.15)]">
            F
          </div>
          <div>
            <p className="text-sm font-semibold text-white">ForesightCS</p>
            <p className="text-xs text-zinc-500">Customer retention OS</p>
          </div>
        </div>
        <Badge variant="success" className="w-fit">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-300 inline-block animate-pulse" />
          Live · signal fusion v4
        </Badge>
      </div>

      {/* Primary nav */}
      <nav className="space-y-1" aria-label="Primary navigation">
        {navigation.map((item) => {
          const active = isActive(item.href, item.exact ?? false);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-sm transition-all duration-300',
                active
                  ? 'border-emerald-400/25 bg-emerald-400/8 text-white shadow-[0_0_0_1px_rgba(52,211,153,0.08),0_4px_24px_rgba(16,185,129,0.08)]'
                  : 'border-white/5 bg-white/3 text-zinc-400 hover:border-white/10 hover:bg-white/6 hover:text-white'
              )}
              aria-current={active ? 'page' : undefined}
            >
              {/* Active accent bar */}
              <span
                className={cn(
                  'absolute inset-y-0 left-0 w-1 rounded-r-full bg-gradient-to-b from-emerald-300 to-violet-400 transition-opacity duration-300',
                  active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                )}
              />
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0',
                  active ? 'text-emerald-300' : 'text-zinc-500 group-hover:text-zinc-300'
                )}
              />
              <span className="font-medium">{item.label}</span>
              {active && (
                <ChevronRight className="ml-auto h-3 w-3 text-emerald-400/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-white/8" />

      {/* Secondary nav */}
      <nav className="space-y-1" aria-label="Secondary navigation">
        <p className="mb-2 px-4 text-xs uppercase tracking-[0.35em] text-zinc-600">
          Tools
        </p>
        {secondaryNav.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="group flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm text-zinc-500 transition-colors hover:bg-white/4 hover:text-zinc-300"
            >
              <Icon className="h-4 w-4 shrink-0 text-zinc-600 group-hover:text-zinc-400" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Priority save-play card */}
      <div className="mt-auto space-y-4">
        <div className="rounded-[24px] border border-rose-500/20 bg-gradient-to-br from-rose-500/10 via-transparent to-orange-500/5 p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-rose-300">
            <Crown className="h-3.5 w-3.5" />
            Priority save play
          </div>
          <p className="mt-2 text-sm font-medium text-white">Northstar Health</p>
          <p className="mt-1 text-sm text-zinc-300">
            41% churn probability. Initiate executive outreach before the renewal window closes.
          </p>
          <Link
            href="/dashboard/customer/northstar-health"
            className="mt-3 flex items-center gap-1.5 text-xs text-rose-300 transition-colors hover:text-rose-200"
          >
            Open account <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* User section */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-violet-500 text-xs font-bold text-white">
            JR
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">Jordan Rivera</p>
            <p className="truncate text-xs text-zinc-500">CSM · Enterprise</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="shrink-0 text-zinc-500 transition-colors hover:text-rose-300"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
