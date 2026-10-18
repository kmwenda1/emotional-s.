import { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Sliders, Menu, X, HeartHandshake } from 'lucide-react';
import type { PersonalizationConfig } from '../types';
import { playSound } from '../utils/audio';

interface NavbarProps {
  config: PersonalizationConfig;
  activeFriendName: string;
  onOpenSettings: () => void;
  onToggleSound: () => void;
  onOpenCreatorNote: () => void;
  onOpenWelcomePortal?: () => void;
}

export const Navbar = ({
  config,
  activeFriendName,
  onOpenSettings,
  onToggleSound,
  onOpenCreatorNote,
  onOpenWelcomePortal,
}: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    playSound('pop', config.soundEnabled);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Check In', id: 'mood-section' },
    { label: 'Good Things', id: 'good-things-section' },
    { label: 'Activity Wheel', id: 'wheel-section' },
    { label: 'Open When', id: 'open-when-section' },
    { label: 'Little Wins', id: 'tiny-wins-section' },
    { label: 'Mini Reset', id: 'mini-reset-section' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-900/75 border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              playSound('pop', config.soundEnabled);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg p-1"
            aria-label="Scroll to top of The Little Happy Place"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500/30 via-purple-500/30 to-cyan-500/30 border border-slate-700/80 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="text-lg">🌧️</span>
            </div>
            <div>
              <span className="font-heading font-semibold text-lg text-slate-100 tracking-tight block">
                {config.siteTitle}
              </span>
              <span className="text-[11px] font-medium text-purple-400/90 -mt-1 block">
                for {activeFriendName}
              </span>
            </div>
          </button>

          {onOpenWelcomePortal && (
            <button
              onClick={() => {
                playSound('pop', config.soundEnabled);
                onOpenWelcomePortal();
              }}
              className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
              title="Change who is visiting"
            >
              Switch
            </button>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="px-3.5 py-1.5 rounded-full text-sm font-medium text-slate-300 hover:text-purple-300 hover:bg-slate-800/70 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Creator Note quick button */}
          <button
            onClick={() => {
              playSound('chime', config.soundEnabled);
              onOpenCreatorNote();
            }}
            title="Read note from creator"
            aria-label="Read friend note"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-950/60 hover:bg-pink-900/60 text-pink-300 border border-pink-500/30 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Friend's Note</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              if (!config.soundEnabled) {
                playSound('tink', true);
              }
            }}
            title={config.soundEnabled ? 'Mute soothing sounds' : 'Enable gentle sounds'}
            aria-label={config.soundEnabled ? 'Mute soothing sounds' : 'Enable gentle sounds'}
            className="p-2 rounded-full text-slate-300 hover:text-purple-300 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer active:scale-95"
          >
            {config.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-purple-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Personalize / Settings Modal Trigger */}
          <button
            onClick={() => {
              playSound('pop', config.soundEnabled);
              onOpenSettings();
            }}
            title="Settings & Night Themes"
            aria-label="Sanctuary settings and themes"
            className="p-2 rounded-full text-slate-300 hover:text-purple-300 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer active:scale-95"
          >
            <Sliders className="w-4 h-4 text-purple-400" />
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-slate-300 hover:text-purple-300 hover:bg-slate-800 border border-slate-700/60 cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 border-b border-slate-800 px-4 py-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-3 py-2 text-left rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-purple-300 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
