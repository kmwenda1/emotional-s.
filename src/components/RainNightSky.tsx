import { useEffect, useRef, useState, useCallback } from 'react';
import { CloudRain, Volume2, VolumeX, Moon, Zap } from 'lucide-react';
import type { RainIntensity, ThemePaletteId } from '../types';
import { PALETTES } from '../config/personalization';
import { setRainAudio, playDistantThunder } from '../utils/audio';

interface RainNightSkyProps {
  paletteId: ThemePaletteId;
  rainIntensity: RainIntensity;
  rainSoundEnabled: boolean;
  thunderEnabled: boolean;
  cloudsEnabled: boolean;
  onChangeRain: (intensity: RainIntensity) => void;
  onToggleRainSound: () => void;
  onToggleThunder: () => void;
}

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
}

interface Splash {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export const RainNightSky = ({
  paletteId,
  rainIntensity,
  rainSoundEnabled,
  thunderEnabled,
  cloudsEnabled,
  onChangeRain,
  onToggleRainSound,
  onToggleThunder,
}: RainNightSkyProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const palette = PALETTES[paletteId] || PALETTES.lavender;

  const [thunderFlash, setThunderFlash] = useState(false);

  // Sync ambient rain sound effect
  useEffect(() => {
    if (rainIntensity === 'off') {
      setRainAudio(false);
    } else {
      setRainAudio(rainSoundEnabled, rainIntensity === 'gentle' ? 0.16 : 0.28);
    }

    return () => {
      setRainAudio(false);
    };
  }, [rainIntensity, rainSoundEnabled]);

  // Periodic subtle thunder effect
  useEffect(() => {
    if (!thunderEnabled || rainIntensity === 'off') return;

    const interval = setInterval(() => {
      if (Math.random() < 0.6) {
        setThunderFlash(true);
        playDistantThunder();
        setTimeout(() => setThunderFlash(false), 240);
      }
    }, 28000);

    return () => clearInterval(interval);
  }, [thunderEnabled, rainIntensity]);

  // Canvas Rain Animation
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // If rain is explicitly turned off, clear canvas and exit
    if (rainIntensity === 'off') {
      ctx.clearRect(0, 0, width, height);
      return () => window.removeEventListener('resize', handleResize);
    }

    // Determine drop count based on intensity
    let dropCount = 200;
    let baseSpeed = 14;
    let slant = -1.8;

    if (rainIntensity === 'gentle') {
      dropCount = 130;
      baseSpeed = 10;
      slant = -1.2;
    } else if (rainIntensity === 'steady') {
      dropCount = 240;
      baseSpeed = 15;
      slant = -2.2;
    } else if (rainIntensity === 'storm') {
      dropCount = 420;
      baseSpeed = 22;
      slant = -3.5;
    }

    const drops: Drop[] = [];
    const splashes: Splash[] = [];

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * (width + 100) - 50,
        y: Math.random() * height,
        length: 18 + Math.random() * 22,
        speed: baseSpeed + Math.random() * 8,
        opacity: 0.35 + Math.random() * 0.45,
        width: 1.2 + Math.random() * 1.0,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Rain color - crisp, luminous nocturnal raindrops
      ctx.strokeStyle = palette.rainColor || 'rgba(186, 230, 253, 0.75)';

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        ctx.lineWidth = d.width;
        ctx.globalAlpha = d.opacity;

        ctx.beginPath();
        // Slanted angle representing wind-driven night rain
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + slant, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        d.x += slant;

        // Splash at bottom edge
        if (d.y > height - 12) {
          if (Math.random() < 0.35) {
            splashes.push({
              x: d.x,
              y: height - Math.random() * 12,
              radius: 1,
              maxRadius: 3 + Math.random() * 6,
              opacity: 0.55,
            });
          }
          // Reset drop back to top
          d.y = -25;
          d.x = Math.random() * (width + 100) - 20;
        }
      }

