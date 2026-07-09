'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles, Stars } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Orb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = clock.elapsedTime * 0.25 + pointer.y * 0.6;
    meshRef.current.rotation.y = clock.elapsedTime * 0.35 + pointer.x * 0.8;
    meshRef.current.position.x = pointer.x * 0.3;
    meshRef.current.position.y = pointer.y * 0.2;
  });

  return (
    <Float speed={1.5} rotationIntensity={1.1} floatIntensity={1.2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.35, 5]} />
        <meshPhysicalMaterial
          color="#a7f3d0"
          emissive="#3b82f6"
          emissiveIntensity={0.4}
          roughness={0.18}
          metalness={0.85}
          transmission={0.4}
          thickness={0.8}
        />
      </mesh>
    </Float>
  );
}

export function Hero3D() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-[36px] border border-white/10 bg-black/40 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.2),transparent_45%)]" />
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[4, 5, 2]}
          intensity={2.4}
          color="#ffffff"
        />
        <pointLight position={[-4, -2, 3]} intensity={1.5} color="#34d399" />
        <Stars
          radius={12}
          depth={30}
          count={1000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <Sparkles
          count={60}
          size={3}
          speed={0.35}
          color="#86efac"
          scale={[5, 3, 5]}
        />
        <Orb />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.7}
        />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent" />
    </div>
  );
}
