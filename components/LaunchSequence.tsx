'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRocket } from './RocketContext';
import { useLaunchSequence } from '../hooks/useLaunchSequence';
import { RocketScene } from './RocketScene';
import { LoadingSteps } from './LoadingSteps';

export function LaunchSequence() {
  const { loadingState, setLoadingState } = useRocket();
  useLaunchSequence();

  // The 3D canvas and return-to-cursor code must stay mounted until 'ready'
  const isTransitionFinished = loadingState === 'ready';

  if (isTransitionFinished) return null;

  // Show the checklist beside the rocket during all loading, ignition, and launch phases
  const showChecklist = 
    loadingState === 'loading' || 
    loadingState === 'igniting' || 
    loadingState === 'launched' ||
    loadingState === 'transitioning';

  const handleReadyToCursor = () => {
    setLoadingState('ready');
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-transparent z-20 overflow-hidden flex flex-col md:flex-row items-center justify-center pointer-events-none">
      {/* 3D Rocket Scene Container */}
      <div className="absolute inset-0 w-full h-full z-10">
        <RocketScene 
          loadingState={loadingState}
          setLoadingState={setLoadingState}
          onReadyToCursor={handleReadyToCursor} 
        />
      </div>

      {/* Foreground steps overlay */}
      <div className="relative z-20 flex flex-col md:flex-row items-center justify-center w-full h-full px-6 md:px-12 pointer-events-none select-none">
        
        {/* Spacer to push steps to the right on desktop, or down on mobile */}
        <div className="w-full md:w-1/2 h-[35vh] md:h-full flex-shrink-0" />

        {/* Steps container */}
        <div className="w-full md:w-1/2 flex items-start justify-center md:justify-start pl-0 md:pl-16">
          <AnimatePresence>
            {showChecklist && (
              <motion.div
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ 
                  opacity: 0, 
                  x: -30, 
                  filter: 'blur(8px)',
                  transition: { duration: 0.5, ease: 'easeInOut' } 
                }}
              >
                <LoadingSteps />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
