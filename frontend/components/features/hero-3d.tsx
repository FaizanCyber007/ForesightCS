'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles, Stars } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Orb() {
  const groupRef = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current || !outerRef.current || !innerRef.current) return;
    const t = clock.elapsedTime;
    
    groupRef.current.rotation.x = t * 0.15 + pointer.y * 0.3;
    groupRef.current.rotation.y = t * 0.2 + pointer.x * 0.4;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, pointer.x * 0.5, 0.1);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, pointer.y * 0.5, 0.1);

    outerRef.current.rotation.y = t * 0.3;
    outerRef.current.rotation.z = t * 0.2;
    innerRef.current.rotation.x = t * -0.5;
    innerRef.current.rotation.y = t * -0.4;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <group ref={groupRef}>
        {/* Outer complex wireframe */}
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[1.6, 2]} />
          <meshStandardMaterial
            color="#34d399"
            wireframe
            transparent
            opacity={0.3}
            emissive="#10b981"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Inner solid glowing core */}
        <mesh ref={innerRef}>
          <octahedronGeometry args={[0.9, 0]} />
          <meshPhysicalMaterial
            color="#8b5cf6"
            emissive="#6d28d9"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.9}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
        
        {/* Subtle connecting ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.9, 0.02, 16, 100]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.4} />
        </mesh>
      </group>
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
