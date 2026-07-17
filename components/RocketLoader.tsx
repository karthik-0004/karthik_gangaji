'use client';

import React from 'react';
import { RocketProvider, useRocket } from './RocketContext';
import { LaunchSequence } from './LaunchSequence';
import { ScreenTransition } from './ScreenTransition';
import { RocketCursor } from './RocketCursor';

function LoaderContainer({ children }: { children: React.ReactNode }) {
  const { loadingState } = useRocket();

  // The portfolio content is visible during revealing, returning, and ready states
  const isPortfolioVisible = 
    loadingState === 'revealing' || 
    loadingState === 'cursor_returning' || 
    loadingState === 'ready';

  // Stars should fade in when launch starts
  const showStars = loadingState !== 'loading' && loadingState !== 'igniting';

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* Starry Sky Background */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-[1500ms] ease-in-out z-0"
        style={{
          backgroundImage: "url('/new_bg.jpg')",
          backgroundAttachment: 'fixed',
          opacity: showStars ? 0.35 : 0
        }}
      />

      {/* 3D Cinematic Launch Sequence overlay */}
      <LaunchSequence />

      {/* Screen Transition burn-away overlay */}
      <ScreenTransition />

      {/* Custom Rocket Cursor (desktop only, handled internally) */}
      <RocketCursor />

      {/* Portfolio Content Wrapper */}
      <div 
        className={`w-full relative z-10 transition-opacity duration-1000 ease-out ${
          isPortfolioVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export function RocketLoader({ children }: { children: React.ReactNode }) {
  return (
    <RocketProvider>
      <LoaderContainer>{children}</LoaderContainer>
    </RocketProvider>
  );
}
