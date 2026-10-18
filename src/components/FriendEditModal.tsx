import { useState, useEffect } from 'react';
import { X, Check, Trash2, UserPlus, UserCheck } from 'lucide-react';
import type { FriendProfile, ThemePaletteId } from '../types';
import { PALETTES } from '../config/personalization';
import { playSound } from '../utils/audio';

const AVAILABLE_EMOJIS = ['🌸', '🌿', '☀️', '🦊', '🌊', '🧸', '🍓', '☁️', '🪴', '🌙', '🐱', '☕', '🌻', '🎨'];

interface FriendEditModalProps {
  isOpen: boolean;
  isNew: boolean;
  friendToEdit?: FriendProfile | null;
  canDelete: boolean;
  soundEnabled: boolean;
  onClose: () => void;
  onSaveFriend: (friend: FriendProfile) => void;
  onDeleteFriend: (friendId: string) => void;
}

export const FriendEditModal = ({
  isOpen,
  isNew,
  friendToEdit,
  canDelete,
  soundEnabled,
  onClose,
  onSaveFriend,
  onDeleteFriend,
}: FriendEditModalProps) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🌸');
  const [preferredPalette, setPreferredPalette] = useState<ThemePaletteId>('lavender');
  const [creatorNote, setCreatorNote] = useState('');
  const [welcomeSubheading, setWelcomeSubheading] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (friendToEdit && !isNew) {
      setName(friendToEdit.name);
      setEmoji(friendToEdit.emoji);
      setPreferredPalette(friendToEdit.preferredPalette);
      setCreatorNote(friendToEdit.creatorNote);
      setWelcomeSubheading(
        friendToEdit.welcomeSubheading ||
          "Whatever kind of day you're having, there's a little something here for you. No pressure to feel okay immediately."
      );
    } else {
      setName('');
      setEmoji(AVAILABLE_EMOJIS[Math.floor(Math.random() * AVAILABLE_EMOJIS.length)]);
      setPreferredPalette('lavender');
      setCreatorNote(
        "Hey! Whenever things get loud, heavy, or just dull, drop by here. Drink a sip of water and remember I'm rooting for you."
      );
      setWelcomeSubheading(
        "Whatever kind of day you're having, there's a little something here for you. No pressure to feel okay immediately."
      );
    }
    setShowDeleteConfirm(false);
  }, [friendToEdit, isNew, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    playSound('chime', soundEnabled);

    const savedFriend: FriendProfile = {
      id: friendToEdit && !isNew ? friendToEdit.id : `friend-${Date.now()}`,
      name: name.trim(),
      emoji,
      preferredPalette,
      creatorNote: creatorNote.trim() || `Hey ${name}! Take things one breath at a time today.`,
      welcomeSubheading: welcomeSubheading.trim(),
      createdAt: friendToEdit?.createdAt || Date.now(),
    };

    onSaveFriend(savedFriend);
    onClose();
  };

  const paletteKeys = Object.keys(PALETTES) as ThemePaletteId[];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="friend-modal-title"
    >
      <div className="max-w-lg w-full bg-slate-900 rounded-3xl border border-slate-750 shadow-2xl p-6 sm:p-8 relative text-left max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-800">
          <div className="flex items-center gap-2 text-indigo-300">
            {isNew ? (
              <UserPlus className="w-5 h-5 text-indigo-400" />
            ) : (
              <UserCheck className="w-5 h-5 text-indigo-400" />
            )}
            <h3 id="friend-modal-title" className="font-heading font-semibold text-xl text-slate-100">
              {isNew ? 'Add A New Friend Sanctuary' : `Edit ${friendToEdit?.name}'s Sanctuary`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Close friend modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Friend Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Friend's Name or Nickname *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex, Sam, Maya, Bestie"
              maxLength={24}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-750 bg-slate-950/70 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
            />
          </div>

          {/* Emoji Avatar Picker */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Choose an Avatar Emoji
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_EMOJIS.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => {
                    playSound('pop', soundEnabled);
                    setEmoji(em);
                  }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                    emoji === em
                      ? 'bg-indigo-950/60 border-2 border-indigo-500 scale-110 shadow-sm'
                      : 'bg-slate-800/60 hover:bg-slate-800 border border-slate-750 text-slate-200'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Their Preferred Night Mood Palette
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {paletteKeys.map((pId) => {
                const p = PALETTES[pId];
                const isSelected = preferredPalette === pId;
                return (
                  <button
                    type="button"
                    key={pId}
                    onClick={() => {
                      playSound('pop', soundEnabled);
                      setPreferredPalette(pId);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-950/30'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-slate-700 shadow-sm shrink-0"
                        style={{ backgroundColor: p.primaryHex }}
                      />
                      <span className="text-xs font-semibold text-slate-200">
                        {p.name}
                      </span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Creator Note for This Friend */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Personal Note From You to {name || 'Them'}
            </label>
            <textarea
              value={creatorNote}
              onChange={(e) => setCreatorNote(e.target.value)}
              rows={3}
              placeholder="Write a sweet, grounding friendship note that only they will see..."
              className="w-full p-3 rounded-xl border border-slate-750 bg-slate-950/70 text-xs sm:text-sm text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
            />
            <span className="text-[11px] text-slate-500 block mt-1">
              Appears in their "Friend's Note" envelope and footer.
            </span>
          </div>

          {/* Actions & Delete Confirmation */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div>
              {!isNew && canDelete && (
                <>
                  {showDeleteConfirm ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (friendToEdit) {
                            playSound('pop', soundEnabled);
                            onDeleteFriend(friendToEdit.id);
                            onClose();
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                      >
                        Confirm Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Profile</span>
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                  name.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isNew ? 'Create Friend Sanctuary' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
