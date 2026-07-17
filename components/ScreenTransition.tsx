'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useRocket } from './RocketContext';

export function ScreenTransition() {
  const { loadingState, setLoadingState } = useRocket();
  const [progress, setProgress] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    if (loadingState === 'launched') {
      // Animate progress from 0 (all white) to 1.2 (all black/transparent)
      // Duration: 5.0s to run simultaneously with the rocket's slow launch phase
      controls.start({
        p: 1.2,
        transition: { duration: 5.0, ease: [0.25, 1, 0.5, 1] }
      } as any).then(() => {
        setLoadingState('revealing');
      });
    }
  }, [loadingState, controls, setLoadingState]);

  // The transition overlay is shown for all stages prior to being fully revealed
  const showOverlay = 
    loadingState === 'loading' || 
    loadingState === 'igniting' || 
    loadingState === 'launched' || 
    loadingState === 'transitioning';

  if (!showOverlay) return null;

  // Calculate radial gradient percentages based on motion value progress
  const radius = progress * 130; // 0 to 130%
  const orangeEdge = radius + 3;
  const yellowEdge = radius + 6;
  const whiteEdge = radius + 10;

  return (
    <motion.div
      animate={controls}
      initial={{ p: 0 } as any}
      onUpdate={(latest) => {
        if (latest.p !== undefined) {
          setProgress(latest.p as number);
        }
      }}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-10"
      style={{
        background: loadingState === 'launched' || loadingState === 'transitioning'
          ? `radial-gradient(circle at 50% 100%, transparent ${radius}%, rgba(255, 69, 0, 0.9) ${radius}%, rgba(255, 69, 0, 0.9) ${orangeEdge}%, rgba(255, 170, 0, 0.7) ${orangeEdge}%, rgba(255, 200, 0, 0.5) ${yellowEdge}%, #ffffff ${whiteEdge}%)`
          : '#ffffff'
      }}
    />
  );
}
