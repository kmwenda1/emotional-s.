import { useState } from 'react';
import { Sparkles, RefreshCw, Copy, Check, Filter } from 'lucide-react';
import type { GoodThing, GoodThingCategory } from '../types';
import { GOOD_THINGS_DATA } from '../data/goodThings';
import { DynamicIcon } from './DynamicIcon';
import { playSound } from '../utils/audio';
import { triggerStarBurst } from '../utils/confetti';

interface GoodThingsSectionProps {
  soundEnabled: boolean;
}

const CATEGORY_COLORS: Record<
  GoodThingCategory,
  { bg: string; text: string; border: string; badge: string }
> = {
  compliment: {
    bg: 'from-pink-50/60 to-rose-50/30',
    text: 'text-pink-800',
    border: 'border-pink-200',
    badge: 'bg-pink-100 text-pink-700',
  },
  observation: {
    bg: 'from-amber-50/60 to-yellow-50/30',
    text: 'text-amber-800',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
  },
  challenge: {
    bg: 'from-emerald-50/60 to-teal-50/30',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  reminder: {
    bg: 'from-purple-50/60 to-indigo-50/30',
    text: 'text-purple-800',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
  },
  fact: {
    bg: 'from-sky-50/60 to-blue-50/30',
    text: 'text-sky-800',
    border: 'border-sky-200',
    badge: 'bg-sky-100 text-sky-700',
  },
  'self-care': {
    bg: 'from-violet-50/60 to-purple-50/30',
    text: 'text-violet-800',
    border: 'border-violet-200',
    badge: 'bg-violet-100 text-violet-700',
  },
  surprise: {
    bg: 'from-fuchsia-50/60 to-pink-50/30',
    text: 'text-fuchsia-800',
    border: 'border-fuchsia-200',
    badge: 'bg-fuchsia-100 text-fuchsia-700',
  },
};

export const GoodThingsSection: React.FC<GoodThingsSectionProps> = ({ soundEnabled }) => {
  const [selectedCategory, setSelectedCategory] = useState<GoodThingCategory | 'all'>('all');
  const [currentItem, setCurrentItem] = useState<GoodThing>(() => {
    return GOOD_THINGS_DATA[Math.floor(Math.random() * GOOD_THINGS_DATA.length)];
  });
  const [copied, setCopied] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const filterPool =
    selectedCategory === 'all'
      ? GOOD_THINGS_DATA
      : GOOD_THINGS_DATA.filter((i) => i.category === selectedCategory);

  const handleGenerate = () => {
    playSound('pop', soundEnabled);
    setIsRevealing(true);

    setTimeout(() => {
      // Pick a random item different from current if pool > 1
      let nextItem = currentItem;
      if (filterPool.length > 1) {
        do {
          nextItem = filterPool[Math.floor(Math.random() * filterPool.length)];
        } while (nextItem.id === currentItem.id);
      } else if (filterPool.length === 1) {
        nextItem = filterPool[0];
      }
      setCurrentItem(nextItem);
      setIsRevealing(false);
      triggerStarBurst(0.5, 0.4);
    }, 160);
  };

  const handleCopy = () => {
    playSound('tink', soundEnabled);
    navigator.clipboard.writeText(`"${currentItem.content}" — The Little Happy Place`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colors = CATEGORY_COLORS[currentItem.category];

  return (
    <section id="good-things-section" className="py-16 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/60 text-pink-300 border border-pink-500/30 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant Positivity & Chuckles</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-slate-100 mb-3">
          Give me a little something.
        </h2>

        <p className="text-slate-300 text-base max-w-xl mx-auto mb-8">
          A wholesome compliment, a funny observation, a tiny challenge, or a reminder you probably needed to hear tonight.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-750'
            }`}
          >
            All Varieties ({GOOD_THINGS_DATA.length})
          </button>
          <button
            onClick={() => setSelectedCategory('compliment')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'compliment'
                ? 'bg-pink-600 text-white'
                : 'bg-slate-900/80 hover:bg-pink-950/40 text-pink-300 border border-slate-750 hover:border-pink-500/40'
            }`}
          >
            Compliments
          </button>
          <button
            onClick={() => setSelectedCategory('observation')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'observation'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-900/80 hover:bg-amber-950/40 text-amber-300 border border-slate-750 hover:border-amber-500/40'
            }`}
          >
            Funny Observations
          </button>
          <button
            onClick={() => setSelectedCategory('challenge')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'challenge'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900/80 hover:bg-emerald-950/40 text-emerald-300 border border-slate-750 hover:border-emerald-500/40'
            }`}
          >
            Tiny Challenges
          </button>
          <button
            onClick={() => setSelectedCategory('reminder')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'reminder'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900/80 hover:bg-purple-950/40 text-purple-300 border border-slate-750 hover:border-purple-500/40'
            }`}
          >
            Reminders
          </button>
          <button
            onClick={() => setSelectedCategory('fact')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'fact'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-900/80 hover:bg-sky-950/40 text-sky-300 border border-slate-750 hover:border-sky-500/40'
            }`}
          >
            Fun Facts
          </button>
        </div>

        {/* The Generator Card */}
        <div className="max-w-2xl mx-auto">
          <div
            className={`rounded-3xl p-8 sm:p-10 bg-slate-900/85 backdrop-blur-md border border-slate-750 shadow-2xl relative transition-all duration-300 ${
              isRevealing ? 'scale-95 opacity-50 blur-xs' : 'scale-100 opacity-100 blur-none'
            }`}
          >
            {/* Category badge */}
            <div className="flex items-center justify-between mb-6">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors.badge}`}
              >
                <DynamicIcon name={currentItem.iconName} className="w-3.5 h-3.5" />
                <span>{currentItem.categoryLabel}</span>
              </span>

              <button
                onClick={handleCopy}
                title="Copy to clipboard"
                aria-label="Copy to clipboard"
                className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-purple-300 transition-colors p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Saved to clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy note</span>
                  </>
                )}
              </button>
            </div>

            {/* Content quote */}
            <blockquote className="text-2xl sm:text-3xl font-heading font-medium text-slate-100 leading-snug sm:leading-snug mb-5">
              "{currentItem.content}"
            </blockquote>

            {/* Tagline / commentary */}
            {currentItem.tagline && (
              <p className="text-sm font-medium text-slate-400 italic mb-8">
                — {currentItem.tagline}
              </p>
            )}

            {/* Generator Action Button */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-center">
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full text-base font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:opacity-95 text-white shadow-lg shadow-purple-900/50 transition-all cursor-pointer active:scale-95 group"
              >
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Generate Another Good Thing</span>
                <RefreshCw className="w-3.5 h-3.5 opacity-80 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
