'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

import { GlassCard } from '@/components/ui/glass-card';

export type PlaybookTask = {
  text: string;
  icon: LucideIcon;
  done: boolean;
};

export function PlaybookCard({
  tasks,
  onToggleTask,
}: {
  tasks: PlaybookTask[];
  onToggleTask: (index: number) => void;
}) {
  const completedCount = tasks.filter((t) => t.done).length;
  const progressPct = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Playbooks
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Active tasks
          </h2>
        </div>
        <div className="text-right">
          <p className="font-mono-numeric text-2xl font-semibold text-white">
            {completedCount}/{tasks.length}
          </p>
          <p className="text-xs text-zinc-500">completed</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-violet-400"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="space-y-2">
        {tasks.map((task, i) => {
          const Icon = task.icon;
          return (
            <button
              key={task.text}
              onClick={() => onToggleTask(i)}
              className="flex w-full items-start gap-3 rounded-2xl border border-white/8 bg-black/20 p-3 text-left text-sm transition-colors hover:border-white/12 hover:bg-white/4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
              aria-pressed={task.done}
            >
              {task.done ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-zinc-600" />
              )}
              <div className="flex flex-1 items-center justify-between gap-2">
                <span
                  className={
                    task.done
                      ? 'text-zinc-500 line-through'
                      : 'text-zinc-300'
                  }
                >
                  {task.text}
                </span>
                <Icon className="h-4 w-4 shrink-0 text-zinc-600" />
              </div>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
