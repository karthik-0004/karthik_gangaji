'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const highlightText = "Over the last 3 years, I've been evolving from CS student to full-stack AI builder. In that time I've helped myself ship real products — turning messy ideas into something worth deploying... usually.";

export function Hero() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isLaunched, setIsLaunched] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const words = highlightText.split(" ");

  useEffect(() => {
    const timings = [300, 950, 1700, 2550];
    
    timings.forEach((t, i) => {
      setTimeout(() => {
        setCurrentStep(i);
      }, t);
    });

    setTimeout(() => {
      setCurrentStep(4);
    }, timings[3] + 500);

    setTimeout(() => {
      setIsLaunched(true);
    }, timings[3] + 900);

    setTimeout(() => {
      setShowProfile(true);
    }, timings[3] + 2000);
  }, []);

  const steps = [
    "Initializing workspace",
    "Mounting AI models",
    "Establishing workflows...",
    "Welcome to portfolio"
  ];

  return (
    <div className="relative bg-black w-full">
      
      {/* Rocket Section */}
      <div className="h-screen w-full flex items-center justify-center bg-black px-4 relative overflow-hidden">
        
        {!showProfile ? (
          <div className="flex items-center gap-10 md:gap-20 font-mono">
            
            {/* Rocket */}
            <div className="flex flex-col items-center w-[100px] md:w-[130px]">
              <motion.div
                animate={isLaunched ? { y: -1200, opacity: 0 } : { y: 0, opacity: 1 }}
                transition={{ duration: 1.3 }}
                className="flex flex-col items-center relative z-10"
              >
                <svg className="w-20 md:w-28 xl:w-32" viewBox="0 0 52 72" fill="none">
                  <path d="M26 4C26 4 10 22 10 42H42C42 22 26 4 26 4Z" fill="#2b2b2b" stroke="#3d3d3d"/>
                  <rect x="17" y="40" width="18" height="16" rx="2" fill="#1e1e1e" stroke="#333"/>
                  <path d="M10 42L3 55L17 48" fill="#2b2b2b" stroke="#3d3d3d"/>
                  <path d="M42 42L49 55L35 48" fill="#2b2b2b" stroke="#3d3d3d"/>
                  <circle cx="26" cy="26" r="7" fill="#e68c3c"/>
                  <circle cx="26" cy="26" r="3.5" fill="#0d0d0d"/>
                </svg>

                {!isLaunched && (
                  <div className="mt-2 flex flex-col items-center">
                    <motion.div 
                      animate={{ height: [40, 70], opacity: [1, 0.5] }}
                      transition={{ duration: 0.35, repeat: Infinity }}
                      className="w-2 md:w-2.5 bg-gradient-to-b from-[#e68c3c] to-transparent rounded-full"
                    />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Steps */}
            <ul className="flex flex-col gap-5 md:gap-8">
              {steps.map((text, i) => {
                const isActive = currentStep === i;
                const isDone = currentStep > i;

                let dotClass = "bg-[#333]";
                let textClass = "text-[#444]";

                if (isActive) {
                  dotClass = "bg-[#e68c3c]";
                  textClass = "text-[#e68c3c]";
                } else if (isDone) {
                  dotClass = "bg-[#4caf76]";
                  textClass = "text-[#4caf76]";
                }

                return (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -25 }}
                    animate={currentStep >= i ? { opacity: 1, x: 0 } : {}}
                    className="flex items-center gap-4"
                  >
                    <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${dotClass}`} />
                    <span className={`text-base sm:text-lg md:text-xl lg:text-2xl ${textClass}`}>
                      {text}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 rounded-full overflow-hidden border-2 border-[#e68c3c] shadow-[0_0_30px_rgba(230,140,60,0.2)]">
              <img src="/new.jpeg" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white text-center tracking-tight mt-6 leading-tight">
              Welcome to my Portfolio
            </h2>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="mt-12 flex flex-col items-center gap-3"
            >
              <span className="text-sm tracking-[0.3em] uppercase text-[#e68c3c]">Scroll Down</span>
              <svg className="w-6 h-6 text-[#e68c3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Text Section */}
      <section ref={containerRef} className="min-h-[150vh] bg-black px-4 py-20">
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
  const color = useTransform(progress, range, ["#555", "#fff"]);

  return (
    <motion.span style={{ color }} className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
      {children}
    </motion.span>
  );
}