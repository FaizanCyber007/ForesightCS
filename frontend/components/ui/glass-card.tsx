import * as React from 'react';

import { cn } from '@/lib/cn';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function GlassCard({
  className,
  hoverable = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl',
        hoverable &&
          'transition-transform duration-300 hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-white/[0.06]',
        className
      )}
      {...props}
    />
  );
}
