import confetti from 'canvas-confetti';

export const triggerPastelConfetti = (originY = 0.6) => {
  if (typeof window === 'undefined') return;

  // Check reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  try {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: originY },
      colors: ['#DDD6FE', '#BAE6FD', '#FBCFE8', '#FEF08A', '#A7F3D0'],
      ticks: 180,
      gravity: 0.8,
      scalar: 0.9,
      disableForReducedMotion: true,
    });
  } catch (err) {
    // Fallback gracefully
  }
};

export const triggerStarBurst = (originX = 0.5, originY = 0.5) => {
  if (typeof window === 'undefined') return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  try {
    confetti({
      particleCount: 25,
      spread: 360,
      startVelocity: 18,
      origin: { x: originX, y: originY },
      colors: ['#FDE047', '#C4B5FD', '#F472B6', '#7DD3FC'],
      shapes: ['circle'],
      scalar: 0.7,
      ticks: 120,
      disableForReducedMotion: true,
    });
  } catch (err) {
    // Fallback gracefully
  }
};
