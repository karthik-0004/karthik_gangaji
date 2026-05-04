'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

export function BottomNav() {
  const [activeTab, setActiveTab] = useState('home');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xl border border-white/30 rounded-full px-6 py-3 md:px-8 md:py-4 shadow-2xl">
          {/* Navigation tabs */}
          <div className="flex items-center gap-2 md:gap-6">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab.id, tab.href)}
                className="relative px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
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

          {/* Spacer */}
          <div className="w-px h-6 bg-white/20 mx-2 md:mx-4" />

          {/* Avatar placeholder */}
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#00E8A2] to-[#00A876] flex items-center justify-center text-white font-bold text-sm md:text-base flex-shrink-0">
            GK
          </div>
        </div>
      </motion.div>

      {/* Search icon - top right corner */}
      <motion.button
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="fixed top-6 md:top-8 right-6 md:right-8 z-40 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5 md:w-6 md:h-6" />
      </motion.button>
    </>
  );
}
