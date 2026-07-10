import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Scene3DLoader } from '@/components/features/scene-3d-loader';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Fixed ambient 3D layer sits behind all marketing content. */}
      <Scene3DLoader />
      <Navbar />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </>
  );
}
