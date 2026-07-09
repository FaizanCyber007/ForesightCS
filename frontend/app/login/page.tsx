import { LoginForm } from '@/components/features/auth-form';
import { PageWrapper } from '@/components/layout/page-wrapper';

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.14),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.18),transparent_34%)]" />
      <PageWrapper className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <LoginForm />
      </PageWrapper>
    </main>
  );
}
