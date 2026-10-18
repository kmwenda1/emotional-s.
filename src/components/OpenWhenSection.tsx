import { useState } from 'react';
import { Mail, X, ChevronLeft, ChevronRight, HeartHandshake } from 'lucide-react';
import type { OpenWhenCard } from '../types';
import { OPEN_WHEN_LETTERS } from '../data/openWhenLetters';
import { playSound } from '../utils/audio';

interface OpenWhenSectionProps {
  soundEnabled: boolean;
  friendName: string;
}

export const OpenWhenSection = ({
  soundEnabled,
  friendName,
}: OpenWhenSectionProps) => {
  const [activeCard, setActiveCard] = useState<OpenWhenCard | null>(null);
  const [openedIds, setOpenedIds] = useState<string[]>([]);

  const handleOpenLetter = (card: OpenWhenCard) => {
    playSound('chime', soundEnabled);
    setActiveCard(card);
    if (!openedIds.includes(card.id)) {
      setOpenedIds((prev) => [...prev, card.id]);
    }
  };

  const handleCloseLetter = () => {
    playSound('pop', soundEnabled);
    setActiveCard(null);
  };

  const handlePrevLetter = () => {
    if (!activeCard) return;
    const currentIndex = OPEN_WHEN_LETTERS.findIndex((c) => c.id === activeCard.id);
    const prevIndex = (currentIndex - 1 + OPEN_WHEN_LETTERS.length) % OPEN_WHEN_LETTERS.length;
    playSound('swoosh', soundEnabled);
    setActiveCard(OPEN_WHEN_LETTERS[prevIndex]);
  };

  const handleNextLetter = () => {
    if (!activeCard) return;
    const currentIndex = OPEN_WHEN_LETTERS.findIndex((c) => c.id === activeCard.id);
    const nextIndex = (currentIndex + 1) % OPEN_WHEN_LETTERS.length;
    playSound('swoosh', soundEnabled);
    setActiveCard(OPEN_WHEN_LETTERS[nextIndex]);
  };

  return (
    <section id="open-when-section" className="py-16 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto text-center">
        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/60 text-violet-300 border border-violet-500/30 text-xs font-semibold mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>Personal Friendship Letters</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-slate-100 mb-3">
          Open when you need it.
        </h2>

        <p className="text-slate-300 text-base max-w-xl mx-auto mb-10">
          Nine digital letters sealed for specific moments. Whenever you need grounded reassurance under the night sky, unseal the envelope you need.
        </p>

        {/* 9 Envelopes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {OPEN_WHEN_LETTERS.map((card) => {
            const hasBeenOpened = openedIds.includes(card.id);
            return (
              <button
                key={card.id}
                onClick={() => handleOpenLetter(card)}
                className="group relative p-6 rounded-3xl border border-slate-750 bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md transition-all duration-300 text-left hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-950/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer"
              >
                {/* Envelope Seal Stamp */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 shadow-xs flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {card.sealEmoji}
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700">
                    {hasBeenOpened ? 'Unsealed' : 'Sealed'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading font-semibold text-lg text-slate-100 group-hover:text-purple-300 transition-colors mb-2">
                  {card.title}
                </h3>

                {/* Preview snippet */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {card.previewSnippet}
                </p>

                {/* Bottom link */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-purple-300 pt-2 border-t border-slate-800">
                  <span>Open Letter</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Letter Viewer */}
        {activeCard && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="letter-title"
          >
            <div className="max-w-2xl w-full bg-slate-900 rounded-3xl border border-slate-750 shadow-2xl p-6 sm:p-10 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-left">
              {/* Top envelope bar */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-2xl bg-slate-800 border border-slate-700">
                    {activeCard.sealEmoji}
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block">
                      To {friendName || 'My Dear Friend'}
                    </span>
                    <span className="text-xs text-slate-400">{activeCard.estimatedReadTime}</span>
                  </div>
                </div>

                <button
                  onClick={handleCloseLetter}
                  className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
                  aria-label="Close letter"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Letter Heading */}
              <h3 id="letter-title" className="font-heading text-2xl sm:text-3xl font-semibold text-slate-100 mb-6">
                {activeCard.title}
              </h3>

              {/* Letter Body */}
              <div className="text-slate-200 text-base sm:text-lg leading-relaxed whitespace-pre-line mb-8 font-normal">
                {activeCard.fullMessage}
              </div>

              {/* Letter Signoff */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <HeartHandshake className="w-4 h-4 text-pink-400" />
                  <span>With warmth & zero judgment</span>
                </div>

                {/* Letter Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevLetter}
                    className="p-2 rounded-xl border border-slate-750 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>

                  <button
                    onClick={handleNextLetter}
                    className="p-2 rounded-xl border border-slate-750 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleCloseLetter}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    Fold up letter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
