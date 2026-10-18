export type MoodId =
  | 'sad'
  | 'overthinking'
  | 'stressed'
  | 'tired'
  | 'unmotivated'
  | 'lonely'
  | 'laugh'
  | 'good';

export interface MoodMessage {
  id: string;
  message: string;
  practicalTip: string;
  surpriseTitle?: string;
  surpriseAction?: string;
  surpriseContent?: string;
}

export interface MoodConfig {
  id: MoodId;
  label: string;
  emoji: string;
  iconName: string;
  tagline: string;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    glow: string;
    accent: string;
  };
  messages: MoodMessage[];
}

export type GoodThingCategory =
  | 'compliment'
  | 'observation'
  | 'challenge'
  | 'reminder'
  | 'fact'
  | 'self-care'
  | 'surprise';

export interface GoodThing {
  id: string;
  category: GoodThingCategory;
  categoryLabel: string;
  iconName: string;
  content: string;
  tagline?: string;
}

export interface WheelActivity {
  id: number;
  title: string;
  shortDesc: string;
  extendedDetails: string;
  iconName: string;
  color: string;
  textColor: string;
  tags: string[];
}

export interface OpenWhenCard {
  id: string;
  title: string;
  envelopeColor: string;
  sealEmoji: string;
  previewSnippet: string;
  fullMessage: string;
  estimatedReadTime: string;
}

export interface TinyWin {
  id: string;
  text: string;
  category?: string;
  completed: boolean;
  createdAt: string;
  dateKey: string; // YYYY-MM-DD
}

export type ThemePaletteId = 'lavender' | 'sky' | 'peach' | 'butter' | 'mint';

export interface FriendProfile {
  id: string;
  name: string;
  emoji: string;
  creatorNote: string;
  preferredPalette: ThemePaletteId;
  welcomeSubheading?: string;
  createdAt?: number;
}

export type RainIntensity = 'gentle' | 'steady' | 'storm' | 'off';

export interface WeatherSettings {
  rainIntensity: RainIntensity;
  rainSoundEnabled: boolean;
  thunderEnabled: boolean;
  cloudsEnabled: boolean;
}

export interface PersonalizationConfig {
  siteTitle: string;
  soundEnabled: boolean;
  activeFriendId: string;
  friends: FriendProfile[];
  weather: WeatherSettings;
  creatorModeUnlocked?: boolean;
}
