'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Sidebar } from '@/components/layout/sidebar';
import { DashboardHeader } from '@/components/layout/dashboard-header';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white lg:grid lg:grid-cols-[280px_1fr]">
      {/* Desktop sidebar — sticky full height */}
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen overflow-y-auto border-r border-white/10">
          <Sidebar />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              key="mobile-sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-80 lg:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Right column: header + main */}
      <div className="flex min-w-0 flex-col">
        <div className="sticky top-0 z-40 flex items-center gap-0 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
          {/* Mobile burger — only visible on small screens */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-16 w-14 shrink-0 items-center justify-center text-zinc-400 transition-colors hover:text-white lg:hidden"
            aria-label="Open sidebar navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          {/* Header fills remaining space */}
          <div className="flex-1">
            <DashboardHeader />
          </div>
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
