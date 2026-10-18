import { useState } from 'react';
import { X, Sliders, Check, RotateCcw, Volume2, VolumeX, CloudRain, Zap } from 'lucide-react';
import type { PersonalizationConfig, ThemePaletteId, RainIntensity } from '../types';
import { PALETTES, DEFAULT_PERSONALIZATION } from '../config/personalization';
import { playSound } from '../utils/audio';

interface PersonalSettingsModalProps {
  config: PersonalizationConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: PersonalizationConfig) => void;
  onReset: () => void;
}

export const PersonalSettingsModal = ({
  config,
  isOpen,
  onClose,
  onSave,
  onReset,
}: PersonalSettingsModalProps) => {
  const [siteTitle, setSiteTitle] = useState(config.siteTitle);
  const [soundEnabled, setSoundEnabled] = useState(config.soundEnabled);

  // Active friend styling
  const activeFriend =
    config.friends.find((f) => f.id === config.activeFriendId) || config.friends[0];
  const [activePalette, setActivePalette] = useState<ThemePaletteId>(
    activeFriend?.preferredPalette || 'lavender'
  );

  // Weather settings
  const [rainIntensity, setRainIntensity] = useState<RainIntensity>(
    config.weather?.rainIntensity || 'steady'
  );
  const [rainSoundEnabled, setRainSoundEnabled] = useState<boolean>(
    config.weather?.rainSoundEnabled ?? true
  );
  const [thunderEnabled, setThunderEnabled] = useState<boolean>(
    config.weather?.thunderEnabled ?? false
  );
  const [cloudsEnabled, setCloudsEnabled] = useState<boolean>(
    config.weather?.cloudsEnabled ?? true
  );

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('chime', soundEnabled);

    // Update active friend's palette
    const updatedFriends = config.friends.map((f) => {
      if (f.id === config.activeFriendId) {
        return { ...f, preferredPalette: activePalette };
      }
      return f;
    });

    onSave({
      ...config,
      siteTitle: siteTitle.trim() || 'The Little Happy Place',
      soundEnabled,
      friends: updatedFriends,
      weather: {
        rainIntensity,
        rainSoundEnabled,
        thunderEnabled,
        cloudsEnabled,
      },
    });
    onClose();
  };

  const handleResetToDefaults = () => {
    playSound('pop', soundEnabled);
    setSiteTitle(DEFAULT_PERSONALIZATION.siteTitle);
    setSoundEnabled(DEFAULT_PERSONALIZATION.soundEnabled);
    setActivePalette('lavender');
    setRainIntensity('steady');
    setRainSoundEnabled(true);
    setThunderEnabled(false);
    setCloudsEnabled(true);
    onReset();
  };

  const paletteKeys = Object.keys(PALETTES) as ThemePaletteId[];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="max-w-lg w-full bg-slate-900 rounded-3xl border border-slate-750 shadow-2xl p-6 sm:p-8 relative text-left max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-800">
          <div className="flex items-center gap-2 text-indigo-300">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 id="settings-title" className="font-heading font-semibold text-xl text-slate-100">
              Sanctuary Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Site Title */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Sanctuary Display Title
            </label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="The Little Happy Place"
              maxLength={36}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-750 bg-slate-950/70 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
            />
          </div>

          {/* Sound Preferences */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 border border-slate-750">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-indigo-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  Soothing Interaction Sound Effects
                </span>
                <span className="text-[11px] text-slate-400">
                  Gentle synthesized chimes, pops, and bells
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                playSound('pop', next);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {soundEnabled ? 'Enabled' : 'Muted'}
            </button>
          </div>

          {/* Rain & Weather Environment */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-750 space-y-3">
            <div className="flex items-center gap-2 text-sky-300">
              <CloudRain className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Rainy Night Weather Controls
              </span>
            </div>

            {/* Intensity Selector */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1.5">Rain Fall Intensity</label>
              <div className="grid grid-cols-3 gap-2">
                {(['gentle', 'steady', 'storm'] as RainIntensity[]).map((intensity) => (
                  <button
                    type="button"
                    key={intensity}
                    onClick={() => {
                      playSound('pop', soundEnabled);
                      setRainIntensity(intensity);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                      rainIntensity === intensity
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-900/80 text-slate-400 border border-slate-750 hover:text-slate-200'
                    }`}
                  >
                    {intensity === 'storm' ? '⚡ Storm' : intensity}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound and Lightning Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRainSoundEnabled(!rainSoundEnabled)}
                className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-between border cursor-pointer transition-all ${
                  rainSoundEnabled
                    ? 'bg-sky-950/40 border-sky-600/50 text-sky-200'
                    : 'bg-slate-900/80 border-slate-750 text-slate-400'
                }`}
              >
                <span>Rain Soundscape</span>
                <span className="text-[10px] uppercase font-bold">{rainSoundEnabled ? 'On' : 'Off'}</span>
              </button>

              <button
                type="button"
                onClick={() => setThunderEnabled(!thunderEnabled)}
                className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-between border cursor-pointer transition-all ${
                  thunderEnabled
                    ? 'bg-amber-950/40 border-amber-600/50 text-amber-200'
                    : 'bg-slate-900/80 border-slate-750 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Thunder Flash</span>
                </div>
                <span className="text-[10px] uppercase font-bold">{thunderEnabled ? 'On' : 'Off'}</span>
              </button>
            </div>
          </div>

          {/* Palette Choice for current friend */}
          {activeFriend && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Night Mood Palette for {activeFriend.name} ({activeFriend.emoji})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {paletteKeys.map((pId) => {
                  const p = PALETTES[pId];
                  const isSelected = activePalette === pId;
                  return (
                    <button
                      type="button"
                      key={pId}
                      onClick={() => {
                        playSound('pop', soundEnabled);
                        setActivePalette(pId);
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
          )}

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="text-xs font-semibold text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

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
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-colors cursor-pointer active:scale-95"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
