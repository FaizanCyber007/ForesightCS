import { RegisterForm } from '@/components/features/auth-form';
import { PageWrapper } from '@/components/layout/page-wrapper';

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_40%),radial-gradient(circle_at_75%_20%,rgba(52,211,153,0.16),transparent_34%)]" />
      <PageWrapper className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <RegisterForm />
      </PageWrapper>
    </main>
  );
}
