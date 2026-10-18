import { useState } from 'react';
import { Plus, Edit2, Share2, Check, Sparkles, Lock, Unlock, EyeOff } from 'lucide-react';
import type { FriendProfile } from '../types';
import { playSound } from '../utils/audio';

interface FriendTabBarProps {
  friends: FriendProfile[];
  activeFriend: FriendProfile;
  creatorModeUnlocked: boolean;
  soundEnabled: boolean;
  onSelectFriend: (friendId: string) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (friend: FriendProfile) => void;
  onToggleCreatorMode: (unlocked: boolean) => void;
  onOpenWelcomePortal?: () => void;
}

export const FriendTabBar = ({
  friends,
  activeFriend,
  creatorModeUnlocked,
  soundEnabled,
  onSelectFriend,
  onOpenAddModal,
  onOpenEditModal,
  onToggleCreatorMode,
  onOpenWelcomePortal,
}: FriendTabBarProps) => {
  const [copiedFriendName, setCopiedFriendName] = useState<string | null>(null);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const handleCopyShareLink = (friend: FriendProfile) => {
    playSound('tink', soundEnabled);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('friend', encodeURIComponent(friend.name));
      // Remove creator query if any to preserve friend privacy
      url.searchParams.delete('creator');
      navigator.clipboard.writeText(url.toString());
      setCopiedFriendName(friend.name);
      setTimeout(() => setCopiedFriendName(null), 2500);
    }
  };

  const handleUnlockCreator = (e: React.FormEvent) => {
    e.preventDefault();
    // Default secret creator code is "friend" or simply unlock
    if (passcode.trim().toLowerCase() === 'friend' || passcode.trim().toLowerCase() === 'creator' || passcode.trim() === '') {
      playSound('chime', soundEnabled);
      onToggleCreatorMode(true);
      setShowPasscodeModal(false);
      setPasscode('');
      setPasscodeError(false);
    } else {
      playSound('pop', soundEnabled);
      setPasscodeError(true);
    }
  };

  return (
    <div className="w-full bg-slate-900/60 border-b border-slate-800/80 backdrop-blur-md py-2.5 px-4 sm:px-6 transition-all duration-300">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* If creator mode is unlocked, show full friend tabs */}
        {creatorModeUnlocked ? (
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full no-scrollbar">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 mr-1 hidden sm:flex items-center gap-1 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Creator Switcher:
            </span>

            {friends.map((friend) => {
              const isActive = friend.id === activeFriend.id;
              return (
                <button
                  key={friend.id}
                  onClick={() => {
                    if (!isActive) {
                      playSound('pop', soundEnabled);
                      onSelectFriend(friend.id);
                    }
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 select-none ${
                    isActive
                      ? 'bg-purple-900/90 text-white shadow-md shadow-purple-900/50 scale-102 ring-2 ring-purple-400/50'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 shadow-2xs'
                  }`}
                  aria-label={`Switch sanctuary to ${friend.name}`}
                >
                  <span className="text-sm">{friend.emoji}</span>
                  <span>{friend.name}</span>
                </button>
              );
            })}

            {/* Add Friend Tab Button */}
            <button
              onClick={() => {
                playSound('pop', soundEnabled);
                onOpenAddModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-950/60 hover:bg-purple-900/70 text-purple-300 border border-dashed border-purple-500/40 transition-all cursor-pointer shrink-0 active:scale-95"
              title="Add a new friend profile"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Friend</span>
            </button>
          </div>
        ) : (
          /* PRIVATE FRIEND VIEW (Default): Visitor only sees their own sanctuary banner */
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-sm shadow-xs">
              {activeFriend.emoji}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                A Quiet Rainy Sanctuary for{' '}
                <span className="text-purple-300 font-bold">{activeFriend.name}</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-750 flex items-center gap-1">
                <EyeOff className="w-3 h-3 text-slate-500" />
                <span>Private View</span>
              </span>
              {onOpenWelcomePortal && (
                <button
                  onClick={() => {
                    playSound('pop', soundEnabled);
                    onOpenWelcomePortal();
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline cursor-pointer transition-colors"
                  title="Switch visitor or check in again"
                >
                  (Not {activeFriend.name}? Switch)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right side controls: Share Link, Edit, & Creator Lock/Unlock */}
        <div className="flex items-center gap-2 text-xs">
          {/* Creator View Share Link */}
          {creatorModeUnlocked && (
            <>
              <button
                onClick={() => handleCopyShareLink(activeFriend)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95"
                title={`Copy private link personalized for ${activeFriend.name}`}
              >
                {copiedFriendName === activeFriend.name ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-medium">
                      Private link copied for {activeFriend.name}!
                    </span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Link for {activeFriend.name}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  playSound('pop', soundEnabled);
                  onOpenEditModal(activeFriend);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95"
                title={`Edit ${activeFriend.name}'s profile`}
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Edit</span>
              </button>
            </>
          )}

          {/* Discreet Creator Mode Lock / Unlock Toggle */}
          <button
            onClick={() => {
              playSound('pop', soundEnabled);
              if (creatorModeUnlocked) {
                onToggleCreatorMode(false);
              } else {
                setShowPasscodeModal(true);
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-colors cursor-pointer border ${
              creatorModeUnlocked
                ? 'bg-purple-950/70 border-purple-500/50 text-purple-300 hover:bg-purple-900/60'
                : 'bg-slate-800/60 border-slate-750 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={
              creatorModeUnlocked
                ? 'Lock Creator Mode (Hide other friends)'
                : 'Creator View (Manage all friends & links)'
            }
          >
            {creatorModeUnlocked ? (
              <>
                <Unlock className="w-3 h-3 text-purple-400" />
                <span>Exit Creator Mode</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 text-slate-500" />
                <span>Creator Access</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Creator Mode Unlock Modal */}
      {showPasscodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-left animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 mb-3 text-purple-400">
              <Lock className="w-5 h-5 text-purple-400" />
              <h4 className="font-heading font-semibold text-lg text-slate-100">
                Unlock Creator View
              </h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Creator view allows managing all friend tabs, editing notes, and copying private links for each friend.
            </p>
            <form onSubmit={handleUnlockCreator} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setPasscodeError(false);
                  }}
                  placeholder="Press enter to unlock (or type 'friend')..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                  autoFocus
                />
                {passcodeError && (
                  <span className="text-[11px] text-rose-400 block mt-1">
                    Try typing 'friend' or leave empty and press enter.
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasscodeModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-600 text-white transition-colors cursor-pointer"
                >
                  Unlock Switcher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
