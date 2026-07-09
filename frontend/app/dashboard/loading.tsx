import { GlassCard } from '@/components/ui/glass-card';
import { PageWrapper } from '@/components/layout/page-wrapper';

export default function DashboardLoading() {
  return (
    <PageWrapper className="space-y-6 py-8">
      <div className="space-y-3">
        <div className="h-4 w-44 rounded-full bg-white/10" />
        <div className="h-10 w-96 rounded-full bg-white/10" />
        <div className="h-4 w-[42rem] rounded-full bg-white/10" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <GlassCard key={index} className="animate-pulse space-y-3">
            <div className="h-4 w-28 rounded-full bg-white/10" />
            <div className="h-9 w-32 rounded-full bg-white/10" />
            <div className="h-4 w-full rounded-full bg-white/10" />
          </GlassCard>
        ))}
      </div>
      <GlassCard className="animate-pulse space-y-4">
        <div className="h-4 w-40 rounded-full bg-white/10" />
        <div className="grid gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-56 rounded-[28px] bg-white/10" />
          ))}
        </div>
      </GlassCard>
    </PageWrapper>
  );
}
