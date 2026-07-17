'use client';

import { motion } from 'framer-motion';
import { useRocket } from './RocketContext';

const steps = [
  'Initializing Workspace',
  'Mounting AI Models',
  'Establishing Workflows',
  'Welcome to Portfolio'
];

export function LoadingSteps() {
  const { activeStep, loadingState } = useRocket();

  return (
    <ul className="flex flex-col gap-6 md:gap-8 font-display select-none">
      {steps.map((text, i) => {
        // A step is active if activeStep matches i and we are still loading/igniting
        const isActive = activeStep === i && (loadingState === 'loading' || loadingState === 'igniting');
        const isCompleted = activeStep > i || (activeStep === 3 && i === 3 && loadingState !== 'loading' && loadingState !== 'igniting');
        const isInactive = !isActive && !isCompleted;

        let dotColor = 'bg-neutral-300 shadow-none border border-neutral-400';
        let textColor = 'text-neutral-400 font-medium';

        if (isActive) {
          dotColor = 'bg-[#cc1111] shadow-[0_0_15px_rgba(204,17,17,0.8)] border border-[#cc1111]';
          textColor = 'text-[#cc1111] font-bold';
        } else if (isCompleted) {
          dotColor = 'bg-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.6)] border border-[#22c55e]';
          textColor = 'text-[#22c55e] font-semibold';
        }

        return (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="flex items-center gap-5 md:gap-6"
          >
            <motion.div
              layout
              className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full flex-shrink-0 transition-all duration-500 ease-in-out ${dotColor}`}
            />
            <motion.span
              layout
              className={`text-[11px] sm:text-xs md:text-sm tracking-[0.16em] uppercase transition-all duration-500 ease-in-out ${textColor}`}
            >
              {text}
            </motion.span>
          </motion.li>
        );
      })}
    </ul>
  );
}
