'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Force GLTF loader preloading
useGLTF.preload('/rocket.gltf');

interface RocketModelProps {
  loadingState: string;
  setLoadingState: (state: any) => void;
  onReadyToCursor: () => void;
}

function RocketModel({ 
  loadingState,
  setLoadingState,
  onReadyToCursor 
}: RocketModelProps) {
  const { scene } = useGLTF('/rocket.gltf');
  const rocketRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const engineLightRef = useRef<THREE.PointLight>(null);
  
  const { camera, viewport } = useThree();

  // Clone the scene for this component instance to avoid side-effects
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Particle pool variables
  const maxParticles = 120;
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < maxParticles; i++) {
      arr.push({
        active: false,
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        scale: 0.1,
        opacity: 1.0,
        age: 0,
        maxAge: 1.2
      });
    }
    return arr;
  }, []);

  // Animation values stored in refs to avoid React re-renders
  const stateRef = useRef({
    velocity: 0,
    acceleration: 0.8,
    shakeIntensity: 0,
    originalCamPos: new THREE.Vector3(0, 0, 8),
    launchStartTime: 0,
    returnProgress: 0,
    time: 0,
    lastSpawn: 0
  });

  // Find nozzle mesh inside the cloned scene to animate its color/emissive
  const nozzleMesh = useMemo(() => {
    let mesh: THREE.Mesh | null = null;
    clonedScene.traverse((child) => {
      if (child.name === 'Nozzle' && child instanceof THREE.Mesh) {
        mesh = child;
      }
    });
    return mesh;
  }, [clonedScene]);

  // Handle transitions
  useEffect(() => {
    stateRef.current.originalCamPos.copy(camera.position);
  }, [camera]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    stateRef.current.time = time;
    const tRef = stateRef.current;
    
    if (!rocketRef.current) return;
    const rocket = rocketRef.current;

    // Reset camera position from shake first
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 8;

    // Responsive position and scale calculations
    const isDesktop = viewport.width > 6;
    const baseScale = isDesktop ? 0.9 : 0.7;
    const targetX = isDesktop ? -1.8 : 0;
    const targetYOffset = isDesktop ? 0 : 0.8;

    // --- 1. IDLE STATE ---
    if (loadingState === 'loading') {
      rocket.scale.set(baseScale, baseScale, baseScale);
      
      // Floating motion around base position
      rocket.position.y = targetYOffset + Math.sin(time * 2.5) * 0.15;
      rocket.position.x = targetX + Math.cos(time * 1.5) * 0.05;
      rocket.position.z = 0;
      rocket.rotation.y = time * 0.2;
      rocket.rotation.z = Math.sin(time * 2) * 0.02;

      // Small vibration
      rocket.position.x += (Math.random() - 0.5) * 0.005;
      
      // Idle flame scale (barely visible)
      if (flameRef.current) {
        flameRef.current.scale.set(0.6 + Math.sin(time * 30) * 0.1, 0.4 + Math.cos(time * 20) * 0.1, 0.6);
        const factor = 0.4 + Math.sin(time * 30) * 0.1;
        flameRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const mat = child.material as THREE.MeshBasicMaterial;
            if (child === flameRef.current) mat.opacity = factor * 0.35;
            else if (child.name === 'middle-flame') mat.opacity = factor * 0.6;
            else mat.opacity = factor * 0.8;
          }
        });
      }

      // Small engine light
      if (engineLightRef.current) {
        engineLightRef.current.intensity = 1.5 + Math.sin(time * 20) * 0.5;
      }

      // Emit minimal smoke
      if (time - tRef.lastSpawn > 0.15) {
        spawnParticle(rocket.position.clone().add(new THREE.Vector3(0, -1.6 * baseScale, 0)), new THREE.Vector3((Math.random() - 0.5) * 0.2, -0.5, (Math.random() - 0.5) * 0.2), 0.8);
        tRef.lastSpawn = time;
      }
    }

    // --- 2. IGNITION STATE ---
    else if (loadingState === 'igniting') {
      rocket.scale.set(baseScale, baseScale, baseScale);

      // Intense vibration around base position
      rocket.position.x = targetX + (Math.random() - 0.5) * 0.03;
      rocket.position.y = targetYOffset + (Math.random() - 0.5) * 0.03;
      rocket.position.z = (Math.random() - 0.5) * 0.02;
      rocket.rotation.y = time * 0.5;

      // Camera Shake
      camera.position.x += (Math.random() - 0.5) * 0.04;
      camera.position.y += (Math.random() - 0.5) * 0.04;

      // Flame grows
      if (flameRef.current) {
        flameRef.current.scale.set(1.2 + Math.sin(time * 50) * 0.2, 0.9 + Math.cos(time * 40) * 0.25, 1.2);
        const factor = 0.9 + Math.sin(time * 50) * 0.1;
        flameRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const mat = child.material as THREE.MeshBasicMaterial;
            if (child === flameRef.current) mat.opacity = factor * 0.35;
            else if (child.name === 'middle-flame') mat.opacity = factor * 0.6;
            else mat.opacity = factor * 0.8;
          }
        });
      }

      // Brighten engine glow & nozzle material
      if (engineLightRef.current) {
        engineLightRef.current.intensity = 12.0 + Math.sin(time * 40) * 2.0;
      }
      if (nozzleMesh && (nozzleMesh as any).material) {
        const mat = (nozzleMesh as any).material as THREE.MeshStandardMaterial;
        mat.emissive.setHex(0xff3300);
        mat.emissiveIntensity = 4.0;
      }

      // Spawn lots of ignition smoke particles
      if (time - tRef.lastSpawn > 0.02) {
        spawnParticle(
          rocket.position.clone().add(new THREE.Vector3(0, -1.6 * baseScale, 0)),
          new THREE.Vector3((Math.random() - 0.5) * 1.5, -2.5 - Math.random() * 2.0, (Math.random() - 0.5) * 1.5),
          1.0
        );
        tRef.lastSpawn = time;
      }
    }

    // --- 3. LAUNCH STATE & TRANSITION STATE (CLIMBS SLOWLY FOR ~5s THEN ZOOMS OUT) ---
    else if (loadingState === 'launched' || loadingState === 'transitioning') {
      rocket.scale.set(baseScale, baseScale, baseScale);

      // Track launch time elapsed
      if (tRef.launchStartTime === 0) {
        tRef.launchStartTime = time;
      }
      const elapsedLaunch = time - tRef.launchStartTime;

      if (elapsedLaunch < 5.0) {
        // Slow vertical ascent from 0 to 2.8 units over 5 seconds
        const progress = elapsedLaunch / 5.0;
        const lift = Math.pow(progress, 1.4) * 2.5; // gradual parabolic acceleration
        
        rocket.position.y = targetYOffset + lift;
        rocket.position.x = targetX + (Math.random() - 0.5) * 0.03; // intense launch vibration
        rocket.rotation.y = time * 0.6;

        // Steady camera shake
        camera.position.x += (Math.random() - 0.5) * 0.06;
        camera.position.y += (Math.random() - 0.5) * 0.06;

        // Orange flame pulses
        if (flameRef.current) {
          flameRef.current.scale.set(1.4, 1.3 + Math.random() * 0.3, 1.4);
          flameRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const mat = child.material as THREE.MeshBasicMaterial;
              if (child === flameRef.current) mat.opacity = 0.35;
              else if (child.name === 'middle-flame') mat.opacity = 0.6;
              else mat.opacity = 0.8;
            }
          });
        }

        // Heavy particle trail
        if (time - tRef.lastSpawn > 0.015) {
          spawnParticle(
            rocket.position.clone().add(new THREE.Vector3(0, -1.6 * baseScale, 0)),
            new THREE.Vector3((Math.random() - 0.5) * 1.0, -3.0 - Math.random() * 2.0, (Math.random() - 0.5) * 1.0),
            1.4
          );
          tRef.lastSpawn = time;
        }
      } else {
        // Sudden escape acceleration zoom at the end
        tRef.velocity += 20 * delta;
        rocket.position.y += tRef.velocity * delta;
        rocket.position.x = targetX + (Math.random() - 0.5) * 0.05;

        // Massive camera shake
        camera.position.x += (Math.random() - 0.5) * 0.12;
        camera.position.y += (Math.random() - 0.5) * 0.12;

        // Motion stretched flame
        if (flameRef.current) {
          flameRef.current.scale.set(1.5, 1.8 + Math.random() * 0.4, 1.5);
          flameRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const mat = child.material as THREE.MeshBasicMaterial;
              if (child === flameRef.current) mat.opacity = 0.35;
              else if (child.name === 'middle-flame') mat.opacity = 0.6;
              else mat.opacity = 0.8;
            }
          });
        }

        // Huge speed particle trail
        if (time - tRef.lastSpawn > 0.008) {
          spawnParticle(
            rocket.position.clone().add(new THREE.Vector3(0, -1.6 * baseScale, 0)),
            new THREE.Vector3((Math.random() - 0.5) * 1.2, -6.0 - tRef.velocity * 0.4, (Math.random() - 0.5) * 1.2),
            1.0
          );
          tRef.lastSpawn = time;
        }
      }

      if (engineLightRef.current) {
        engineLightRef.current.intensity = 20.0;
      }

      // If rocket goes out of viewport top, move to transitioning state
      if (rocket.position.y > viewport.height + 4) {
        setLoadingState('transitioning');
      }
    }

    // --- 4. RETURN TRANSITION STATE (AS CURSOR) ---
    else if (loadingState === 'cursor_returning') {
      if (tRef.returnProgress === 0) {
        // Position rocket high in top-right, tilted downwards diagonally
        rocket.position.set(viewport.width / 2 + 1, viewport.height / 2 + 1, 0);
        rocket.scale.set(1, 1, 1);
        tRef.returnProgress = 0.01;
      }

      tRef.returnProgress += delta * 1.5; // reaches mouse position in ~0.7s
      const progress = Math.min(tRef.returnProgress, 1);

      // Mouse project onto 3D plane
      const mouseX = (state.pointer.x * viewport.width) / 2;
      const mouseY = (state.pointer.y * viewport.height) / 2;

      // Starting point (top right)
      const startX = viewport.width / 2 + 1;
      const startY = viewport.height / 2 + 1;

      // Interpolate position
      const curX = THREE.MathUtils.lerp(startX, mouseX, progress);
      const curY = THREE.MathUtils.lerp(startY, mouseY, progress);
      rocket.position.set(curX, curY, 0);

      // Interpolate scale down to cursor scale (approx. 0.08)
      const curScale = THREE.MathUtils.lerp(1.0, 0.08, progress);
      rocket.scale.set(curScale, curScale, curScale);

      // Rotate rocket to point down-left towards mouse, then gradually level to pointing up
      const angle = Math.atan2(mouseY - startY, mouseX - startX);
      rocket.rotation.z = THREE.MathUtils.lerp(angle - Math.PI / 2, 0, progress);
      rocket.rotation.y = progress * Math.PI * 2; // spin a bit for cinematic effect

      // Minimal flame during cursor return
      if (flameRef.current) {
        flameRef.current.scale.set(0.8, 0.4, 0.8);
        const factor = 0.7;
        flameRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const mat = child.material as THREE.MeshBasicMaterial;
            if (child === flameRef.current) mat.opacity = factor * 0.35;
            else if (child.name === 'middle-flame') mat.opacity = factor * 0.6;
            else mat.opacity = factor * 0.8;
          }
        });
      }

      // Small flame particles
      if (time - tRef.lastSpawn > 0.05) {
        spawnParticle(
          rocket.position.clone().add(new THREE.Vector3(0, -1.6 * curScale, 0)),
          new THREE.Vector3((Math.random() - 0.5) * 0.1, -1.0, (Math.random() - 0.5) * 0.1),
          0.5
        );
        tRef.lastSpawn = time;
      }

      if (progress >= 1.0) {
        onReadyToCursor();
      }
    }

    // Hide rocket if in other states (e.g. revealing or ready)
    else {
      rocket.position.y = -100; // hide far away
      if (engineLightRef.current) engineLightRef.current.intensity = 0;
      if (flameRef.current) {
        flameRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            (child.material as THREE.MeshBasicMaterial).opacity = 0.0;
          }
        });
      }
    }

    // --- UPDATE INSTANCED PARTICLES ---
    updateParticles(delta);
  });

  // Spawn smoke/exhaust particle helper
  const spawnParticle = (pos: THREE.Vector3, vel: THREE.Vector3, maxAge: number) => {
    // Find inactive particle
    const p = particles.find((item) => !item.active);
    if (!p) return; // none available

    p.active = true;
    p.position.copy(pos);
    p.velocity.copy(vel);
    p.scale = loadingState === 'cursor_returning' ? 0.05 + Math.random() * 0.05 : 0.2 + Math.random() * 0.3;
    p.opacity = 1.0;
    p.age = 0;
    p.maxAge = maxAge;
  };

  // Update smoke/exhaust particles
  const updateParticles = (delta: number) => {
    if (!particlesRef.current) return;
    const mesh = particlesRef.current;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    for (let i = 0; i < maxParticles; i++) {
      const p = particles[i];
      if (p.active) {
        // Move particle
        p.position.addScaledVector(p.velocity, delta);
        p.age += delta;

        // Smoke expands and fades
        const lifePercent = p.age / p.maxAge;
        p.opacity = 1.0 - lifePercent;
        
        // Scale grows as it expands, except if it is the cursor
        const currentScale = loadingState === 'cursor_returning' 
          ? p.scale * (1.0 - lifePercent * 0.5) 
          : p.scale * (1.0 + lifePercent * 2.0);

        if (p.age >= p.maxAge) {
          p.active = false;
          // Set scale to 0 so it disappears
          dummy.position.set(0, -999, 0);
          dummy.scale.set(0, 0, 0);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        } else {
          dummy.position.copy(p.position);
          dummy.scale.set(currentScale, currentScale, currentScale);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);

          // Animate particle color: hot orange/yellow at birth, fading to dark grey/white
          if (lifePercent < 0.2) {
            color.setHSL(0.08, 0.9, 0.6); // Hot Orange
          } else if (lifePercent < 0.5) {
            color.setHSL(0.04, 0.4, 0.4); // Dark Amber
          } else {
            // Grey smoke
            const grey = 0.3 + (1.0 - lifePercent) * 0.3;
            color.setRGB(grey, grey, grey);
          }
          mesh.setColorAt(i, color);
        }
      } else {
        dummy.position.set(0, -999, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  return (
    <group>
      {/* 3D Rocket Group */}
      <group ref={rocketRef}>
        <primitive object={clonedScene} />

        {/* Dynamic Volumetric Exhaust Flame Group */}
        <mesh ref={flameRef} position={[0, -1.6, 0]} rotation={[0, 0, 0]}>
          {/* 1. Outer Flame Cone (Soft Orange-Red) */}
          <cylinderGeometry args={[0.38, 0.02, 1.3, 16, 1, true]} onUpdate={(self) => {
            if (self.userData.translated) return;
            self.translate(0, -0.65, 0);
            self.userData.translated = true;
          }} />
          <meshBasicMaterial 
            color={0xff3700} 
            transparent 
            opacity={0.0} 
            side={THREE.DoubleSide} 
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
          
          {/* 2. Middle Flame Core (Bright Yellow-Orange) */}
          <mesh name="middle-flame" position={[0, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.01, 1.0, 16, 1, true]} onUpdate={(self) => {
              if (self.userData.translated) return;
              self.translate(0, -0.5, 0);
              self.userData.translated = true;
            }} />
            <meshBasicMaterial 
              color={0xffaa00} 
              transparent 
              opacity={0.0} 
              side={THREE.DoubleSide} 
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* 3. Inner Hot Core (White-Yellow) */}
          <mesh name="inner-flame" position={[0, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.005, 0.7, 16, 1, true]} onUpdate={(self) => {
              if (self.userData.translated) return;
              self.translate(0, -0.35, 0);
              self.userData.translated = true;
            }} />
            <meshBasicMaterial 
              color={0xfffaee} 
              transparent 
              opacity={0.0} 
              side={THREE.DoubleSide} 
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </mesh>
        
        {/* Point light for engine glow */}
        <pointLight
          ref={engineLightRef}
          position={[0, -0.6, 0]}
          color={0xff5500}
          intensity={0}
          distance={10}
          decay={1.5}
        />
      </group>

      {/* Instanced Mesh for Smoke Particles */}
      <instancedMesh ref={particlesRef} args={[null as any, null as any, maxParticles]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
      </instancedMesh>
    </group>
  );
}


interface RocketSceneProps {
  loadingState: string;
  setLoadingState: (state: any) => void;
  onReadyToCursor: () => void;
}

export function RocketScene({ 
  loadingState,
  setLoadingState,
  onReadyToCursor 
}: RocketSceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        shadows
      >
        <ambientLight intensity={1.5} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={3.0} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-5, 5, -5]} intensity={1.0} />
        
        {/* Futuristic star sparkles in background */}
        <Sparkles count={40} scale={15} size={2} speed={0.4} color="#cc1111" />
        <Sparkles count={40} scale={15} size={1} speed={0.2} color="#ffffff" />
        
        <RocketModel 
          loadingState={loadingState}
          setLoadingState={setLoadingState}
          onReadyToCursor={onReadyToCursor}
        />
      </Canvas>
    </div>
  );
}
