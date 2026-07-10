'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Ambient full-viewport 3D layer that lives behind the marketing pages.
 *
 * Design goals:
 *  - Drift smoothly toward the global cursor position (parallax).
 *  - Morph & accelerate rotation as the user scrolls down the page
 *    ("scrolls along with the cursor throughout the page").
 *  - pointer-events-none so it never intercepts clicks/scrolls.
 *  - Respects prefers-reduced-motion (renders a static, dimmed version).
 *
 * Because the canvas is pointer-events-none, R3F's built-in `pointer` is
 * always 0; we track the real cursor via a window `pointermove` listener
 * and feed normalized coordinates into refs read inside useFrame.
 */

// Shared mutable inputs so the scene's useFrame loop can read them cheaply.
interface SceneInputs {
  pointer: { x: number; y: number }; // -1..1
  scroll: number; // 0..1 progress down the document
  reduceMotion: boolean;
}

function useSceneInputs() {
  const ref = useRef<SceneInputs>({
    pointer: { x: 0, y: 0 },
    scroll: 0,
    reduceMotion: false,
  });

  useEffect(() => {
    const inputs = ref.current;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    inputs.reduceMotion = motionQuery.matches;

    function onMotionChange(event: MediaQueryListEvent) {
      ref.current.reduceMotion = event.matches;
    }

    function onPointerMove(event: PointerEvent) {
      // Normalize to -1..1 across the viewport.
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      inputs.pointer.x = x;
      inputs.pointer.y = y;
    }

    function onScroll() {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      inputs.scroll = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    }

    onScroll();
    motionQuery.addEventListener('change', onMotionChange);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      motionQuery.removeEventListener('change', onMotionChange);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return ref;
}

function PredictiveOrb({ inputs }: { inputs: React.RefObject<SceneInputs> }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const shellMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const coreMatRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // Reusable temp vectors to avoid per-frame allocations.
  const targetPos = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const state = inputs.current;
    if (!state) return;
    const { pointer, scroll, reduceMotion } = state;

    const group = groupRef.current;
    const core = coreRef.current;
    const shell = shellRef.current;
    const ring = ringRef.current;
    if (!group || !core || !shell || !ring) return;

    if (reduceMotion) {
      // Static pose: no rotation drift, gentle baseline offset.
      group.rotation.set(-0.2, 0.4, 0);
      group.position.lerp(targetPos.current.set(0, 0, 0), 0.05);
      return;
    }

    const t = performance.now() * 0.001;
    const damp = Math.min(delta * 2.4, 0.16); // frame-rate independent easing

    // Parallax: the whole group drifts toward the cursor, scaled by scroll.
    const parallaxAmp = 0.7 + scroll * 0.6;
    targetPos.current.set(
      pointer.x * 0.6 * parallaxAmp,
      -pointer.y * 0.45 * parallaxAmp,
      0
    );
    group.position.lerp(targetPos.current, damp);

    // Cursor-driven tilt on top of a slow idle spin.
    const idleX = t * 0.08;
    const idleY = t * 0.12;
    const targetRotX = idleX + pointer.y * 0.5;
    const targetRotY = idleY + pointer.x * 0.6;
    group.rotation.x += (targetRotX - group.rotation.x) * damp;
    group.rotation.y += (targetRotY - group.rotation.y) * damp;

    // Scroll morphs the scene: spins accelerate + distortion grows.
    const scrollSpin = 1 + scroll * 2.4;
    core.rotation.x = t * 0.2 * scrollSpin;
    core.rotation.y = t * -0.16 * scrollSpin;
    shell.rotation.y = t * 0.32 * scrollSpin;
    shell.rotation.z = t * 0.18 * scrollSpin;
    ring.rotation.z = t * 0.1;

    // Pulse emissive intensity with a slow sine + scroll gain.
    const pulse = 0.5 + Math.sin(t * 1.4) * 0.12 + scroll * 0.4;
    if (coreMatRef.current) {
      coreMatRef.current.emissiveIntensity = pulse;
    }
    if (shellMatRef.current) {
      shellMatRef.current.emissiveIntensity = 0.35 + scroll * 0.3;
      shellMatRef.current.opacity = 0.22 + scroll * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer wireframe shell — the "predictive data mesh". */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[1.7, 2]} />
        <meshStandardMaterial
          ref={shellMatRef}
          color="#34d399"
          wireframe
          transparent
          opacity={0.28}
          emissive="#10b981"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Solid glowing core. */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.95, 0]} />
        <meshPhysicalMaterial
          ref={coreMatRef}
          color="#8b5cf6"
          emissive="#6d28d9"
          emissiveIntensity={0.7}
          roughness={0.12}
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Orbiting accent ring. */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.018, 16, 120]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.42} />
      </mesh>

      {/* Second off-axis ring for depth. */}
      <mesh rotation={[Math.PI / 2.6, Math.PI / 5, 0]}>
        <torusGeometry args={[2.35, 0.012, 16, 120]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.28} />
      </mesh>

      <Sparkles
        count={70}
        size={3.5}
        speed={0.3}
        color="#86efac"
        scale={[6, 4, 6]}
      />
    </group>
  );
}

export function Scene3D() {
  const inputs = useSceneInputs();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Soft brand glows behind the canvas. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(16,185,129,0.16),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.14),transparent_42%)]" />
      <Canvas
        className="absolute inset-0"
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[4, 5, 2]} intensity={2.2} color="#ffffff" />
        <pointLight position={[-4, -2, 3]} intensity={1.4} color="#34d399" />
        <pointLight position={[4, -3, -2]} intensity={1.0} color="#a78bfa" />
        <PredictiveOrb inputs={inputs} />
      </Canvas>
      {/* Edge vignette so content stays legible near the borders. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(10,10,10,0.6)_100%)]" />
    </div>
  );
}
