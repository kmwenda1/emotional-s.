import { useState } from 'react';
import { Send, Sparkles, Moon, Flame } from 'lucide-react';
import { playSound } from '../utils/audio';

interface ReleasedLantern {
  id: string;
  text: string;
  x: number; // percentage across screen
  y: number; // percentage from bottom
}

interface NightSkyLanternsProps {
  soundEnabled: boolean;
}

export const NightSkyLanterns = ({ soundEnabled }: NightSkyLanternsProps) => {
  const [inputText, setInputText] = useState('');
  const [lanterns, setLanterns] = useState<ReleasedLantern[]>([]);
  const [releasedMessage, setReleasedMessage] = useState<string | null>(null);

  const handleRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    playSound('chime', soundEnabled);

    const newLantern: ReleasedLantern = {
      id: `lantern-${Date.now()}`,
      text: inputText.trim(),
      x: 30 + Math.random() * 40, // center-ish 30% to 70%
      y: 0,
    };

    setLanterns((prev) => [...prev, newLantern]);
    setInputText('');
    setReleasedMessage('Your thought is drifting gently into the night sky. Breathe easy.');

    // Remove lantern after it floats away
    setTimeout(() => {
      setLanterns((prev) => prev.filter((l) => l.id !== newLantern.id));
    }, 8000);

    setTimeout(() => {
      setReleasedMessage(null);
    }, 4500);
  };

  return (
    <section className="py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Floating lanterns in the sky */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {lanterns.map((l) => (
          <div
            key={l.id}
            className="absolute transition-all duration-[8000ms] ease-out flex flex-col items-center"
            style={{
              left: `${l.x}%`,
              bottom: '100%',
              transform: 'translateY(-100px)',
              animation: 'float-slow 6s ease-in-out infinite',
            }}
          >
            {/* Glowing Lantern Graphic */}
            <div className="relative flex flex-col items-center">
              <div className="w-10 h-14 rounded-2xl bg-gradient-to-t from-amber-400 via-amber-200 to-yellow-100 shadow-[0_0_30px_rgba(251,191,36,0.8)] border border-amber-300 flex items-center justify-center animate-pulse">
                <Flame className="w-4 h-4 text-amber-600 animate-bounce" />
              </div>
              <div className="w-1.5 h-6 bg-gradient-to-b from-amber-400 to-transparent" />
            </div>
            <span className="text-[11px] font-medium text-amber-200/90 mt-1 max-w-[140px] truncate bg-slate-900/80 px-2 py-0.5 rounded-full border border-amber-400/40 backdrop-blur-xs">
              {l.text}
            </span>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-3">
          <Moon className="w-3.5 h-3.5" />
          <span>Night Sky Lanterns</span>
        </div>

        <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-slate-100 mb-2">
          Send a thought into the night.
        </h3>

        <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">
          Write down a worry you want to let go of, or a quiet wish into the rain. Watch it float up past the clouds and dissolve into the starry dark.
        </p>

        {/* Form */}
        <form onSubmit={handleRelease} className="max-w-md mx-auto">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-xl focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/30 backdrop-blur-md">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="A worry, a hope, or a thought to release..."
              maxLength={100}
              className="w-full px-4 py-2 text-sm text-slate-100 placeholder-slate-500 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                inputText.trim()
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/30 active:scale-95'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Release 🏮</span>
            </button>
          </div>
        </form>

        {releasedMessage && (
          <p className="text-xs text-amber-300/90 mt-3 flex items-center justify-center gap-1.5 animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{releasedMessage}</span>
          </p>
        )}
      </div>
    </section>
  );
};
