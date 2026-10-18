import { useState } from 'react';
import { Sparkles, Moon, ArrowRight, HeartHandshake, CloudRain } from 'lucide-react';
import type { MoodId, ThemePaletteId } from '../types';
import { PALETTES } from '../config/personalization';
import { playSound } from '../utils/audio';

export interface VisitorAnswers {
  name: string;
  initialMood?: MoodId;
  preferredPalette: ThemePaletteId;
  customNote?: string;
}

interface WelcomePortalProps {
  isOpen: boolean;
  soundEnabled: boolean;
  currentFriendName?: string;
  onComplete: (answers: VisitorAnswers) => void;
  onClose?: () => void;
}

const MOOD_CHECK_IN_OPTIONS: { id: MoodId; label: string; icon: string; description: string }[] = [
  {
    id: 'sad',
    label: 'A little sad or heavy',
    icon: '🌧️',
    description: 'Needing comfort and gentleness without any pressure.',
  },
  {
    id: 'overthinking',
    label: 'Overthinking again',
    icon: '🌀',
    description: 'My brain opened 37 tabs and won’t quiet down.',
  },
  {
    id: 'stressed',
    label: 'Stressed & overwhelmed',
    icon: '⚡',
    description: 'Everything feels too loud, urgent, or exhausting.',
  },
  {
    id: 'unmotivated',
    label: 'Low energy & unmotivated',
    icon: '🌱',
    description: 'Zero fuel in the tank. Doing one tiny thing is enough.',
  },
  {
    id: 'lonely',
    label: 'Feeling a little lonely',
    icon: '🫂',
    description: 'Just want to feel connected and quietly understood.',
  },
  {
    id: 'good',
    label: 'Actually having a good day',
    icon: '✨',
    description: 'Just here for the cozy rain, peace, and good vibes.',
  },
];

export const WelcomePortal = ({
  isOpen,
  soundEnabled,
  currentFriendName,
  onComplete,
  onClose,
}: WelcomePortalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState(currentFriendName || '');
  const [selectedMood, setSelectedMood] = useState<MoodId>('overthinking');
  const [selectedPalette, setSelectedPalette] = useState<ThemePaletteId>('sky');

  if (!isOpen) return null;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    playSound('pop', soundEnabled);
    setStep(2);
  };

  const handleFinalSubmit = () => {
    playSound('chime', soundEnabled);
    onComplete({
      name: name.trim(),
      initialMood: selectedMood,
      preferredPalette: selectedPalette,
    });
  };

  const paletteKeys = Object.keys(PALETTES) as ThemePaletteId[];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-w-lg w-full bg-slate-900/95 border border-slate-750 shadow-2xl rounded-3xl p-6 sm:p-8 relative text-left max-h-[92vh] overflow-y-auto">
        {/* Whimsical Header Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>A Quiet Night Haven</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Continue as {currentFriendName}
            </button>
          )}
        </div>

        {/* STEP 1: Name & Introduction */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-slate-100 mb-2">
                Hey, human. Welcome in. 🌧️
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                This is a quiet, judgment-free sanctuary made to bring a little comfort when the world is noisy. What should we call you?
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Your Name or Nickname
              </label>
              <input
                type="text"
                autoFocus
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex, Sam, Maya, Sunshine..."
                maxLength={24}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-750 text-slate-100 text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
              />
              <span className="text-[11px] text-slate-400 block">
                No passwords or accounts needed. We'll simply personalize your night sanctuary.
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!name.trim()}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  name.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Next: A Quick Check-in</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: The Question — Check-in & Palette Selection */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-slate-100 mb-1 flex items-center gap-2">
                <span>Nice to have you, {name}.</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h2>
              <p className="text-slate-300 text-sm">
                How is your spirit feeling as you step out of the rain tonight?
              </p>
            </div>

            {/* Mood Options Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Pick what best fits right now:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {MOOD_CHECK_IN_OPTIONS.map((opt) => {
                  const isSelected = selectedMood === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => {
                        playSound('pop', soundEnabled);
                        setSelectedMood(opt.id);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/30 shadow-md'
                          : 'bg-slate-950/40 border-slate-750 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{opt.icon}</span>
                        <span className="text-xs font-semibold text-slate-100">{opt.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Night Atmosphere Palette Choice */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Choose your nighttime atmosphere:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {paletteKeys.map((pId) => {
                  const p = PALETTES[pId];
                  const isSelected = selectedPalette === pId;
                  return (
                    <button
                      type="button"
                      key={pId}
                      onClick={() => {
                        playSound('pop', soundEnabled);
                        setSelectedPalette(pId);
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-950/40 ring-1 ring-indigo-400/40'
                          : 'border-slate-750 bg-slate-950/30 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0"
                        style={{ backgroundColor: p.primaryHex }}
                      />
                      <span className="text-xs text-slate-200 truncate">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation & Submission */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
              >
                <CloudRain className="w-4 h-4 text-sky-300" />
                <span>Enter Your Sanctuary</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer reassurance */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
          <HeartHandshake className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Everything you do here remains strictly private on your device.</span>
        </div>
      </div>
    </div>
  );
};
