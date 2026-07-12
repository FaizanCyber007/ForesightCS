import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Dashboard3DBackground } from '@/components/features/dashboard-3d-background';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Dashboard3DBackground />
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
