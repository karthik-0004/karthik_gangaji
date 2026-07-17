/**
 * Animation timing and physics constants for the premium Rocket loading sequence.
 */

export const ROCKET_TIMINGS = {
  STEP_0_START: 200,    // Initializing Workspace
  STEP_1_START: 1000,   // Mounting AI Models
  STEP_2_START: 1800,   // Establishing Workflows
  STEP_3_START: 2600,   // Welcome to Portfolio
  ALL_STEPS_DONE: 3400,
  
  IGNITION_START: 200,  // Rocket begins igniting immediately on load
  LAUNCH_START: 1200,   // Rocket lifts off after 1.0 second of ignition vibration
};

export const PARTICLE_CONFIG = {
  maxParticles: 120,
  spawnRateIdle: 0.15,
  spawnRateIgnition: 0.02,
  spawnRateLaunch: 0.01,
  cursorSpawnRate: 0.05
};

export const STEP_LABELS = [
  'Initializing Workspace',
  'Mounting AI Models',
  'Establishing Workflows',
  'Welcome to Portfolio'
];

export const COLORS = {
  active: '#cc1111',   // Red active indicator
  completed: '#22c55e', // Green completed indicator
  inactive: '#404040'   // Gray inactive indicator
};
