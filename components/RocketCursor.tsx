'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRocket } from './RocketContext';
import { useRocketCursor } from '../hooks/useRocketCursor';

export function RocketCursor() {
  const { loadingState, isHovered, setIsHovered, isKaiOpen, isGameOpen } = useRocket();
  const { cursorX, cursorY, bankAngle, pitchAngle, isMobile, isVisible } = useRocketCursor();

  // Particle Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track particles for trail
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    life: number;
    maxLife: number;
  }>>([]);

  // Hover detection for interactive elements
  useEffect(() => {
    if (isMobile || loadingState !== 'ready') return;

    const handleMouseOver = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      
      while (target) {
        if (
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('hover-target') ||
          window.getComputedStyle(target).cursor === 'pointer'
        ) {
          setIsHovered(true);
          return;
        }
        target = target.parentElement;
      }
      setIsHovered(false);
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      setIsHovered(false);
    };
  }, [isMobile, loadingState, setIsHovered]);

  // Particle updates loop
  useEffect(() => {
    if (isMobile || loadingState !== 'ready') return;

    let animFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const parts = particlesRef.current;

      // Spawn a new particle from the nozzle (center bottom of the cursor area)
      if (Math.random() < 0.8) {
        parts.push({
          x: 48 + (Math.random() - 0.5) * 6,
          y: 58+ (Math.random() - 0.5) * 3,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 2 + Math.random() * 2, // move down
          size: 2 + Math.random() * 2,
          color: Math.random() > 0.4 ? '#ff5500' : '#ffaa00',
          life: 0,
          maxLife: 15 + Math.random() * 15
        });
      }

      // Update and draw particles
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.life >= p.maxLife) {
          parts.splice(i, 1);
          continue;
        }

        const opacity = 1 - p.life / p.maxLife;
        const currentSize = p.size * opacity;

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity * (isHovered ? 1.0 : 0.7);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = isHovered ? 6 : 3;
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
      animFrameId = requestAnimationFrame(updateParticles);
    };

    updateParticles();
    return () => cancelAnimationFrame(animFrameId);
  }, [isMobile, loadingState, isHovered]);

  // Hide cursor on mobile or if not ready or not visible yet or panels are active
  if (isMobile || loadingState !== 'ready' || !isVisible || isKaiOpen || isGameOpen) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-[90px] h-[90px] pointer-events-none z-[9999] origin-center -translate-x-1/2 -translate-y-1/2"
      style={{
        x: cursorX,
        y: cursorY,
      }}
    >
      <motion.div
        className="w-full h-full flex flex-col items-center justify-center relative"
        animate={{
          scale: isHovered ? 1.15 : 1.0,
        }}
        style={{
          rotateZ: bankAngle,
          rotateX: pitchAngle,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20
        }}
      >
        {/* Canvas for Particle Trail */}
        <canvas
          ref={canvasRef}
          width={90}
          height={90}
          className="absolute inset-0 w-full h-full"
        />

        {/* 2D Selection 3 - NASA-Core Tech Rocket Icon */}
        <svg 
          width="36" 
          height="48" 
          viewBox="0 0 52 72" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
        >
          {/* Main White Body Hull */}
          <rect x="19.5" y="20" width="13" height="32" fill="#fafafa" stroke="#dddddd" strokeWidth="0.8"/>
          
          {/* Black Separator Rings */}
          <rect x="19.5" y="28" width="13" height="2" fill="#222222" />
          <rect x="19.5" y="44" width="13" height="2" fill="#222222" />
          
          {/* Vertical Black Tech Stripe */}
          <rect x="25.2" y="20" width="1.6" height="32" fill="#222222" opacity="0.8"/>
          
          {/* Dual Solar Panels (Indigo blue-black) */}
          <rect x="21" y="32" width="2.5" height="9" rx="0.5" fill="#15283c" stroke="#050e18" strokeWidth="0.5"/>
          <rect x="28.5" y="32" width="2.5" height="9" rx="0.5" fill="#15283c" stroke="#050e18" strokeWidth="0.5"/>
          
          {/* Two-Tone Nose Cone */}
          {/* White Nose Base */}
          <path d="M26 10 C26 10, 19.5 14, 19.5 20 H32.5 C32.5 14, 26 10, 26 10" fill="#fafafa" stroke="#dddddd" strokeWidth="0.8"/>
          {/* Black Nose Cap */}
          <path d="M26 4 C26 4, 21.5 7, 21.5 10 H30.5 C30.5 7, 26 4, 26 4" fill="#222222" stroke="#111111" strokeWidth="0.8"/>

          {/* Matte Black Side Stabilizer Fins */}
          <path d="M19.5 42 L13 46 L13 54 L19.5 52 Z" fill="#222222" stroke="#111111" strokeWidth="0.8"/>
          <path d="M32.5 42 L39 46 L39 54 L32.5 52 Z" fill="#222222" stroke="#111111" strokeWidth="0.8"/>
          
          {/* Matte Black Center Fin */}
          <rect x="25.2" y="44" width="1.6" height="8" fill="#222222" stroke="#111111" strokeWidth="0.5"/>

          {/* Engine Nozzle Cluster */}
          <rect x="20.5" y="52" width="4" height="4" fill="#3a3a3a" stroke="#222222" strokeWidth="0.5"/>
          <rect x="27.5" y="52" width="4" height="4" fill="#3a3a3a" stroke="#222222" strokeWidth="0.5"/>
          <path d="M22 56 L19 62 H33 L30 56 Z" fill="#dd5511" stroke="#aa3f0b" strokeWidth="0.8"/>

          {/* Glowing Visor Window */}
          <circle cx="26" cy="30" r="4.5" fill="#cccccc" stroke="#999999" strokeWidth="0.8"/>
          <circle cx="26" cy="30" r="3.0" fill="#88ccff" stroke="#55aaff" strokeWidth="0.5"/>
          <circle cx="27.0" cy="29.0" r="0.8" fill="#ffffff" opacity="0.6"/>
        </svg>

        {/* Engine Exhaust Flame */}
        <motion.div
          className="absolute bottom-[14px] w-3.5 h-6 origin-top bg-gradient-to-b from-[#ff6600] to-transparent rounded-full z-0"
          animate={{
            scaleY: isHovered ? [1.5, 2.2, 1.5] : [1.0, 1.5, 1.0],
            scaleX: isHovered ? [1.2, 1.4, 1.2] : [1.0, 1.1, 1.0],
            opacity: isHovered ? 1.0 : 0.8
          }}
          transition={{
            duration: 0.15,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </motion.div>
    </motion.div>
  );
}
