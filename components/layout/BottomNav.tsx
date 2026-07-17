'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRocket } from '@/components/RocketContext';

export function BottomNav() {
  const { loadingState } = useRocket();
  const [activeTab, setActiveTab] = useState('home');
  const [mounted, setMounted] = useState(false);

  const isVisible = 
    loadingState === 'revealing' || 
    loadingState === 'cursor_returning' || 
    loadingState === 'ready';

  useEffect(() => {
    setMounted(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (['home', 'work', 'about'].includes(entry.target.id)) {
              setActiveTab(entry.target.id);
            }
          }
        });
      },
      {
        rootMargin: '-30% 0px -30% 0px',
      }
    );

    const sections = ['home', 'work', 'about'].map(id => document.getElementById(id));
    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const tabs = [
    { id: 'home', label: 'Home', href: '#' },
    { id: 'work', label: 'Work', href: '#work' },
    { id: 'about', label: 'About', href: '#about' },
  ];

  const handleTabClick = (tabId: string, href: string) => {
    setActiveTab(tabId);
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(tabId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Fixed bottom navigation dock */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xl border border-white/30 rounded-full px-6 py-3 md:px-8 md:py-4 shadow-2xl">
          {/* Navigation tabs */}
          <div className="flex items-center gap-2 md:gap-6">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab.id, tab.href)}
                className="relative px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors cursor-none"
                whileTap={{ scale: 0.95 }}
              >
                {tab.label}
                <AnimatePresence>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring', duration: 0.3 }}
                      className="absolute inset-0 bg-white/10 rounded-lg -z-10"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

    </>
  );
}
