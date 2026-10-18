import { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';
import type { MoodConfig, MoodId, MoodMessage } from '../types';
import { MOODS_DATA } from '../data/moods';
import { safeStorage } from '../utils/storage';
import { playSound } from '../utils/audio';
import { triggerPastelConfetti } from '../utils/confetti';

interface HeroMoodSectionProps {
  friendId: string;
  friendName: string;
  welcomeSubheading?: string;
  soundEnabled: boolean;
  onNavigateToSection: (sectionId: string) => void;
}

export const HeroMoodSection = ({
  friendId,
  friendName,
  welcomeSubheading,
  soundEnabled,
  onNavigateToSection,
}: HeroMoodSectionProps) => {
  const storageKey = `happy_place_last_mood_${friendId}`;

  const [selectedMoodId, setSelectedMoodId] = useState<MoodId | null>(() => {
    return safeStorage.get<MoodId | null>(storageKey, null);
  });

  // Re-sync mood when friend changes
  useEffect(() => {
    const saved = safeStorage.get<MoodId | null>(`happy_place_last_mood_${friendId}`, null);
    setSelectedMoodId(saved);
    setMessageIndex(0);
    setSurpriseRevealed(false);
  }, [friendId]);

  const [messageIndex, setMessageIndex] = useState(0);
  const [surpriseRevealed, setSurpriseRevealed] = useState(false);
  const [isAnimatingMessage, setIsAnimatingMessage] = useState(false);

  // Active mood data
  const currentMood: MoodConfig | undefined = MOODS_DATA.find(
    (m) => m.id === selectedMoodId
  );

  const activeMessage: MoodMessage | undefined = currentMood
    ? currentMood.messages[messageIndex % currentMood.messages.length]
    : undefined;

  const handleSelectMood = (moodId: MoodId) => {
    playSound('pop', soundEnabled);
    if (selectedMoodId === moodId) {
      // Toggle or keep
      return;
    }
    setSelectedMoodId(moodId);
    setMessageIndex(0);
    setSurpriseRevealed(false);
    safeStorage.set(storageKey, moodId);

    if (moodId === 'good') {
      triggerPastelConfetti(0.5);
    }
  };

  const handleNextMessage = () => {
    if (!currentMood) return;
    playSound('swoosh', soundEnabled);
    setIsAnimatingMessage(true);
    setTimeout(() => {
      setMessageIndex((prev) => (prev + 1) % currentMood.messages.length);
      setSurpriseRevealed(false);
      setIsAnimatingMessage(false);
    }, 180);
  };

  const handleToggleSurprise = () => {
    playSound('tink', soundEnabled);
    setSurpriseRevealed((prev) => !prev);
  };

  useEffect(() => {
    // Reset surprise on mood change
    setSurpriseRevealed(false);
  }, [selectedMoodId]);

  return (
    <section id="mood-section" className="pt-8 pb-16 px-4 sm:px-6 relative">
      {/* Decorative background subtle blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-cyan-900/20 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center">
        {/* Floating welcome pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-purple-500/30 shadow-md mb-5 animate-pulse-subtle backdrop-blur-md">
          <span className="text-sm">🌧️</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
            A Safe Rainy Pocket of Calm
          </span>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs text-slate-400">No rush, take your time</span>
        </div>

        {/* Heading */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-semibold text-slate-100 tracking-tight leading-tight sm:leading-tight mb-4">
          Hey,{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent underline decoration-purple-400/40 decoration-wavy decoration-from-font">
            {friendName || 'human'}
          </span>
          . <br className="hidden sm:inline" />
          How are we doing today?
        </h1>

        {/* Supporting text */}
        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          {welcomeSubheading ||
            "Whatever kind of day you're having, there's a little something here for you. No pressure to feel okay immediately."}
        </p>

        {/* 8 Mood Selector Pills */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 max-w-3xl mx-auto mb-10" role="tablist" aria-label="Select your current mood">
          {MOODS_DATA.map((mood) => {
            const isSelected = selectedMoodId === mood.id;
            return (
              <button
                key={mood.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectMood(mood.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 select-none ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 scale-105 ring-2 ring-purple-300/40'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-750 hover:border-purple-400/40 shadow-xs hover:scale-102 backdrop-blur-xs'
                }`}
              >
                <span className="text-base sm:text-lg">{mood.emoji}</span>
                <span>{mood.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Mood Message Card */}
        {currentMood && activeMessage ? (
          <div
            className={`max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 bg-slate-900/85 backdrop-blur-md border border-slate-750 shadow-2xl transition-all duration-300 text-left relative overflow-hidden ${
              isAnimatingMessage ? 'opacity-40 scale-98' : 'opacity-100 scale-100'
            }`}
          >
            {/* Top mood indicator bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 rounded-2xl bg-slate-800 border border-slate-700">
                  {currentMood.emoji}
                </span>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-slate-100">
                    {currentMood.label}
                  </h3>
                  <p className="text-xs text-slate-400">{currentMood.tagline}</p>
                </div>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Message {(messageIndex % currentMood.messages.length) + 1} of{' '}
                {currentMood.messages.length}
              </span>
            </div>

            {/* Thoughtful message */}
            <div className="mb-6">
              <p className="text-slate-100 text-lg sm:text-xl leading-relaxed font-normal">
                "{activeMessage.message}"
              </p>
            </div>

            {/* Practical Suggestion Pill */}
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 mb-6 flex items-start gap-3">
              <div className="p-1.5 rounded-xl bg-amber-900/60 text-amber-300 shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-1">
                  One Small, Practical Step
                </span>
                <p className="text-amber-100 text-sm leading-relaxed">
                  {activeMessage.practicalTip}
                </p>
              </div>
            </div>

            {/* Optional Tailored Surprise / Activity Card */}
            {activeMessage.surpriseContent && (
              <div className="mb-6 rounded-2xl border border-purple-500/30 bg-purple-950/40 p-4 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-semibold text-purple-200">
                      {activeMessage.surpriseTitle || 'A little extra surprise'}
                    </span>
                  </div>
                  <button
                    onClick={handleToggleSurprise}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/40 transition-colors cursor-pointer shadow-xs"
                  >
                    {surpriseRevealed ? 'Hide surprise' : activeMessage.surpriseAction || 'Open surprise'}
                  </button>
                </div>

                {surpriseRevealed && (
                  <div className="mt-3 pt-3 border-t border-purple-500/20 text-sm text-purple-100 leading-relaxed animate-in fade-in duration-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p>{activeMessage.surpriseContent}</p>
                  </div>
                )}
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={handleNextMessage}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-750 text-purple-300 border border-purple-500/30 transition-all cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Show another message</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateToSection('mini-reset-section')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-purple-300 transition-colors p-2"
                >
                  <span>Need a 1-min breathing reset?</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Placeholder hint card if no mood selected */
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-900/60 border border-dashed border-slate-750 text-slate-400 text-sm flex flex-col items-center gap-2">
            <span className="text-2xl animate-bounce">🌧️</span>
            <span>Tap any mood above to get a tailored note and a cozy breath under the rain.</span>
          </div>
        )}
      </div>
    </section>
  );
};
