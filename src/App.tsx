import { useState, useEffect } from 'react';
import type { FriendProfile, PersonalizationConfig, RainIntensity } from './types';
import { DEFAULT_PERSONALIZATION, DEFAULT_FRIENDS, PALETTES } from './config/personalization';
import { safeStorage } from './utils/storage';
import { Navbar } from './components/Navbar';
import { FriendTabBar } from './components/FriendTabBar';
import { HeroMoodSection } from './components/HeroMoodSection';
import { GoodThingsSection } from './components/GoodThingsSection';
import { SpinWheelSection } from './components/SpinWheelSection';
import { OpenWhenSection } from './components/OpenWhenSection';
import { TinyWinsSection } from './components/TinyWinsSection';
import { MiniResetSection } from './components/MiniResetSection';
import { NightSkyLanterns } from './components/NightSkyLanterns';
import { RainNightSky } from './components/RainNightSky';
import { CustomCursor } from './components/CustomCursor';
import { WelcomePortal } from './components/WelcomePortal';
import type { VisitorAnswers } from './components/WelcomePortal';
import { PersonalSettingsModal } from './components/PersonalSettingsModal';
import { CreatorNoteModal } from './components/CreatorNoteModal';
import { FriendEditModal } from './components/FriendEditModal';
import { Footer } from './components/Footer';

const STORAGE_KEY_CONFIG = 'happy_place_personalization_config';
const STORAGE_KEY_VISITOR = 'happy_place_active_visitor_name';

