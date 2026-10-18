import { useState, useEffect } from 'react';
import { X, HeartHandshake, Edit3, Check } from 'lucide-react';
import { playSound } from '../utils/audio';

interface CreatorNoteModalProps {
  friendName: string;
  creatorNote: string;
  soundEnabled: boolean;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNote: (newNote: string) => void;
}

export const CreatorNoteModal = ({
  friendName,
  creatorNote,
  soundEnabled,
  isOpen,
  onClose,
  onUpdateNote,
}: CreatorNoteModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(creatorNote);

  useEffect(() => {
    setNoteContent(creatorNote);
    setIsEditing(false);
  }, [creatorNote, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    playSound('pop', soundEnabled);
    onUpdateNote(noteContent);
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="creator-note-title"
    >
      <div className="max-w-md w-full bg-slate-900 rounded-3xl border border-slate-750 shadow-2xl p-6 sm:p-8 relative text-left animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-indigo-300">
            <HeartHandshake className="w-5 h-5 text-indigo-400" />
            <h3 id="creator-note-title" className="font-heading font-semibold text-xl text-slate-100">
              Personal Note for {friendName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Close creator note"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Edit Note for {friendName}
            </label>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={5}
              className="w-full p-3 rounded-xl border border-slate-750 bg-slate-950/70 text-sm text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-750 text-slate-200 text-base leading-relaxed italic">
              "{creatorNote}"
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsEditing(true)}
                className="text-slate-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Customize note</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-md shadow-indigo-600/30"
              >
                Close Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
