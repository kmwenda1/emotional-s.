import { useState, useEffect } from 'react';
import {
  Wind,
  Clock,
  FileText,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import {
  BREATHING_PATTERNS,
  FIVE_MINUTE_RESET_STEPS,
} from '../data/resetPrompts';
import type { BreathingPattern } from '../data/resetPrompts';
import { DynamicIcon } from './DynamicIcon';
import { safeStorage } from '../utils/storage';
import { playSound } from '../utils/audio';
import { triggerPastelConfetti } from '../utils/confetti';

interface MiniResetSectionProps {
  soundEnabled: boolean;
}

const STORAGE_KEY_BRAIN_DUMP = 'happy_place_brain_dump';
const STORAGE_KEY_SAVE_PREF = 'happy_place_brain_dump_autosave';

export const MiniResetSection: React.FC<MiniResetSectionProps> = ({ soundEnabled }) => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'five-minute' | 'brain-dump'>('breathing');

  // --- 1. BREATHING GUIDE STATE ---
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(BREATHING_PATTERNS[0]);
  const [isBreathingRunning, setIsBreathingRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(selectedPattern.inhale);
  const [cycleCount, setCycleCount] = useState(0);

  // --- 2. FIVE-MINUTE RESET STATE ---
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepSecondsLeft, setStepSecondsLeft] = useState(60);
  const [isStepTimerRunning, setIsStepTimerRunning] = useState(false);

  // --- 3. BRAIN DUMP STATE ---
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(() => {
    return safeStorage.get<boolean>(STORAGE_KEY_SAVE_PREF, false);
  });
  const [dumpText, setDumpText] = useState<string>(() => {
    return autoSaveEnabled ? safeStorage.get<string>(STORAGE_KEY_BRAIN_DUMP, '') : '';
  });
  const [isShredding, setIsShredding] = useState(false);
  const [dumpFeedback, setDumpFeedback] = useState<string | null>(null);

  // Breathing timer effect
  useEffect(() => {
    if (!isBreathingRunning) return;

    const interval = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Advance to next breathing phase
        if (breathPhase === 'inhale') {
          if (selectedPattern.hold1 > 0) {
            setBreathPhase('hold1');
            playSound('tink', soundEnabled);
            return selectedPattern.hold1;
          } else {
            setBreathPhase('exhale');
            playSound('soft-bell', soundEnabled);
            return selectedPattern.exhale;
          }
        } else if (breathPhase === 'hold1') {
          setBreathPhase('exhale');
          playSound('soft-bell', soundEnabled);
          return selectedPattern.exhale;
        } else if (breathPhase === 'exhale') {
          if (selectedPattern.hold2 > 0) {
            setBreathPhase('hold2');
            playSound('tink', soundEnabled);
            return selectedPattern.hold2;
          } else {
            setCycleCount((c) => c + 1);
            setBreathPhase('inhale');
            playSound('soft-bell', soundEnabled);
            return selectedPattern.inhale;
          }
        } else {
          // hold2 -> inhale
          setCycleCount((c) => c + 1);
          setBreathPhase('inhale');
          playSound('soft-bell', soundEnabled);
          return selectedPattern.inhale;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingRunning, breathPhase, selectedPattern, soundEnabled]);

  const handleToggleBreathing = () => {
    if (!isBreathingRunning) {
      playSound('soft-bell', soundEnabled);
    } else {
      playSound('pop', soundEnabled);
    }
    setIsBreathingRunning((prev) => !prev);
  };

  const handleResetBreathing = () => {
    playSound('pop', soundEnabled);
    setIsBreathingRunning(false);
    setBreathPhase('inhale');
    setPhaseSecondsLeft(selectedPattern.inhale);
    setCycleCount(0);
  };

  const handleSelectPattern = (pattern: BreathingPattern) => {
    playSound('pop', soundEnabled);
    setSelectedPattern(pattern);
    setIsBreathingRunning(false);
    setBreathPhase('inhale');
    setPhaseSecondsLeft(pattern.inhale);
  };

  // 5-Minute reset timer effect
  useEffect(() => {
    if (!isStepTimerRunning) return;

    const interval = setInterval(() => {
      setStepSecondsLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Completed this step
        playSound('chime', soundEnabled);
        if (currentStepIndex < FIVE_MINUTE_RESET_STEPS.length - 1) {
          setCurrentStepIndex((idx) => idx + 1);
          return 60;
        } else {
          setIsStepTimerRunning(false);
          triggerPastelConfetti(0.5);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStepTimerRunning, currentStepIndex, soundEnabled]);

  const handleNextStep = () => {
    playSound('swoosh', soundEnabled);
    if (currentStepIndex < FIVE_MINUTE_RESET_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setStepSecondsLeft(60);
    }
  };

  const handlePrevStep = () => {
    playSound('swoosh', soundEnabled);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setStepSecondsLeft(60);
    }
  };

  // Brain Dump auto-save effect
  useEffect(() => {
    if (autoSaveEnabled) {
      safeStorage.set(STORAGE_KEY_BRAIN_DUMP, dumpText);
      safeStorage.set(STORAGE_KEY_SAVE_PREF, true);
    } else {
      safeStorage.remove(STORAGE_KEY_BRAIN_DUMP);
      safeStorage.set(STORAGE_KEY_SAVE_PREF, false);
    }
  }, [dumpText, autoSaveEnabled]);

  const handleShredAndRelease = () => {
    if (!dumpText.trim()) return;
    playSound('swoosh', soundEnabled);
    setIsShredding(true);

    setTimeout(() => {
      setDumpText('');
      safeStorage.remove(STORAGE_KEY_BRAIN_DUMP);
      setIsShredding(false);
      setDumpFeedback('Shredded and released into the void. Your mind is lighter now.');
      playSound('pop', soundEnabled);
      setTimeout(() => setDumpFeedback(null), 3500);
    }, 700);
  };

  const handleClearDump = () => {
    playSound('pop', soundEnabled);
    setDumpText('');
    safeStorage.remove(STORAGE_KEY_BRAIN_DUMP);
  };

  // Phase labels and visual circle scale
  let phaseText = 'Breathe in slowly...';
  let circleScale = 'scale-75';
  if (breathPhase === 'inhale') {
    phaseText = 'Breathe in gently...';
    circleScale = 'scale-110';
  } else if (breathPhase === 'hold1' || breathPhase === 'hold2') {
    phaseText = 'Hold softly...';
    circleScale = 'scale-110';
  } else if (breathPhase === 'exhale') {
    phaseText = 'Breathe out slowly...';
    circleScale = 'scale-75';
  }

  const currentStep = FIVE_MINUTE_RESET_STEPS[currentStepIndex];

  return (
    <section id="mini-reset-section" className="py-16 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
          <Wind className="w-3.5 h-3.5" />
          <span>Lightweight Calming Tools</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-slate-100 mb-3 drop-shadow-sm">
          Let's reset for a minute.
        </h2>

        <p className="text-slate-300 text-base max-w-xl mx-auto mb-8">
          Gentle, accessible tools when you need to recalibrate. Not medical treatment — just a cozy moment of biological ease.
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-2 p-1.5 max-w-md mx-auto rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-750 mb-10 shadow-lg">
          <button
            onClick={() => {
              playSound('pop', soundEnabled);
              setActiveTab('breathing');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'breathing'
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-4 h-4 text-indigo-400" />
            <span>Breathing</span>
          </button>

          <button
            onClick={() => {
              playSound('pop', soundEnabled);
              setActiveTab('five-minute');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'five-minute'
                ? 'bg-sky-600/30 text-sky-200 border border-sky-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-sky-400" />
            <span>5-Min Reset</span>
          </button>

          <button
            onClick={() => {
              playSound('pop', soundEnabled);
              setActiveTab('brain-dump');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'brain-dump'
                ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Brain Dump</span>
          </button>
        </div>

        {/* TAB 1: BREATHING GUIDE */}
        {activeTab === 'breathing' && (
          <div className="max-w-2xl mx-auto rounded-3xl p-6 sm:p-10 bg-slate-900/85 backdrop-blur-md border border-slate-750 shadow-2xl animate-in fade-in duration-200 text-center">
            {/* Pattern Selector */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {BREATHING_PATTERNS.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => handleSelectPattern(pattern)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedPattern.id === pattern.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700'
                  }`}
                >
                  {pattern.name}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-8">
              {selectedPattern.description}
            </p>

            {/* Visual Animated Breathing Sphere */}
            <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
              {/* Outer pulsing gentle glow */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/30 via-purple-500/20 to-sky-500/30 blur-2xl transition-transform duration-1000 ${
                  isBreathingRunning ? 'animate-pulse scale-125' : 'opacity-30'
                }`}
              />

              {/* Animated Core Circle */}
              <div
                className={`w-48 h-48 rounded-full bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 border-4 border-indigo-400/30 shadow-2xl flex flex-col items-center justify-center transition-all duration-[4000ms] ease-in-out ${
                  isBreathingRunning ? circleScale : 'scale-90'
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">
                  {isBreathingRunning ? phaseText : 'Ready to breathe'}
                </span>
                <span className="font-heading text-4xl font-semibold text-slate-100">
                  {isBreathingRunning ? phaseSecondsLeft : selectedPattern.inhale}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  {cycleCount > 0 ? `Completed cycles: ${cycleCount}` : 'seconds'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleToggleBreathing}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
              >
                {isBreathingRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>{cycleCount > 0 ? 'Resume' : 'Start Breathing'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetBreathing}
                className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
                title="Reset timer"
                aria-label="Reset breathing exercise"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: FIVE-MINUTE RESET */}
        {activeTab === 'five-minute' && (
          <div className="max-w-2xl mx-auto rounded-3xl p-6 sm:p-10 bg-slate-900/85 backdrop-blur-md border border-slate-750 shadow-2xl animate-in fade-in duration-200 text-left">
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  Step {currentStep.step} of {FIVE_MINUTE_RESET_STEPS.length}
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400">60 seconds each</span>
              </div>

              <div className="flex items-center gap-1">
                {FIVE_MINUTE_RESET_STEPS.map((s, idx) => (
                  <div
                    key={s.step}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentStepIndex
                        ? 'w-6 bg-sky-400'
                        : idx < currentStepIndex
                        ? 'w-2 bg-emerald-400'
                        : 'w-2 bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step Card Content */}
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-950/60 text-sky-400 border border-sky-800/60 flex items-center justify-center shrink-0">
                  <DynamicIcon name={currentStep.iconName} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl text-slate-100">
                    {currentStep.title}
                  </h3>
                  <p className="text-slate-300 text-base leading-relaxed mt-1">
                    {currentStep.instruction}
                  </p>
                </div>
              </div>

              {/* Gentle tip */}
              <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-800/40 text-xs text-sky-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{currentStep.gentleTip}</span>
              </div>
            </div>

            {/* Timer countdown and controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-heading font-semibold text-sky-300">
                  {stepSecondsLeft}s
                </span>
                <span className="text-xs text-slate-400">remaining for this step</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className={`p-2 rounded-xl border border-slate-750 transition-colors ${
                    currentStepIndex === 0
                      ? 'opacity-30 cursor-not-allowed text-slate-600'
                      : 'hover:bg-slate-800 text-slate-300 cursor-pointer'
                  }`}
                  aria-label="Previous step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsStepTimerRunning(!isStepTimerRunning)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-colors cursor-pointer shadow-md shadow-sky-600/30"
                >
                  {isStepTimerRunning ? 'Pause Step' : 'Start Step Timer'}
                </button>

                <button
                  onClick={handleNextStep}
                  disabled={currentStepIndex === FIVE_MINUTE_RESET_STEPS.length - 1}
                  className={`p-2 rounded-xl border border-slate-750 transition-colors ${
                    currentStepIndex === FIVE_MINUTE_RESET_STEPS.length - 1
                      ? 'opacity-30 cursor-not-allowed text-slate-600'
                      : 'hover:bg-slate-800 text-slate-300 cursor-pointer'
                  }`}
                  aria-label="Next step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BRAIN DUMP */}
        {activeTab === 'brain-dump' && (
          <div className="max-w-2xl mx-auto rounded-3xl p-6 sm:p-10 bg-slate-900/85 backdrop-blur-md border border-slate-750 shadow-2xl animate-in fade-in duration-200 text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-300">
                  100% Private to your device. No server uploads.
                </span>
              </div>

              {/* Local Storage Toggle */}
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSaveEnabled}
                  onChange={(e) => {
                    playSound('pop', soundEnabled);
                    setAutoSaveEnabled(e.target.checked);
                  }}
                  className="rounded text-emerald-500 focus:ring-emerald-400 cursor-pointer bg-slate-800 border-slate-700"
                />
                <span>Auto-save to browser</span>
              </label>
            </div>

            {/* Textarea with shredding animation */}
            <div className="relative mb-4">
              <textarea
                value={dumpText}
                onChange={(e) => setDumpText(e.target.value)}
                placeholder="Pour out whatever is in your head right now... worries, random to-dos, frustrations, fragment thoughts. No formatting needed."
                rows={7}
                className={`w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-750 text-slate-100 text-sm leading-relaxed placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all ${
                  isShredding ? 'scale-90 opacity-0 blur-md duration-700' : 'scale-100 opacity-100'
                }`}
              />
            </div>

            {dumpFeedback && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{dumpFeedback}</span>
              </div>
            )}

            {/* Actions: Shred / Release vs Clear All */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-400">
                {dumpText.length} characters written
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearDump}
                  disabled={!dumpText}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    dumpText
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer'
                      : 'opacity-40 cursor-not-allowed text-slate-600'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>

                <button
                  onClick={handleShredAndRelease}
                  disabled={!dumpText.trim()}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    dumpText.trim()
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 cursor-pointer active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Shred & Release Into The Void</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
