'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LoadingState = 
  | 'loading' 
  | 'igniting' 
  | 'launched' 
  | 'transitioning' 
  | 'revealing' 
  | 'cursor_returning' 
  | 'ready';

interface RocketContextType {
  loadingState: LoadingState;
  activeStep: number;
  isHovered: boolean;
  reducedMotion: boolean;
  isKaiOpen: boolean;
  setIsKaiOpen: (open: boolean) => void;
  isGameOpen: boolean;
  setIsGameOpen: (open: boolean) => void;
  setLoadingState: (state: LoadingState) => void;
  setActiveStep: (step: number) => void;
  setIsHovered: (hovered: boolean) => void;
}

const RocketContext = createContext<RocketContextType | undefined>(undefined);

export function RocketProvider({ children }: { children: React.ReactNode }) {
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isKaiOpen, setIsKaiOpen] = useState<boolean>(false);
  const [isGameOpen, setIsGameOpen] = useState<boolean>(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Manage body scroll lock and cursor styles based on loading state
  useEffect(() => {
    // If reduced motion is active, skip cinematic launch and go to ready state directly
    if (reducedMotion && loadingState === 'loading') {
      setLoadingState('ready');
      return;
    }

    const isScrollingDisabled = loadingState !== 'ready';
    if (isScrollingDisabled) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.classList.add('cursor-none');
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [loadingState, reducedMotion]);

  // Dynamically manage standard mouse cursor when assistant/game panels are open
  useEffect(() => {
    if (loadingState === 'ready') {
      if (isKaiOpen || isGameOpen) {
        document.body.classList.remove('cursor-none');
        document.body.style.cursor = 'auto';
      } else {
        document.body.classList.add('cursor-none');
        document.body.style.cursor = 'none';
      }
    }
  }, [isKaiOpen, isGameOpen, loadingState]);

  return (
    <RocketContext.Provider
      value={{
        loadingState,
        activeStep,
        isHovered,
        reducedMotion,
        isKaiOpen,
        setIsKaiOpen,
        isGameOpen,
        setIsGameOpen,
        setLoadingState,
        setActiveStep,
        setIsHovered,
      }}
    >
      {children}
    </RocketContext.Provider>
  );
}

export function useRocket() {
  const context = useContext(RocketContext);
  if (context === undefined) {
    throw new Error('useRocket must be used within a RocketProvider');
  }
  return context;
}
