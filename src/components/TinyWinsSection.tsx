import { useState, useEffect } from 'react';
import { Sparkles, Plus, Check, Trash2, Heart, Award, AlertCircle } from 'lucide-react';
import type { TinyWin } from '../types';
import { safeStorage } from '../utils/storage';
import { playSound } from '../utils/audio';
import { triggerPastelConfetti } from '../utils/confetti';

interface TinyWinsSectionProps {
  friendId: string;
  friendName: string;
  soundEnabled: boolean;
}

const QUICK_WINS = [
  'Got out of bed.',
  'Finished a task.',
  'Took a break.',
  'Ate something.',
  'Went outside.',
  'Asked for help.',
  'Did something difficult despite feeling nervous.',
  'Drank a glass of water.',
];

const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
};

export const TinyWinsSection = ({
  friendId,
  friendName,
  soundEnabled,
}: TinyWinsSectionProps) => {
  const todayKey = getTodayKey();
  const storageKey = `happy_place_tiny_wins_${friendId}`;

  const [wins, setWins] = useState<TinyWin[]>(() => {
    return safeStorage.get<TinyWin[]>(storageKey, [
      {
        id: 'initial-1',
        text: `Woke up and visited ${friendName}'s little sanctuary`,
        completed: true,
        createdAt: 'Earlier today',
        dateKey: todayKey,
      },
    ]);
  });

  // Re-sync when friend changes
  useEffect(() => {
    const friendWins = safeStorage.get<TinyWin[]>(`happy_place_tiny_wins_${friendId}`, [
      {
        id: `initial-${friendId}`,
        text: `Woke up and visited ${friendName}'s little sanctuary`,
        completed: true,
        createdAt: 'Earlier today',
        dateKey: todayKey,
      },
    ]);
    setWins(friendWins);
  }, [friendId, friendName, todayKey]);

  const [customText, setCustomText] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [justCelebratedId, setJustCelebratedId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    safeStorage.set(`happy_place_tiny_wins_${friendId}`, wins);
  }, [wins, friendId]);

  const handleAddWin = (text: string) => {
    if (!text.trim()) return;

    const newWin: TinyWin = {
      id: `win-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: text.trim(),
      completed: true, // Default to completed as it's an accomplishment
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateKey: todayKey,
    };

    setWins((prev) => [newWin, ...prev]);
    setCustomText('');
    setJustCelebratedId(newWin.id);

    playSound('chime', soundEnabled);
    triggerPastelConfetti(0.5);

    setTimeout(() => {
      setJustCelebratedId(null);
    }, 1500);
  };

  const handleToggleComplete = (id: string) => {
    setWins((prev) =>
      prev.map((win) => {
        if (win.id === id) {
          const updated = !win.completed;
          if (updated) {
            playSound('tink', soundEnabled);
          } else {
            playSound('pop', soundEnabled);
          }
          return { ...win, completed: updated };
        }
        return win;
      })
    );
  };

  const handleDeleteWin = (id: string) => {
    playSound('pop', soundEnabled);
    setWins((prev) => prev.filter((w) => w.id !== id));
  };

  const handleClearAll = () => {
    playSound('pop', soundEnabled);
    setWins([]);
    safeStorage.remove(`happy_place_tiny_wins_${friendId}`);
    setShowClearConfirm(false);
  };

  const todayWins = wins.filter((w) => w.dateKey === todayKey);
  const completedCount = todayWins.filter((w) => w.completed).length;

  return (
    <section id="tiny-wins-section" className="py-16 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>Celebrating The Real Things</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-slate-100 mb-3 drop-shadow-sm">
          Little wins count too.
        </h2>

        <p className="text-slate-300 text-base max-w-xl mx-auto mb-8">
          No streaks, no points, and absolutely no guilt. Getting out of bed, drinking water, and breathing through the rough patches are real achievements.
        </p>

        {/* Friendly Daily Summary Card */}
        <div className="max-w-2xl mx-auto mb-8 p-4 sm:p-5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-750 shadow-xl flex items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400/90 block">
                Today's Gentle Check-in
              </span>
              <p className="text-sm font-medium text-slate-200">
                {completedCount === 0
                  ? "Even being here right now is a gentle win for you."
                  : completedCount === 1
                  ? "Look at that! 1 kind thing you showed up for today."
                  : `You've recognized ${completedCount} sweet little wins today! That's real care.`}
              </p>
            </div>
          </div>

          {wins.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-xs font-medium text-slate-400 hover:text-slate-200 underline cursor-pointer shrink-0"
            >
              Reset wins
            </button>
          )}
        </div>

        {/* Quick Add Suggestions Chips */}
        <div className="max-w-2xl mx-auto mb-8 text-left">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 block">
            Tap to celebrate a common win:
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_WINS.map((quickText) => (
              <button
                key={quickText}
                onClick={() => handleAddWin(quickText)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-amber-300 border border-slate-700/80 hover:border-amber-400/50 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3 h-3 text-amber-400" />
                <span>{quickText}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Win Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddWin(customText);
            }}
            className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-750 shadow-lg focus-within:border-amber-400/80 focus-within:ring-2 focus-within:ring-amber-400/20"
          >
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Add your own tiny win (e.g., brushed my teeth, put away laundry)..."
              className="w-full px-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none bg-transparent"
              maxLength={120}
            />
            <button
              type="submit"
              disabled={!customText.trim()}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                customText.trim()
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer active:scale-95 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Win</span>
            </button>
          </form>
        </div>

        {/* Wins List */}
        <div className="max-w-2xl mx-auto space-y-2.5 text-left">
          {todayWins.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-dashed border-slate-750 text-center text-slate-400 text-sm backdrop-blur-sm">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-amber-400" />
              <p>No wins recorded yet for today. Even taking a slow breath counts!</p>
            </div>
          ) : (
            todayWins.map((win) => {
              const isJustAdded = justCelebratedId === win.id;
              return (
                <div
                  key={win.id}
                  className={`p-3.5 sm:p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border transition-all duration-200 flex items-center justify-between gap-3 shadow-md ${
                    isJustAdded
                      ? 'border-amber-400 ring-2 ring-amber-400/30 scale-102 bg-amber-950/30'
                      : win.completed
                      ? 'border-slate-750 hover:border-slate-600'
                      : 'border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => handleToggleComplete(win.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        win.completed
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'border-2 border-slate-600 hover:border-slate-400'
                      }`}
                      aria-label={win.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {win.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium transition-all truncate ${
                          win.completed ? 'text-slate-100' : 'text-slate-400 line-through'
                        }`}
                      >
                        {win.text}
                      </p>
                      <span className="text-[11px] text-slate-400 block">{win.createdAt}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteWin(win.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
                    title="Remove this win"
                    aria-label={`Remove win: ${win.text}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Clear Data Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-sm w-full bg-slate-900 rounded-3xl p-6 border border-slate-750 shadow-2xl text-left animate-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2 text-amber-400 mb-3">
                <AlertCircle className="w-5 h-5" />
                <h4 className="font-heading font-semibold text-lg text-slate-100">
                  Clear today's wins?
                </h4>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                This will wipe the current list from your browser's local memory. You can always start fresh with new wins whenever you like.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Keep them
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
                >
                  Yes, clear list
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
