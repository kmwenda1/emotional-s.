import type { FriendProfile, PersonalizationConfig, ThemePaletteId, WeatherSettings } from '../types';

export const DEFAULT_WEATHER: WeatherSettings = {
  rainIntensity: 'steady',
  rainSoundEnabled: true,
  thunderEnabled: false,
  cloudsEnabled: true,
};

export const DEFAULT_FRIENDS: FriendProfile[] = [
  {
    id: 'friend-alex',
    name: 'Alex',
    emoji: '🌸',
    creatorNote:
      "Hey Alex! Whenever things get loud, heavy, or just dull, drop by here. Wrap up in a blanket, watch the raindrops fall, and remember I'm always rooting for you.",
    preferredPalette: 'lavender',
    welcomeSubheading:
      "A quiet rainy night sanctuary just for you. No pressure to feel okay immediately — let the rain wash away the noise.",
    createdAt: 1700000000000,
  },
  {
    id: 'friend-sam',
    name: 'Sam',
    emoji: '🌿',
    creatorNote:
      "Hey Sam! Here is your quiet pocket of the night sky. Unclench your jaw, drop your shoulders, and listen to the rain.",
    preferredPalette: 'mint',
    welcomeSubheading:
      "Take your time, breathe easy, and let the gentle night rain keep you company.",
    createdAt: 1700000001000,
  },
  {
    id: 'friend-taylor',
    name: 'Taylor',
    emoji: '☀️',
    creatorNote:
      "Hey Taylor! You don't have to conquer the whole universe tonight. Cozy up and celebrate one tiny win.",
    preferredPalette: 'butter',
    welcomeSubheading:
      "A warm starry night space for when life gets busy. Rest without guilt.",
    createdAt: 1700000002000,
  },
];

export const DEFAULT_PERSONALIZATION: PersonalizationConfig = {
  siteTitle: 'The Little Happy Place',
  soundEnabled: true,
  activeFriendId: 'friend-alex',
  friends: DEFAULT_FRIENDS,
  weather: DEFAULT_WEATHER,
  creatorModeUnlocked: false,
};

export const PALETTES: Record<
  ThemePaletteId,
  {
    name: string;
    description: string;
    primaryHex: string;
    bgHex: string;
    cardBg: string;
    cardBorder: string;
    badgeBg: string;
    badgeText: string;
    accentGlow: string;
    rainColor: string;
    cloudTint: string;
  }
> = {
  lavender: {
    name: 'Twilight Lavender',
    description: 'Deep violet midnight with gentle lilac starlight',
    primaryHex: '#A78BFA',
    bgHex: '#0B0A16',
    cardBg: 'rgba(20, 17, 36, 0.75)',
    cardBorder: 'rgba(167, 139, 250, 0.25)',
    badgeBg: 'rgba(139, 92, 246, 0.2)',
    badgeText: '#DDD6FE',
    accentGlow: 'rgba(167, 139, 250, 0.22)',
    rainColor: 'rgba(196, 181, 253, 0.55)',
    cloudTint: 'rgba(139, 92, 246, 0.12)',
  },
  sky: {
    name: 'Nocturnal Rain',
    description: 'Deep midnight indigo with electric cyan raindrops',
    primaryHex: '#38BDF8',
    bgHex: '#070E1A',
    cardBg: 'rgba(12, 22, 38, 0.75)',
    cardBorder: 'rgba(56, 189, 248, 0.25)',
    badgeBg: 'rgba(14, 165, 233, 0.2)',
    badgeText: '#BAE6FD',
    accentGlow: 'rgba(56, 189, 248, 0.22)',
    rainColor: 'rgba(125, 211, 252, 0.6)',
    cloudTint: 'rgba(14, 165, 233, 0.12)',
  },
  peach: {
    name: 'Cozy Hearth Night',
    description: 'Midnight plum with warm peach and rose embers',
    primaryHex: '#FB7185',
    bgHex: '#120810',
    cardBg: 'rgba(32, 16, 26, 0.75)',
    cardBorder: 'rgba(251, 113, 133, 0.25)',
    badgeBg: 'rgba(244, 63, 94, 0.2)',
    badgeText: '#FECDD3',
    accentGlow: 'rgba(251, 113, 133, 0.22)',
    rainColor: 'rgba(253, 164, 175, 0.55)',
    cloudTint: 'rgba(244, 63, 94, 0.12)',
  },
  butter: {
    name: 'Starry Honey Night',
    description: 'Deep obsidian twilight with warm golden constellations',
    primaryHex: '#FBBF24',
    bgHex: '#100D06',
    cardBg: 'rgba(28, 22, 12, 0.75)',
    cardBorder: 'rgba(251, 191, 36, 0.25)',
    badgeBg: 'rgba(245, 158, 11, 0.2)',
    badgeText: '#FDE68A',
    accentGlow: 'rgba(251, 191, 36, 0.22)',
    rainColor: 'rgba(253, 224, 71, 0.55)',
    cloudTint: 'rgba(245, 158, 11, 0.12)',
  },
  mint: {
    name: 'Rainforest Mist',
    description: 'Nocturnal pine night with glowing emerald raindrops',
    primaryHex: '#34D399',
    bgHex: '#06120E',
    cardBg: 'rgba(12, 28, 22, 0.75)',
    cardBorder: 'rgba(52, 211, 153, 0.25)',
    badgeBg: 'rgba(16, 185, 129, 0.2)',
    badgeText: '#A7F3D0',
    accentGlow: 'rgba(52, 211, 153, 0.22)',
    rainColor: 'rgba(110, 231, 183, 0.55)',
    cloudTint: 'rgba(16, 185, 129, 0.12)',
  },
};
