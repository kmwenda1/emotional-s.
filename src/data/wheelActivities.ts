import type { WheelActivity } from '../types';

export const WHEEL_ACTIVITIES_DATA: WheelActivity[] = [
  {
    id: 1,
    title: 'Listen to a favourite song',
    shortDesc: 'Put on headphones and play that one track that always hits right.',
    extendedDetails:
      'Close your eyes or turn up the volume a notch. Let the baseline and melody wash over you. No multitasking allowed — just pure sonic pleasure for 3-4 minutes.',
    iconName: 'Headphones',
    color: '#E9D5FF', // lavender soft
    textColor: '#581C87',
    tags: ['Musical', 'Quick', 'Mood Booster'],
  },
  {
    id: 2,
    title: 'Take a five-minute walk',
    shortDesc: 'Step outside or stroll around the hallway. Move those limbs!',
    extendedDetails:
      'You don’t need gym clothes or sneakers. Just walk around the block, pace the room, or step out on the balcony. Feel the cool air against your cheeks and look at the sky.',
    iconName: 'Footprints',
    color: '#BAE6FD', // baby blue
    textColor: '#075985',
    tags: ['Fresh Air', 'Movement', 'Zero Pressure'],
  },
  {
    id: 3,
    title: 'Watch something funny',
    shortDesc: 'A 2-minute animal clip, standup snippet, or goofy blooper reel.',
    extendedDetails:
      'Search for "red pandas tumbling in snow" or your favorite comedian’s shortest bit. Let your facial muscles remember how to grin.',
    iconName: 'Sparkles',
    color: '#FED7AA', // peach/apricot
    textColor: '#9A3412',
    tags: ['Laughter', 'Easy', 'Dopamine'],
  },
  {
    id: 4,
    title: 'Have a snack and relax',
    shortDesc: 'Grab a crunchy, savory, or sweet nibble and enjoy every bite.',
    extendedDetails:
      'Make a piece of buttered toast, slice an apple, or grab that secret chocolate bar. Sit down, chew slowly, and savor it like a gourmet chef prepared it.',
    iconName: 'Cookie',
    color: '#FEF08A', // butter yellow
    textColor: '#854D0E',
    tags: ['Yum', 'Restorative', 'Sensory'],
  },
  {
    id: 5,
    title: 'Message a friend',
    shortDesc: 'Send a random meme, pet photo, or quick "hope you are having a nice day".',
    extendedDetails:
      'You don’t have to initiate a two-hour philosophical debate. Just a little ping of love into the universe. If you can’t think of words, a funny dog sticker says it all.',
    iconName: 'MessageCircleHeart',
    color: '#FBCFE8', // blush pink
    textColor: '#9D174D',
    tags: ['Connection', 'Sweet', 'Friendship'],
  },
  {
    id: 6,
    title: 'Do one tiny productive task',
    shortDesc: 'Tidy one corner, wash one plate, or delete five spam emails.',
    extendedDetails:
      'Pick a task that takes less than 3 minutes. When you finish it, whisper "I am unstoppable" to yourself. Micro-accomplishments generate genuine peace of mind.',
    iconName: 'CheckCircle2',
    color: '#BBF7D0', // mint soft
    textColor: '#166534',
    tags: ['Micro Win', 'Clarity', '3 Minutes'],
  },
  {
    id: 7,
    title: 'Take a break without guilt',
    shortDesc: 'Lie flat, look at the ceiling, or close your eyes. No justification needed.',
    extendedDetails:
      'Set a timer for 10 minutes. Tell your internal manager that you are off the clock. You are allowed to exist without producing output.',
    iconName: 'Coffee',
    color: '#DDD6FE', // lilac
    textColor: '#4C1D95',
    tags: ['Recharge', 'Gentle', 'Guilt-Free'],
  },
  {
    id: 8,
    title: 'Choose your own adventure',
    shortDesc: 'What is ONE gentle thing your heart genuinely wants to do right now?',
    extendedDetails:
      'Doodle, stretch, make a hot cup of tea, re-read a favorite comic, or take a nap. You are the captain of this ship. Pick whatever brings 10% more ease.',
    iconName: 'Compass',
    color: '#FEF3C7', // warm cream
    textColor: '#78350F',
    tags: ['Free Choice', 'Intuitive', 'You Pick'],
  },
];
