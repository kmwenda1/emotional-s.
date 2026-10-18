import { useEffect, useState, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
  vx: number;
  vy: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

const PARTICLE_COLORS = [
  '#BAE6FD', // light blue
  '#DDD6FE', // lilac
  '#FEF08A', // soft star yellow
  '#FBCFE8', // pink
  '#99F6E4', // aqua
];

export const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    // Only run on desktop/devices with fine pointer
    if (typeof window === 'undefined') return;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('button') !== null ||
          target.closest('a') !== null ||
          window.getComputedStyle(target).cursor === 'pointer';
        setIsPointer(isInteractive);
      }

      // Add trailing sparkles occasionally
      if (Math.random() < 0.6) {
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          size: 2 + Math.random() * 3,
          color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          alpha: 0.8,
          vx: (Math.random() - 0.5) * 0.8,
          vy: 0.5 + Math.random() * 1.2, // soft downward drift like mist
        });
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsClicking(true);

      // Add click water ripple
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 28 + Math.random() * 8,
        alpha: 0.7,
        color: '#7DD3FC',
      });

      // Extra burst of 8 tiny star particles on click
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          size: 3 + Math.random() * 2,
          color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
          alpha: 0.9,
          vx: Math.cos(angle) * (1.5 + Math.random() * 1.5),
          vy: Math.sin(angle) * (1.5 + Math.random() * 1.5),
        });
      }
    };

    const onMouseUp = () => {
      setIsClicking(false);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  // Canvas render loop for trail particles and ripples
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const onResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = r.alpha;
        ctx.stroke();

        r.radius += 1.4;
        r.alpha -= 0.03;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripplesRef.current.splice(i, 1);
        }
      }

      // Render trail particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        p.size = Math.max(0, p.size - 0.04);

        if (p.alpha <= 0 || p.size <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Particle & Ripple Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 select-none"
      />

      {/* Cute Umbrella / Droplet Custom Pointer */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 select-none transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-30%, -20%) scale(${
            isClicking ? 0.85 : isPointer ? 1.25 : 1
          })`,
        }}
      >
        <div className="relative">
          {/* Glowing cursor icon */}
          <div className="w-8 h-8 rounded-full bg-cyan-400/20 blur-md absolute -inset-0.5 animate-pulse" />
          <div className="text-xl drop-shadow-[0_2px_8px_rgba(56,189,248,0.7)] transform -rotate-12 transition-transform">
            {isPointer ? '✨' : '☂️'}
          </div>
        </div>
      </div>
    </>
  );
};