      // Render expanding water ripples on the ground
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        ctx.globalAlpha = s.opacity;
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.radius * 1.6, s.radius * 0.6, 0, 0, Math.PI * 2);
        ctx.stroke();

        s.radius += 0.45;
        s.opacity -= 0.035;

        if (s.opacity <= 0) {
          splashes.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [rainIntensity, palette.rainColor]);

  useEffect(() => {
    const cleanup = setupCanvas();
    return () => {
      cleanup?.();
    };
  }, [setupCanvas]);

  return (
    <>
      {/* 1. Flash overlay for subtle distant lightning */}
      <div
        className={`fixed inset-0 z-30 bg-sky-200/15 pointer-events-none transition-opacity duration-150 ${
          thunderFlash ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 2. Background Night Sky: Clouds, Moon, and Stars (Behind page content at z-0) */}
      {cloudsEnabled && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
          {/* Glowing Crescent Moon */}
          <div className="absolute top-6 right-[10%] flex items-center justify-center opacity-90">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-amber-100/20 blur-xl animate-pulse" />
              <Moon className="w-14 h-14 text-amber-100 drop-shadow-[0_0_16px_rgba(254,243,199,0.85)] rotate-[-15deg]" />
            </div>
          </div>

          {/* Drifting Night Clouds */}
          <div
            className="absolute -top-16 -left-32 w-[650px] h-64 rounded-full blur-3xl opacity-40 animate-float"
            style={{ backgroundColor: palette.cloudTint }}
          />

          <div
            className="absolute top-12 right-10 w-[750px] h-72 rounded-full blur-3xl opacity-35 animate-float-delayed"
            style={{ backgroundColor: palette.cloudTint }}
          />

          <div
            className="absolute top-1/3 -left-20 w-[550px] h-56 rounded-full blur-3xl opacity-25 animate-float"
            style={{ backgroundColor: palette.cloudTint }}
          />

          {/* Tiny Twinkling Night Stars */}
          <div className="absolute top-[12%] left-[18%] w-1.5 h-1.5 rounded-full bg-white opacity-70 animate-ping" />
          <div className="absolute top-[22%] left-[45%] w-1 h-1 rounded-full bg-purple-200 opacity-80 animate-pulse" />
          <div className="absolute top-[15%] right-[28%] w-1.5 h-1.5 rounded-full bg-cyan-100 opacity-80 animate-pulse" />
          <div className="absolute top-[35%] right-[15%] w-1 h-1 rounded-full bg-amber-100 opacity-70 animate-ping" />
          <div className="absolute top-[28%] left-[8%] w-1 h-1 rounded-full bg-indigo-100 opacity-80 animate-pulse" />
        </div>
      )}

      {/* 3. FOREGROUND Rain Drops Canvas at z-20 (Visibly falls across the entire screen and cards without blocking clicks) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-20 pointer-events-none w-full h-full"
      />

      {/* 4. Weather & Rain Sound Floating Control Bar at z-40 */}
      <div className="fixed bottom-5 right-5 z-40 pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-2xl text-xs text-slate-200">
        {/* Rain Intensity Selector */}
        <button
          onClick={() => {
            const next =
              rainIntensity === 'gentle'
                ? 'steady'
                : rainIntensity === 'steady'
                ? 'storm'
                : rainIntensity === 'storm'
                ? 'off'
                : 'gentle';
            onChangeRain(next);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer text-slate-100 font-semibold active:scale-95"
          title="Click to cycle rain intensity (Gentle -> Steady -> Storm -> Off)"
        >
          <CloudRain
            className={`w-4 h-4 ${
              rainIntensity !== 'off' ? 'text-sky-400 animate-bounce' : 'text-slate-500'
            }`}
          />
          <span className="capitalize">
            {rainIntensity === 'off' ? 'Rain: Off' : `${rainIntensity} Rain`}
          </span>
        </button>

        <div className="w-px h-4 bg-slate-700" />

        {/* Ambient Rain Soundscape Toggle */}
        <button
          onClick={onToggleRainSound}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-medium active:scale-95 ${
            rainSoundEnabled
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-xs'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
          title={
            rainSoundEnabled ? 'Mute ambient rain audio' : 'Play cozy ambient rain soundscape'
          }
        >
          {rainSoundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Rain Audio</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Audio Off</span>
            </>
          )}
        </button>

        {/* Thunder flash toggle */}
        <button
          onClick={onToggleThunder}
          className={`p-1.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
            thunderEnabled
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'hover:bg-slate-800 text-slate-500'
          }`}
          title={thunderEnabled ? 'Distant thunder enabled' : 'Distant thunder muted'}
        >
          <Zap className="w-3.5 h-3.5" />
        </button>
      </div>
    </>
  );
};
