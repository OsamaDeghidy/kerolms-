"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, MeshDistortMaterial, Grid } from "@react-three/drei";
import * as THREE from "three";

function Candlestick({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += 0.005 * speed;
    mesh.current.rotation.y += 0.005 * speed;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5} position={position}>
      <mesh ref={mesh}>
        <boxGeometry args={[0.4, 1.2, 0.4]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.5} 
          transparent 
          opacity={0.6} 
        />
      </mesh>
      {/* Wick */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.05, 2, 0.05]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} transparent opacity={0.3} />
      </mesh>
    </Float>
  );
}

function Scene() {
  const sticks = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 5 - 2;
      const isUp = Math.random() > 0.5;
      temp.push({
        position: [x, y, z] as [number, number, number],
        color: isUp ? "#22c55e" : "#ef4444",
        speed: Math.random() + 0.5
      });
    }
    return temp;
  }, []);

  return (
    <>
      <color attach="background" args={["#0a0a0a"]} />
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ec4899" />
      <pointLight position={[-10, -10, 10]} intensity={1.5} color="#06b6d4" />
      
      <group>
        {sticks.map((stick, i) => (
          <Candlestick key={i} {...stick} />
        ))}
      </group>

      <Grid
        infiniteGrid
        fadeDistance={30}
        fadeStrength={5}
        sectionSize={2}
        sectionThickness={1.5}
        sectionColor="#ffffff"
        cellSize={1}
        cellThickness={1}
        cellColor="#333333"
        position={[0, -5, 0]}
      />
    </>
  );
}

export default function Auth3DScene() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none opacity-40">
      <Canvas dpr={[1, 2]}>
        <Scene />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
    </div>
  );
}
