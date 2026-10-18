export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  accentColor: string;
}

export const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'box',
    name: 'Box Breathing (4-4-4-4)',
    description: 'Even, steady rhythm used to regain mental focus and calm an overactive nervous system.',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    accentColor: '#8B5CF6',
  },
  {
    id: 'calm',
    name: 'Gentle Flow (4-6)',
    description: 'Longer exhalation gently signals your parasympathetic system to slow down heart rate.',
    inhale: 4,
    hold1: 0,
    exhale: 6,
    hold2: 0,
    accentColor: '#0284C7',
  },
  {
    id: 'relax',
    name: '4-7-8 Deep Relaxation',
    description: 'Classic bedtime breathing to quiet mental chatter and encourage full body relaxation.',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    accentColor: '#10B981',
  },
];

export interface FiveMinuteStep {
  step: number;
  title: string;
  durationSec: number;
  instruction: string;
  gentleTip: string;
  iconName: string;
}

export const FIVE_MINUTE_RESET_STEPS: FiveMinuteStep[] = [
  {
    step: 1,
    title: 'Drop Physical Tension',
    durationSec: 60,
    instruction: 'Unclench your jaw. Drop your shoulders down and back. Soften your forehead and eyelids.',
    gentleTip: 'Notice where your body was gripping without your permission.',
    iconName: 'UserCheck',
  },
  {
    step: 2,
    title: 'Hydrate & Sip Mindfully',
    durationSec: 60,
    instruction: 'Grab a glass of cool or warm water. Take three slow, conscious sips.',
    gentleTip: 'Feel the cool temperature travelling down. A physical reset for your throat and stomach.',
    iconName: 'CupSoda',
  },
  {
    step: 3,
    title: 'Look Away From The Screen',
    durationSec: 60,
    instruction: 'Shift your gaze to a distant object, a window, a tree, or the ceiling. Rest your focal lenses.',
    gentleTip: 'Let your peripheral vision expand. Tight vision often creates tight thoughts.',
    iconName: 'EyeOff',
  },
  {
    step: 4,
    title: 'Gentle Body Stretch',
    durationSec: 60,
    instruction: 'Roll your neck gently side to side. Reach your arms toward the sky, interlace fingers, and yawn.',
    gentleTip: 'Movement tells your nervous system that you are safe to inhabit your body.',
    iconName: 'Sparkles',
  },
  {
    step: 5,
    title: 'One Kind Thought For Yourself',
    durationSec: 60,
    instruction: 'Acknowledge: "I am trying my best with the energy I have today. That is enough."',
    gentleTip: 'Place a hand over your heart or on your arm. Return to your day with gentle pacing.',
    iconName: 'Heart',
  },
];
