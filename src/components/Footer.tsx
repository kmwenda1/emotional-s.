import { Sparkles } from 'lucide-react';

interface FooterProps {
  friendName: string;
  onOpenCreatorNote: () => void;
}

export const Footer = ({ friendName, onOpenCreatorNote }: FooterProps) => {
  return (
    <footer className="mt-20 py-12 px-4 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md text-center relative z-10">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
        {/* Soft night badge */}
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>The Little Happy Place</span>
          <span>•</span>
          <span>A friendly digital sanctuary</span>
        </div>

        {/* The required exact quote */}
        <p className="font-heading text-lg sm:text-xl font-medium text-slate-200 tracking-tight">
          "Made to make your day a little lighter. One little step at a time."
        </p>

        {/* Small friend note reminder */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Crafted with care for</span>
          <span className="font-semibold text-indigo-300">{friendName}</span>
          <span>•</span>
          <button
            onClick={onOpenCreatorNote}
            className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
          >
            Read friend's note
          </button>
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          This sanctuary lives entirely in your browser. All thoughts and tiny wins stay strictly on your device.
        </p>
      </div>
    </footer>
  );
};
