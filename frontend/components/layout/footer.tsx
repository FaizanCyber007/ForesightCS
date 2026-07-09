import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8 text-sm text-zinc-500">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          ForesightCS turns customer signal into retention action before revenue
          slips.
        </p>
        <div className="flex items-center gap-2 text-zinc-400">
          <Sparkles className="h-4 w-4 text-emerald-300" />
          <span>Built for modern revenue and customer success teams</span>
        </div>
      </div>
    </footer>
  );
}
