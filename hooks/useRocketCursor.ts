'use client';

import { useEffect, useState } from 'react';
import { useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';

export function useRocketCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 350, damping: 28, mass: 0.15 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const xVelocity = useVelocity(mouseX);
  const yVelocity = useVelocity(mouseY);

  // Roll angle (rotation around Z axis) based on horizontal movement, centered at 180 (downwards)
  const bankAngle = useTransform(xVelocity, [-2500, 2500], [180 + 35, 180 - 35]);
  // Pitch angle (rotation around X axis) based on vertical movement
  const pitchAngle = useTransform(yVelocity, [-2500, 2500], [-20, 20]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible, mouseX, mouseY]);

  return {
    cursorX,
    cursorY,
    bankAngle,
    pitchAngle,
    isMobile,
    isVisible
  };
}
