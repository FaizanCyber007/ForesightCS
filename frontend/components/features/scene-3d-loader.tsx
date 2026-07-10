'use client';

import dynamic from 'next/dynamic';

/**
 * Client-only wrapper that lazy-loads Scene3D with ssr:false.
 * Because this file is a Client Component, Next.js allows ssr:false here.
 * The marketing layout (Server Component) imports this wrapper instead.
 */
const Scene3DLazy = dynamic(
  () => import('@/components/features/scene-3d').then((mod) => mod.Scene3D),
  { ssr: false, loading: () => null }
);

export function Scene3DLoader() {
  return <Scene3DLazy />;
}
