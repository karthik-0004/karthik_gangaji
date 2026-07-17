'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useRocket } from '../RocketContext';

const highlightText = "Over the last 3 years, I've been evolving from CS student to full-stack AI builder. In that time I've helped myself ship real products — turning messy ideas into something worth deploying... usually.";

export function Hero() {
  const { loadingState, setLoadingState } = useRocket();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const words = highlightText.split(" ");

  // The elements are visible starting from 'revealing' state
  const isVisible = 
    loadingState === 'revealing' || 
    loadingState === 'cursor_returning' || 
    loadingState === 'ready';

  // Trigger the rocket cursor return once the Hero finishes appearing (after 1.6s)
  useEffect(() => {
    if (loadingState === 'revealing') {
      const timer = setTimeout(() => {
        setLoadingState('cursor_returning');
      }, 1600); // Snappier timing matching new animation durations
      return () => clearTimeout(timer);
    }
  }, [loadingState, setLoadingState]);

  return (
    <div className="relative bg-transparent w-full">
      
      {/* Hero Welcome Section */}
      <div className="h-screen w-full flex items-center justify-center bg-transparent px-4 relative overflow-hidden">
        
        <div className="flex flex-col items-center gap-8">
          {/* 1. Welcome Text (fades & slides up at 0.4s) */}
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-8xl font-bold text-white text-center tracking-tight leading-tight select-none"
          >
            Welcome to my Portfolio
          </motion.h2>

          {/* 2. Scroll Down Indicator (fades & slides down at 0.8s) */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="mt-8 flex flex-col items-center gap-3 select-none"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-neutral-400">Scroll Down</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-6 h-6 text-[#cc1111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
        
      </div>

      {/* Scroll-Reveal Text Section (unmodified, works exactly as before) */}
      <section ref={containerRef} className="min-h-[150vh] bg-transparent px-4 py-20">
        <div className="max-w-6xl mx-auto sticky top-24">

          <h1 className="text-[8vw] sm:text-5xl md:text-[70px] lg:text-[100px] xl:text-[120px] font-bold text-white mb-12 leading-tight">
            Gangaji<br/>Karthikeyan
          </h1>

          <div className="flex flex-wrap gap-2">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + (1 / words.length);

              return (
                <Word key={i} progress={scrollYProgress} range={[start, end]}>
                  {word}
                </Word>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function Word({ children, progress, range }: { children: string, progress: any, range: [number, number] }) {
  const color = useTransform(progress, range, ["#333", "#fff"]);

  return (
    <motion.span style={{ color }} className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight select-none">
      {children}
    </motion.span>
  );
}