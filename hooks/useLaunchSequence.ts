'use client';

import { useEffect } from 'react';
import { useRocket } from '../components/RocketContext';
import { ROCKET_TIMINGS } from '../lib/rocketAnimation';

export function useLaunchSequence() {
  const { setLoadingState, setActiveStep } = useRocket();

  useEffect(() => {
    // Register the sequential step timings and launching stages once on mount
    const t0 = setTimeout(() => {
      setActiveStep(0);
    }, ROCKET_TIMINGS.STEP_0_START);

    const t1 = setTimeout(() => {
      setActiveStep(1);
    }, ROCKET_TIMINGS.STEP_1_START);

    const t2 = setTimeout(() => {
      setActiveStep(2);
    }, ROCKET_TIMINGS.STEP_2_START);

    const t3 = setTimeout(() => {
      setActiveStep(3);
    }, ROCKET_TIMINGS.STEP_3_START);

    // Mark steps completed
    const tDone = setTimeout(() => {
      setActiveStep(4); // Out of bounds triggers green indicators for all
    }, ROCKET_TIMINGS.ALL_STEPS_DONE);

    // Start ignition sequence
    const tIgnition = setTimeout(() => {
      setLoadingState('igniting');
    }, ROCKET_TIMINGS.IGNITION_START);

    // Launch the rocket vertically
    const tLaunch = setTimeout(() => {
      setLoadingState('launched');
    }, ROCKET_TIMINGS.LAUNCH_START);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tDone);
      clearTimeout(tIgnition);
      clearTimeout(tLaunch);
    };
  }, [setLoadingState, setActiveStep]); // Exclude loadingState to prevent resetting timers on state transition
}