export function App() {
  const [config, setConfig] = useState<PersonalizationConfig>(() => {
    const saved = safeStorage.get<any>(STORAGE_KEY_CONFIG, null);
    const savedVisitor = safeStorage.get<string | null>(STORAGE_KEY_VISITOR, null);

    let initialConfig: PersonalizationConfig;
    // If no saved config or legacy config format without friends list, use defaults
    if (!saved || !Array.isArray(saved.friends) || saved.friends.length === 0) {
      initialConfig = { ...DEFAULT_PERSONALIZATION };
    } else {
      initialConfig = {
        ...DEFAULT_PERSONALIZATION,
        ...saved,
        weather: {
          ...DEFAULT_PERSONALIZATION.weather,
          ...(saved.weather || {}),
        },
        creatorModeUnlocked: false,
      };
    }

    // Rock-solid persistence: If a visitor name was saved previously, match their profile immediately
    if (savedVisitor) {
      const match = initialConfig.friends.find(
        (f) => f.name.toLowerCase() === savedVisitor.toLowerCase()
      );
      if (match) {
        initialConfig.activeFriendId = match.id;
      }
    }

    return initialConfig;
  });

  // Check if visitor has identified themselves previously
  const [isWelcomePortalOpen, setIsWelcomePortalOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('friend')) return false; // Directly loading via URL
    const savedVisitor = safeStorage.get<string | null>(STORAGE_KEY_VISITOR, null);
    return !savedVisitor;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreatorNoteOpen, setIsCreatorNoteOpen] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [editingFriend, setEditingFriend] = useState<FriendProfile | null>(null);

  // Sync active friend with saved visitor on mount if needed
  useEffect(() => {
    const savedVisitor = safeStorage.get<string | null>(STORAGE_KEY_VISITOR, null);
    if (savedVisitor) {
      const match = config.friends.find(
        (f) => f.name.toLowerCase() === savedVisitor.toLowerCase()
      );
      if (match && match.id !== config.activeFriendId) {
        setConfig((prev) => ({ ...prev, activeFriendId: match.id, creatorModeUnlocked: false }));
      }
    }
  }, []);

  // Check URL query parameters for ?friend=FriendName to direct load a shared friend sanctuary
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const friendParam = params.get('friend');

    if (friendParam) {
      const decodedName = decodeURIComponent(friendParam).trim();
      safeStorage.set(STORAGE_KEY_VISITOR, decodedName);
      const existing = config.friends.find(
        (f) => f.name.toLowerCase() === decodedName.toLowerCase()
      );

      if (existing) {
        setConfig((prev) => ({
          ...prev,
          activeFriendId: existing.id,
          creatorModeUnlocked: false,
        }));
      } else {
        const newFriend: FriendProfile = {
          id: `friend-${Date.now()}`,
          name: decodedName,
          emoji: '🌙',
          creatorNote: `Hey ${decodedName}! I made this little rainy sanctuary for you. Drink some water and take things one breath at a time.`,
          preferredPalette: 'lavender',
          welcomeSubheading:
            "Whatever kind of day you're having, there's a little something here for you. No pressure to feel okay immediately.",
        };
        setConfig((prev) => ({
          ...prev,
          activeFriendId: newFriend.id,
          friends: [...prev.friends, newFriend],
          creatorModeUnlocked: false,
        }));
      }
    }
  }, []); // Run once on mount

  // Sync config updates to storage
  useEffect(() => {
    safeStorage.set(STORAGE_KEY_CONFIG, config);
  }, [config]);

  const activeFriend =
    config.friends.find((f) => f.id === config.activeFriendId) || config.friends[0] || DEFAULT_FRIENDS[0];

  const handleSelectFriend = (friendId: string) => {
    setConfig((prev) => ({ ...prev, activeFriendId: friendId }));
  };

  const handleToggleSound = () => {
    setConfig((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleSaveConfig = (updated: PersonalizationConfig) => {
    setConfig(updated);
  };

  const handleResetConfig = () => {
    setConfig(DEFAULT_PERSONALIZATION);
    safeStorage.remove(STORAGE_KEY_CONFIG);
    safeStorage.remove(STORAGE_KEY_VISITOR);
  };

  const handleToggleCreatorMode = (unlocked: boolean) => {
    setConfig((prev) => ({ ...prev, creatorModeUnlocked: unlocked }));
  };

  const handleChangeRainIntensity = (intensity: RainIntensity) => {
    setConfig((prev) => ({
      ...prev,
      weather: {
        ...prev.weather,
        rainIntensity: intensity,
      },
    }));
  };

  const handleToggleRainSound = () => {
    setConfig((prev) => ({
      ...prev,
      weather: {
        ...prev.weather,
        rainSoundEnabled: !prev.weather.rainSoundEnabled,
      },
    }));
  };

  const handleToggleThunder = () => {
    setConfig((prev) => ({
      ...prev,
      weather: {
        ...prev.weather,
        thunderEnabled: !prev.weather.thunderEnabled,
      },
    }));
  };

  const handleUpdateCreatorNote = (newNote: string) => {
    setConfig((prev) => ({
      ...prev,
      friends: prev.friends.map((f) =>
        f.id === activeFriend.id ? { ...f, creatorNote: newNote } : f
      ),
    }));
  };

  const handleSaveFriend = (savedFriend: FriendProfile) => {
    setConfig((prev) => {
      const exists = prev.friends.some((f) => f.id === savedFriend.id);
      const updatedFriends = exists
        ? prev.friends.map((f) => (f.id === savedFriend.id ? savedFriend : f))
        : [...prev.friends, savedFriend];

      return {
        ...prev,
        activeFriendId: savedFriend.id,
        friends: updatedFriends,
      };
    });
  };

  const handleDeleteFriend = (friendId: string) => {
    setConfig((prev) => {
      const filtered = prev.friends.filter((f) => f.id !== friendId);
      const nextActive = filtered[0]?.id || DEFAULT_FRIENDS[0].id;
      return {
        ...prev,
        activeFriendId: nextActive,
        friends: filtered.length > 0 ? filtered : DEFAULT_FRIENDS,
      };
    });
  };

  const handleWelcomePortalComplete = (answers: VisitorAnswers) => {
    const trimmedName = answers.name.trim();
    safeStorage.set(STORAGE_KEY_VISITOR, trimmedName);

    // Check if friend profile already exists (case-insensitive)
    const existing = config.friends.find(
      (f) => f.name.toLowerCase() === trimmedName.toLowerCase()
    );

    let targetId: string;

    if (existing) {
      targetId = existing.id;
      setConfig((prev) => ({
        ...prev,
        activeFriendId: targetId,
        creatorModeUnlocked: false,
        friends: prev.friends.map((f) =>
          f.id === targetId ? { ...f, preferredPalette: answers.preferredPalette } : f
        ),
      }));
    } else {
      const newFriend: FriendProfile = {
        id: `friend-${Date.now()}`,
        name: trimmedName,
        emoji: '🌙',
        creatorNote: `Hey ${trimmedName}! Whenever life gets loud, heavy, or just dull, drop by here. Wrap up in a blanket and take things one breath at a time.`,
        preferredPalette: answers.preferredPalette,
        welcomeSubheading:
          "A quiet rainy sanctuary made just for you. No pressure to feel okay immediately.",
        createdAt: Date.now(),
      };
      targetId = newFriend.id;
      setConfig((prev) => ({
        ...prev,
        activeFriendId: targetId,
        friends: [...prev.friends, newFriend],
        creatorModeUnlocked: false,
      }));
    }

    if (answers.initialMood) {
      safeStorage.set(`happy_place_last_mood_${targetId}`, answers.initialMood);
    }

    setIsWelcomePortalOpen(false);
  };

  const handleNavigateToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentPalette = PALETTES[activeFriend.preferredPalette] || PALETTES.lavender;

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-700 font-sans text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative"
      style={{ backgroundColor: currentPalette.bgHex }}
    >
      {/* 1. Custom Interactive Cursor */}
      <CustomCursor />

      {/* 2. Interactive Rainy Night Sky Canvas Background */}
      <RainNightSky
        paletteId={activeFriend.preferredPalette}
        rainIntensity={config.weather.rainIntensity}
        rainSoundEnabled={config.weather.rainSoundEnabled}
        thunderEnabled={config.weather.thunderEnabled}
        cloudsEnabled={config.weather.cloudsEnabled}
        onChangeRain={handleChangeRainIntensity}
        onToggleRainSound={handleToggleRainSound}
        onToggleThunder={handleToggleThunder}
      />

      {/* Navigation Header */}
      <Navbar
        config={config}
        activeFriendName={activeFriend.name}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleSound={handleToggleSound}
        onOpenCreatorNote={() => setIsCreatorNoteOpen(true)}
        onOpenWelcomePortal={() => setIsWelcomePortalOpen(true)}
      />

      {/* Friend Tabs Bar with Privacy Shield */}
      <FriendTabBar
        friends={config.friends}
        activeFriend={activeFriend}
        creatorModeUnlocked={Boolean(config.creatorModeUnlocked)}
        soundEnabled={config.soundEnabled}
        onSelectFriend={handleSelectFriend}
        onToggleCreatorMode={handleToggleCreatorMode}
        onOpenAddModal={() => setIsAddFriendOpen(true)}
        onOpenEditModal={(friend) => setEditingFriend(friend)}
        onOpenWelcomePortal={() => setIsWelcomePortalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-2 relative z-10">
        {/* 1. Homepage & Mood Selector */}
        <HeroMoodSection
          key={`hero-${activeFriend.id}`}
          friendId={activeFriend.id}
          friendName={activeFriend.name}
          welcomeSubheading={activeFriend.welcomeSubheading}
          soundEnabled={config.soundEnabled}
          onNavigateToSection={handleNavigateToSection}
        />

        {/* Subtle Nocturnal Section Divider */}
        <div className="max-w-xs mx-auto my-6 flex items-center justify-center gap-3 text-slate-700">
          <span className="w-8 h-px bg-slate-800" />
          <span className="text-xs text-indigo-400/80">🌧️</span>
          <span className="w-8 h-px bg-slate-800" />
        </div>

        {/* 2. Night Sky Lanterns: Release a Worry or Wish */}
        <NightSkyLanterns soundEnabled={config.soundEnabled} />

        <div className="max-w-xs mx-auto my-6 flex items-center justify-center gap-3 text-slate-700">
          <span className="w-8 h-px bg-slate-800" />
          <span className="text-xs text-amber-400/80">✨</span>
          <span className="w-8 h-px bg-slate-800" />
        </div>

        {/* 3. Random Good Thing Generator */}
        <GoodThingsSection soundEnabled={config.soundEnabled} />

        <div className="max-w-xs mx-auto my-6 flex items-center justify-center gap-3 text-slate-700">
          <span className="w-8 h-px bg-slate-800" />
          <span className="text-xs text-sky-400/80">✦</span>
          <span className="w-8 h-px bg-slate-800" />
        </div>

        {/* 4. The Wheel of Randomness */}
        <SpinWheelSection soundEnabled={config.soundEnabled} />

        <div className="max-w-xs mx-auto my-6 flex items-center justify-center gap-3 text-slate-700">
          <span className="w-8 h-px bg-slate-800" />
          <span className="text-xs text-indigo-400/80">✦</span>
          <span className="w-8 h-px bg-slate-800" />
        </div>

        {/* 5. The "Open When..." Collection */}
        <OpenWhenSection
          soundEnabled={config.soundEnabled}
          friendName={activeFriend.name}
        />

        <div className="max-w-xs mx-auto my-6 flex items-center justify-center gap-3 text-slate-700">
          <span className="w-8 h-px bg-slate-800" />
          <span className="text-xs text-amber-400/80">✦</span>
          <span className="w-8 h-px bg-slate-800" />
        </div>

        {/* 6. The Tiny Wins Tracker */}
        <TinyWinsSection
          key={`wins-${activeFriend.id}`}
          friendId={activeFriend.id}
          friendName={activeFriend.name}
          soundEnabled={config.soundEnabled}
        />

        <div className="max-w-xs mx-auto my-6 flex items-center justify-center gap-3 text-slate-700">
          <span className="w-8 h-px bg-slate-800" />
          <span className="text-xs text-emerald-400/80">✦</span>
          <span className="w-8 h-px bg-slate-800" />
        </div>

        {/* 7. The Mini Reset Corner */}
        <MiniResetSection soundEnabled={config.soundEnabled} />
      </main>

      {/* Footer */}
      <Footer
        friendName={activeFriend.name}
        onOpenCreatorNote={() => setIsCreatorNoteOpen(true)}
      />

      {/* Welcome Entrance Gate Modal (Ask Name & Question) */}
      <WelcomePortal
        isOpen={isWelcomePortalOpen}
        soundEnabled={config.soundEnabled}
        currentFriendName={activeFriend.name}
        onComplete={handleWelcomePortalComplete}
        onClose={
          safeStorage.get<string | null>(STORAGE_KEY_VISITOR, null)
            ? () => setIsWelcomePortalOpen(false)
            : undefined
        }
      />

      {/* Personal Settings Modal */}
      <PersonalSettingsModal
        config={config}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveConfig}
        onReset={handleResetConfig}
      />

      {/* Creator Note Modal for Active Friend */}
      <CreatorNoteModal
        friendName={activeFriend.name}
        creatorNote={activeFriend.creatorNote}
        soundEnabled={config.soundEnabled}
        isOpen={isCreatorNoteOpen}
        onClose={() => setIsCreatorNoteOpen(false)}
        onUpdateNote={handleUpdateCreatorNote}
      />

      {/* Add New Friend Modal */}
      <FriendEditModal
        isOpen={isAddFriendOpen}
        isNew={true}
        canDelete={false}
        soundEnabled={config.soundEnabled}
        onClose={() => setIsAddFriendOpen(false)}
        onSaveFriend={handleSaveFriend}
        onDeleteFriend={handleDeleteFriend}
      />

      {/* Edit Friend Modal */}
      <FriendEditModal
        isOpen={!!editingFriend}
        isNew={false}
        friendToEdit={editingFriend}
        canDelete={config.friends.length > 1}
        soundEnabled={config.soundEnabled}
        onClose={() => setEditingFriend(null)}
        onSaveFriend={handleSaveFriend}
        onDeleteFriend={handleDeleteFriend}
      />
    </div>
  );
}

export default App;
