'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, OrbitControls } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SceneInputs {
  pointer: { x: number; y: number };
  scroll: number;
}

function useSceneInputs() {
  const ref = useRef<SceneInputs>({
    pointer: { x: 0, y: 0 },
    scroll: 0,
  });

  useEffect(() => {
    const inputs = ref.current;

    function onPointerMove(event: PointerEvent) {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      inputs.pointer.x = x;
      inputs.pointer.y = y;
    }

    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      inputs.scroll = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return ref;
}

function PredictiveCore({ inputs }: { inputs: React.RefObject<SceneInputs> }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const shellMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const coreMatRef = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame((state, delta) => {
    const inputsState = inputs.current;
    if (!inputsState) return;
    const { pointer, scroll } = inputsState;

    const group = groupRef.current;
    const core = coreRef.current;
    const shell = shellRef.current;
    const ring = ringRef.current;

    if (!group || !core || !shell || !ring) return;

    const t = state.clock.getElapsedTime();
    const damp = Math.min(delta * 2.5, 0.15);

    // Dynamic tilt based on cursor coordinates
    group.rotation.x += (-pointer.y * 0.4 - group.rotation.x) * damp;
    group.rotation.y += (pointer.x * 0.4 - group.rotation.y) * damp;

    // Scroll drives rotation velocity
    const speedMultiplier = 1 + scroll * 2;
    core.rotation.y = t * 0.15 * speedMultiplier;
    shell.rotation.y = -t * 0.08 * speedMultiplier;
    shell.rotation.x = t * 0.05;
    ring.rotation.z = t * 0.2;

    // Core pulsing glow
    const pulse = 0.6 + Math.sin(t * 1.5) * 0.15 + scroll * 0.3;
    if (coreMatRef.current) {
      coreMatRef.current.emissiveIntensity = pulse;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Glowing physical core representing secure revenue */}
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshPhysicalMaterial
          ref={coreMatRef}
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.8}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Wireframe outer structure representing telemetry signals */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshStandardMaterial
          ref={shellMatRef}
          color="#8b5cf6"
          wireframe
          transparent
          opacity={0.3}
          emissive="#7c3aed"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Orbiting retention ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[1.85, 0.015, 8, 96]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.5} />
      </mesh>

      {/* Outer faint ring */}
      <mesh rotation={[Math.PI / 4, -Math.PI / 4, 0]}>
        <torusGeometry args={[2.2, 0.008, 8, 96]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.3} />
      </mesh>

      <Sparkles
        count={50}
        scale={4}
        size={3.0}
        speed={0.4}
        color="#86efac"
      />
    </group>
  );
}

export function Scene3D() {
  const inputs = useSceneInputs();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] rounded-[32px] overflow-hidden border border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-center">
      {/* Background spotlights for localized depth */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute top-2 left-2 text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
        Foresight Engine · Telemetry Core
      </div>
      
      <Canvas
        className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing"
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 3]} intensity={1.5} />
        <pointLight position={[-4, -4, 2]} intensity={0.8} color="#34d399" />
        <PredictiveCore inputs={inputs} />
        <OrbitControls enableZoom={false} autoRotate={false} />
      </Canvas>

      <div className="absolute bottom-3 right-3 text-[9px] font-mono text-zinc-600 bg-black/40 border border-white/5 px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
        DRAG TO INTERACT
      </div>
    </div>
  );
}
