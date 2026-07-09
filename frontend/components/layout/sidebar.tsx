'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

const navigation = [
  { href: '/dashboard', label: 'Command Center' },
  { href: '/dashboard/rules/new', label: 'Rule Builder' },
  { href: '/dashboard/customer/acme-cloud', label: 'Customer 360' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col gap-6 border-r border-white/10 bg-white/3 p-5 backdrop-blur-2xl lg:w-80">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-lg font-semibold text-emerald-200">
            F
          </div>
          <div>
            <p className="text-sm font-semibold text-white">ForesightCS</p>
            <p className="text-xs text-zinc-500">
              Customer retention command layer
            </p>
          </div>
        </div>
        <Badge variant="success" className="w-fit">
          Live model: signal fusion v4
        </Badge>
      </div>
      <nav className="space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group relative flex items-center justify-between overflow-hidden rounded-2xl border border-white/10 px-4 py-3 text-sm text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-white/5 hover:text-white',
              pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
                ? 'border-emerald-400/25 bg-white/8 text-white shadow-[0_0_0_1px_rgba(52,211,153,0.08)]'
                : ''
            )}
          >
            <span className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-emerald-300 via-violet-400 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span>{item.label}</span>
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              {pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
                ? 'active'
                : 'open'}
            </span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-[28px] border border-white/10 bg-linear-to-br from-emerald-400/10 to-violet-400/10 p-4">
        <p className="text-sm font-semibold text-white">Priority save play</p>
        <p className="mt-2 text-sm text-zinc-300">
          Northstar Health is 41% likely to churn within 30 days. Initiate
          executive outreach and renewal recovery.
        </p>
        <Button className="mt-4 w-full" variant="secondary">
          Open action plan
        </Button>
      </div>
    </aside>
  );
}
