'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', mouseMove);
    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      transition: {
        type: 'spring' as const,
        stiffness: 150,
        damping: 15,
        mass: 0.1
      }
    }
  };

  const dotVariants = {
    default: {
      x: mousePosition.x - 4,
      y: mousePosition.y - 4,
      transition: {
        type: 'spring' as const,
        stiffness: 1000,
        damping: 40,
        mass: 0.1
      }
    }
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#00E8A2]/50 pointer-events-none z-[100] hidden md:block"
        variants={variants}
        animate="default"
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#00E8A2] pointer-events-none z-[100] hidden md:block"
        variants={dotVariants}
        animate="default"
      />
    </>
  );
}
