import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, RotateCw, XCircle } from 'lucide-react';
import type { WheelActivity } from '../types';
import { WHEEL_ACTIVITIES_DATA } from '../data/wheelActivities';
import { DynamicIcon } from './DynamicIcon';
import { playSound } from '../utils/audio';
import { triggerPastelConfetti } from '../utils/confetti';

interface SpinWheelSectionProps {
  soundEnabled: boolean;
}

export const SpinWheelSection: React.FC<SpinWheelSectionProps> = ({ soundEnabled }) => {
  const [activities] = useState<WheelActivity[]>(WHEEL_ACTIVITIES_DATA);
  const [selectedActivity, setSelectedActivity] = useState<WheelActivity | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);
  const [showResultCard, setShowResultCard] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  const numSegments = activities.length;
  const segmentAngle = 360 / numSegments; // 45 degrees

  // Draw the wheel onto canvas
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 15;

    ctx.clearRect(0, 0, width, height);

    // Save context for entire wheel rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    for (let i = 0; i < numSegments; i++) {
      const act = activities[i];
      const startAngle = (i * segmentAngle * Math.PI) / 180;
      const endAngle = ((i + 1) * segmentAngle * Math.PI) / 180;

      // Slice background
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = act.color;
      ctx.fill();

      // Border line
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Draw text label on slice
      ctx.save();
      ctx.rotate(startAngle + (segmentAngle * Math.PI) / 360);
      ctx.textAlign = 'right';
      ctx.fillStyle = act.textColor;
      ctx.font = '600 13px Quicksand, sans-serif';

      // Truncate or wrap title for canvas slice
      const shortTitle =
        act.title.length > 20 ? act.title.substring(0, 18) + '...' : act.title;
      ctx.fillText(shortTitle, radius - 24, 4);

      // Cute tiny dot marker
      ctx.beginPath();
      ctx.arc(radius - 10, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = act.textColor;
      ctx.fill();

      ctx.restore();
    }

    // Outer wheel border ring
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Center hub
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,0,0.12)';
    ctx.shadowBlur = 10;
    ctx.fill();

    // Inner center pin
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#8B5CF6'; // purple center
    ctx.fill();

    ctx.restore();
  }, [activities, numSegments, rotation, segmentAngle]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const handleSpin = () => {
    if (isSpinning) return;

    // Check reduced motion
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Filter available activities (can dismiss ones they don't want)
    const availablePool = activities.filter((a) => !dismissedIds.includes(a.id));
    const targetActivity =
      availablePool.length > 0
        ? availablePool[Math.floor(Math.random() * availablePool.length)]
        : activities[Math.floor(Math.random() * activities.length)];

    const targetIndex = activities.findIndex((a) => a.id === targetActivity.id);

    setIsSpinning(true);
    setShowResultCard(false);

    // Mathematics of top needle pointer:
    // Needle is at the TOP (12 o'clock, which is -90° or 270°).
    // Segment i occupies [i * 45°, (i + 1) * 45°].
    // Segment midpoint is i * 45° + 22.5°.
    // When wheel rotates by R, the segment midpoint is at (i * 45° + 22.5° + R) mod 360.
    // For this midpoint to match top needle (-90° = 270°):
    // (i * 45° + 22.5° + R) ≡ 270° (mod 360)
    // R ≡ 270° - (i * 45° + 22.5°) (mod 360)
    const sliceMid = targetIndex * segmentAngle + segmentAngle / 2;
    let targetNormalized = (270 - sliceMid) % 360;
    if (targetNormalized < 0) targetNormalized += 360;

    // Add multiple full rotations (5 to 8 full spins) for excitement
    const fullSpins = prefersReduced ? 1 : 5 + Math.floor(Math.random() * 3);
    const currentNormalized = rotation % 360;
    const extraAngle = (targetNormalized - currentNormalized + 360) % 360;
    const finalRotation = rotation + fullSpins * 360 + extraAngle;

    if (prefersReduced) {
      setRotation(finalRotation);
      setIsSpinning(false);
      setSelectedActivity(targetActivity);
      setShowResultCard(true);
      playSound('chime', soundEnabled);
      triggerPastelConfetti(0.6);
      return;
    }

    const duration = 3800; // ms
    const startTime = performance.now();
    const startRotation = rotation;

    let lastTickAngle = startRotation;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic: 1 - pow(1 - progress, 3)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRot = startRotation + (finalRotation - startRotation) * easeOut;

      setRotation(currentRot);

      // Play soft tick sound when passing each segment boundary
      if (Math.abs(currentRot - lastTickAngle) >= 30) {
        playSound('wheel-tick', soundEnabled);
        lastTickAngle = currentRot;
      }

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setSelectedActivity(targetActivity);
        setShowResultCard(true);
        playSound('chime', soundEnabled);
        triggerPastelConfetti(0.6);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
  };

  const handleDismiss = () => {
    if (!selectedActivity) return;
    playSound('pop', soundEnabled);
    setDismissedIds((prev) => [...prev, selectedActivity.id]);
    setShowResultCard(false);
    setSelectedActivity(null);
  };

  const handleResetDismissed = () => {
    playSound('pop', soundEnabled);
    setDismissedIds([]);
  };

  return (
    <section id="wheel-section" className="py-16 px-4 sm:px-6 relative bg-gradient-to-b from-transparent via-purple-50/30 to-transparent">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>No Pressure Decision Maker</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-slate-100 mb-3">
          What are we doing today?
        </h2>

        <p className="text-slate-300 text-base max-w-xl mx-auto mb-8">
          Can't decide what to do? Give the wheel a spin for a gentle, zero-stress suggestion. If you're not in the mood for the result, simply dismiss it!
        </p>

        {/* Wheel container & Pointer */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
            {/* Top Needle / Pointer */}
            <div className="absolute -top-3 z-20 flex flex-col items-center pointer-events-none drop-shadow-md">
              <div className="w-0 h-0 border-x-8 border-x-transparent border-t-[20px] border-t-purple-400" />
              <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-purple-400 -mt-2" />
            </div>

            {/* Canvas Wheel */}
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="w-full h-full max-w-[360px] max-h-[360px] sm:max-w-[400px] sm:max-h-[400px] drop-shadow-2xl select-none"
              aria-label="Wheel of Randomness interactive spin wheel"
            />
          </div>

          {/* Spin Button */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`flex items-center gap-2.5 px-7 py-3.5 rounded-full text-base font-semibold transition-all cursor-pointer shadow-lg active:scale-95 ${
                isSpinning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/50'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Spinning...' : 'Spin The Wheel'}</span>
            </button>

            {dismissedIds.length > 0 && (
              <button
                onClick={handleResetDismissed}
                className="text-xs font-semibold text-slate-400 hover:text-purple-300 underline p-2 cursor-pointer"
              >
                Restore dismissed activities ({dismissedIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Result Card */}
        {showResultCard && selectedActivity && (
          <div className="max-w-xl mx-auto rounded-3xl p-6 sm:p-8 bg-slate-900/90 backdrop-blur-md border border-slate-750 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: selectedActivity.color,
                    color: selectedActivity.textColor,
                    borderColor: '#FFFFFF',
                  }}
                >
                  <DynamicIcon name={selectedActivity.iconName} className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block">
                    The Wheel Has Spoken!
                  </span>
                  <h3 className="font-heading font-semibold text-xl text-slate-100">
                    {selectedActivity.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {selectedActivity.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 hidden sm:inline-block"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-slate-200 text-base leading-relaxed mb-4">
              {selectedActivity.extendedDetails}
            </p>

            {/* Actions for this result */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={handleSpin}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-purple-300 border border-purple-500/30 transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Spin again</span>
              </button>

              <button
                onClick={handleDismiss}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-500/30 transition-colors cursor-pointer"
                title="Dismiss this activity if not suitable"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Not feeling this one (Dismiss)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
