import type { MoodConfig } from '../types';

export const MOODS_DATA: MoodConfig[] = [
  {
    id: 'sad',
    label: 'A little sad',
    emoji: '🌧️',
    iconName: 'CloudRain',
    tagline: 'Quiet days are valid too. No hurry.',
    themeColor: {
      bg: 'bg-indigo-50/80',
      border: 'border-indigo-200',
      text: 'text-indigo-800',
      badge: 'bg-indigo-100 text-indigo-700',
      glow: 'shadow-indigo-100',
      accent: '#6366F1',
    },
    messages: [
      {
        id: 'sad-1',
        message:
          "Hey, you don't have to turn this day around to make it worthwhile. You're allowed to have days that are just difficult. Get comfortable, take things slowly, and give yourself the same kindness you'd give someone you care about.",
        practicalTip: 'Put on your softest socks or wrap yourself in a blanket. Physical coziness sends quiet safety signals to your brain.',
        surpriseTitle: 'A tiny gentle reassurance',
        surpriseAction: 'Reveal reassurance',
        surpriseContent: 'Fun fact: otters hold hands while sleeping so they don’t drift away. Consider this a metaphorical hand-hold from your crew.',
      },
      {
        id: 'sad-2',
        message:
          "Sadness feels like wearing wet wool clothes — heavy, slow, and impossible to rush off. You do not owe anyone cheerful performance today. You are still whole even when you feel subdued.",
        practicalTip: 'Sip a warm drink (tea, warm milk, broth, or cocoa) without looking at a screen for two minutes.',
        surpriseTitle: 'Low-energy comfort idea',
        surpriseAction: 'Need an easy distraction?',
        surpriseContent: 'Search for "live stream of puppy nurseries" or "panda playground videos". Zero thinking required.',
      },
      {
        id: 'sad-3',
        message:
          "Sometimes the sky is just grey, and that doesn't mean the sun went out of business forever. It just means today is overcast. Be very gentle with your expectations right now.",
        practicalTip: 'Wash your face with lukewarm water, or simply rest your eyes behind your hands for 30 seconds.',
        surpriseTitle: 'Tiny gentle fact',
        surpriseAction: 'Click for a soft truth',
        surpriseContent: 'You have survived 100% of the tough afternoons you thought you wouldn’t get through. Today counts too.',
      },
      {
        id: 'sad-4',
        message:
          "If the only thing you accomplish today is keeping yourself fed and breathing, that is a legitimate success. The world pushes non-stop productivity, but biology runs in seasons. Give yourself some grace.",
        practicalTip: 'Take three slow deep exhales that are noticeably longer than your inhales.',
        surpriseTitle: 'Friendly reminder',
        surpriseAction: 'Read this',
        surpriseContent: 'I appreciate having you in my life. The world is honestly more grounded with you around.',
      },
      {
        id: 'sad-5',
        message:
          "You don't need a neat philosophical explanation for why you feel down. You're a biological human being responding to life, tired synapses, or hormones. You don't have to explain it away to deserve comfort.",
        practicalTip: 'Eat a handful of nuts, a cracker, or a piece of fruit. Low blood sugar often amplifies sad feelings stealthily.',
        surpriseTitle: 'Gentle permission slip',
        surpriseAction: 'Open permission slip',
        surpriseContent: 'You are hereby excused from feeling "bright and bubbly" for the remainder of this hour.',
      },
      {
        id: 'sad-6',
        message:
          "Crying or feeling heavy isn't a design flaw; it's an emotional pressure-release valve. Let the clouds float through. You don't have to fight the weather inside your head.",
        practicalTip: 'Rest your back against a wall or pillow and let your neck and shoulders drop.',
        surpriseTitle: 'A low-stakes mission',
        surpriseAction: 'Give me a 30-second mission',
        surpriseContent: 'Look around your room and find three round objects. Notice their texture. Grounding in the present.',
      },
    ],
  },
  {
    id: 'overthinking',
    label: 'Overthinking again',
    emoji: '🌀',
    iconName: 'Brain',
    tagline: '37 tabs open in your brain? Let us mute a few.',
    themeColor: {
      bg: 'bg-purple-50/80',
      border: 'border-purple-200',
      text: 'text-purple-800',
      badge: 'bg-purple-100 text-purple-700',
      glow: 'shadow-purple-100',
      accent: '#8B5CF6',
    },
    messages: [
      {
        id: 'ot-1',
        message:
          "Your brain has opened 37 tabs, and at least 12 are playing music. Take a breath. You don't have to solve every possible future tonight. Let's deal with the next small thing first.",
        practicalTip: 'Name 5 things you can see right now, 4 you can touch, 3 you can hear. Ground yourself back in the physical room.',
        surpriseTitle: 'Overthinking reality check',
        surpriseAction: 'Unplug the blender',
        surpriseContent: '95% of the catastrophe scenarios we rehearse in our heads never actually happen. Brains are just overactive fiction writers.',
      },
      {
        id: 'ot-2',
        message:
          "Overthinking is just fear pretending to do useful research. You can't out-think uncertainty, but you can give your mind an intermission.",
        practicalTip: 'Write the worst-case scenario down on a scrap paper, fold it up, and tuck it under a mug for an hour.',
        surpriseTitle: 'Brain brake pedal',
        surpriseAction: 'Hit the brake',
        surpriseContent: 'Will this matter in 5 years? If not, do not give it 5 days of your nervous system’s energy today.',
      },
      {
        id: 'ot-3',
        message:
          "You are trying to predict the plot of season 5 when you are only midway through season 2. You don’t have enough data yet, and that’s completely fine.",
        practicalTip: 'Shake your hands vigorously for 10 seconds like you are flicking water off your fingertips.',
        surpriseTitle: 'Mental tab manager',
        surpriseAction: 'Close background tabs',
        surpriseContent: 'Tab closed: "What if I said something weird three years ago?" Nobody remembers. They were too busy thinking about themselves.',
      },
      {
        id: 'ot-4',
        message:
          "Your mind is treating thoughts like urgent court summons. Most thoughts are just junk mail passing through. You don't have to reply to all of them.",
        practicalTip: 'Touch something cold, like an ice cube or run cold tap water over your wrists for 15 seconds.',
        surpriseTitle: 'A friend’s perspective',
        surpriseAction: 'See perspective',
        surpriseContent: 'You are so capable, even when your internal narrator is being a chaotic little goblin.',
      },
      {
        id: 'ot-5',
        message:
          "Stop analyzing how you feel about how you feel about the situation. That is meta-thinking quicksand! Drop back down to: 'Right now, my feet are on the floor.'",
        practicalTip: 'Say out loud one simple undeniable fact: "The sky is blue" or "I am sitting in a chair."',
        surpriseTitle: 'Gentle comedy break',
        surpriseAction: 'Show me something silly',
        surpriseContent: 'Did you know pigeons can recognize themselves in mirrors, but still choose to bob their heads like that? Be like a pigeon: chill out.',
      },
    ],
  },
  {
    id: 'stressed',
    label: 'Stressed and overwhelmed',
    emoji: '⚡',
    iconName: 'Flame',
    tagline: 'Too much noise? Let us drop the volume.',
    themeColor: {
      bg: 'bg-rose-50/80',
      border: 'border-rose-200',
      text: 'text-rose-800',
      badge: 'bg-rose-100 text-rose-700',
      glow: 'shadow-rose-100',
      accent: '#F43F5E',
    },
    messages: [
      {
        id: 'str-1',
        message:
          "Everything feels like code red right now, but almost nothing actually is. Step back from the alarm. The universe will not collapse if you pause for 10 minutes.",
        practicalTip: 'Unclench your jaw right now. Drop your tongue from the roof of your mouth. Drop your shoulders by two inches.',
        surpriseTitle: 'Emergency pause button',
        surpriseAction: 'Press pause',
        surpriseContent: 'You are not behind. You are just carrying a boulder up a hill. Set the boulder down on the grass for a second.',
      },
      {
        id: 'str-2',
        message:
          "When everything screams for your attention at once, the secret isn't running faster. It is refusing to juggle five flaming torches at once. Drop four of them.",
        practicalTip: 'Pick just ONE thing to finish or even half-finish. Ignore the rest for the next 20 minutes.',
        surpriseTitle: 'Stress de-escalation',
        surpriseAction: 'Diffusing the bomb',
        surpriseContent: 'If it won’t kill you or set the building on fire, it can wait until after you’ve taken three slow sips of water.',
      },
      {
        id: 'str-3',
        message:
          "You are holding tension in your forehead and neck like you are personally bracing against an incoming hurricane. Relax the eyebrows.",
        practicalTip: 'Do a gentle neck roll: ear to shoulder, chin to chest, other ear to other shoulder.',
        surpriseTitle: 'Warm friendship truth',
        surpriseAction: 'Check in with reality',
        surpriseContent: 'You have solved messy problems before. You do not have to solve this in the next sixty seconds.',
      },
      {
        id: 'str-4',
        message:
          "Stress is your body trying to prepare for a tiger that isn't actually there. Tell your nervous system: 'Thank you for protecting me, but there is no tiger in this room.'",
        practicalTip: 'Look out the nearest window at the furthest tree or cloud for 20 seconds to reset focal eye strain.',
        surpriseTitle: 'A tiny relief card',
        surpriseAction: 'Unwrap relief',
        surpriseContent: 'You are doing a lot with the energy you have. Be proud of standing your ground today.',
      },
      {
        id: 'str-5',
        message:
          "Take a deep breath and let it out with a noisy sigh. Seriously, audible sighs physically stimulate the vagus nerve and help calm your heart rate.",
        practicalTip: 'Try a "physiological sigh": two quick inhales through the nose, then one long slow exhale through the mouth.',
        surpriseTitle: 'Emergency permission',
        surpriseAction: 'Authorize intermission',
        surpriseContent: 'You are authorized to say "I will look at this tomorrow morning with fresh eyes."',
      },
    ],
  },
  {
    id: 'tired',
    label: 'Tired of everything',
    emoji: '🛋️',
    iconName: 'Moon',
    tagline: 'Batteries at 3%? Recharge mode on.',
    themeColor: {
      bg: 'bg-amber-50/80',
      border: 'border-amber-200',
      text: 'text-amber-800',
      badge: 'bg-amber-100 text-amber-700',
      glow: 'shadow-amber-100',
      accent: '#F59E0B',
    },
    messages: [
      {
        id: 'tr-1',
        message:
          "You are not broken; your battery is simply blinking red. You wouldn't expect your phone to run games with 2% battery. Give your battery some charger time.",
        practicalTip: 'Lie down flat on your back for five minutes with no phone and your eyes closed.',
        surpriseTitle: 'Low-battery status',
        surpriseAction: 'Enter power saving mode',
        surpriseContent: 'Power saving mode engaged: brightness lowered, background tasks suspended, existential demands paused.',
      },
      {
        id: 'tr-2',
        message:
          "Sometimes you aren't tired of life; you are just tired of decisions. Stop deciding anything for the next hour. Default to the simplest, easiest option.",
        practicalTip: 'Cancel or reschedule one non-critical thing today. Protect your peace.',
        surpriseTitle: 'Sleepy wisdom',
        surpriseAction: 'Hear this',
        surpriseContent: 'Everything looks 80% more disastrous when you are exhausted. Rest first, judge reality later.',
      },
      {
        id: 'tr-3',
        message:
          "It’s okay to say 'I have zero enthusiasm for anything right now.' Apathy is often just your brain’s way of saying: 'I need you to stop demanding enthusiasm from me.'",
        practicalTip: 'Drink a glass of water. Half the time when we feel lethargic, cells are just slightly dehydrated.',
        surpriseTitle: 'Cozy quote',
        surpriseAction: 'Open cozy note',
        surpriseContent: '"There is virtue in work and there is virtue in rest. Use both and overlook neither." — Cozy friend note.',
      },
      {
        id: 'tr-4',
        message:
          "Rest is not a reward you have to earn after exhausting yourself into dust. Rest is the prerequisite for being an operating human.",
        practicalTip: 'Dim the room lights or turn on a warm lamp instead of harsh overhead fluorescent lights.',
        surpriseTitle: 'Sloth endorsement',
        surpriseAction: 'Channel the sloth',
        surpriseContent: 'Sloths sleep 15 to 20 hours a day and are beloved worldwide. Take notes from the masters.',
      },
      {
        id: 'tr-5',
        message:
          "If all you did today was survive, you still won. Tomorrow will have its own light. For now, tuck in and be soft with yourself.",
        practicalTip: 'Change out of tight or stiff clothes into something loose and warm right now.',
        surpriseTitle: 'Warm friend whisper',
        surpriseAction: 'Listen in',
        surpriseContent: 'I’m glad you’re resting. You don’t have to prove anything to me or the world today.',
      },
    ],
  },
  {
    id: 'unmotivated',
    label: 'Unmotivated',
    emoji: '🌱',
    iconName: 'Sparkles',
    tagline: 'Tiny steps still move you forward.',
    themeColor: {
      bg: 'bg-emerald-50/80',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      badge: 'bg-emerald-100 text-emerald-700',
      glow: 'shadow-emerald-100',
      accent: '#10B981',
    },
    messages: [
      {
        id: 'unm-1',
        message:
          "Listen, we're not conquering the entire universe today. We're doing ONE tiny thing. Drink some water, tidy one corner, or start that task for five minutes. Small wins still count.",
        practicalTip: 'Set a timer for literally 3 minutes. Work on the task for just 3 minutes, then you are legally allowed to quit if you want.',
        surpriseTitle: 'Anti-procrastination hack',
        surpriseAction: 'Unlock micro-move',
        surpriseContent: 'Action often comes BEFORE motivation, not after. Just moving one finger breaks the paralysis.',
      },
      {
        id: 'unm-2',
        message:
          "Motivation is a flaky friend who only shows up when the weather is nice. You don’t need motivation to do a terrible first draft or pick up one sock.",
        practicalTip: 'Lower the bar. Lower it until it is resting on the floor. Now step over it.',
        surpriseTitle: 'Tiny spark',
        surpriseAction: 'Ignite spark',
        surpriseContent: 'Doing something half-heartedly is infinitely better than doing 0% of it perfectly in your imagination.',
      },
      {
        id: 'unm-3',
        message:
          "You are not lazy; you are probably overwhelmed by the invisible checklist your brain compiled. Strip the checklist down to a single bullet point.",
        practicalTip: 'Write down ONE sentence describing the very first micro-action: e.g. "Open laptop document."',
        surpriseTitle: 'Secret weapon',
        surpriseAction: 'Deploy secret weapon',
        surpriseContent: 'Play one high-energy track while standing up. Don’t even work, just groove for 3 minutes.',
      },
      {
        id: 'unm-4',
        message:
          "You don't need a montage scene with dramatic orchestral music to make progress. A quiet, clumsy stumble forward is still progress.",
        practicalTip: 'Clear just your keyboard space or desktop surface. Visual clarity invites mental ease.',
        surpriseTitle: 'A nudge from your pal',
        surpriseAction: 'Receive nudge',
        surpriseContent: 'Whatever you touch today, even if it’s small, will leave you feeling a little lighter later. You got this.',
      },
      {
        id: 'unm-5',
        message:
          "The biggest obstacle is starting. Once you begin, inertia takes over. Make the start so ridiculously easy you can’t say no.",
        practicalTip: 'Count down 5, 4, 3, 2, 1 out loud, then stand up.',
        surpriseTitle: 'Cheering squad',
        surpriseAction: 'Check the stands',
        surpriseContent: 'A stadium of tiny friendly ducks is cheering your name right now: *quack quack you can do the thing!*',
      },
    ],
  },
  {
    id: 'lonely',
    label: 'Feeling lonely',
    emoji: '🫂',
    iconName: 'HeartHandshake',
    tagline: 'You are tethered to people who care, even on quiet days.',
    themeColor: {
      bg: 'bg-teal-50/80',
      border: 'border-teal-200',
      text: 'text-teal-800',
      badge: 'bg-teal-100 text-teal-700',
      glow: 'shadow-teal-100',
      accent: '#0D9488',
    },
    messages: [
      {
        id: 'lon-1',
        message:
          "Feeling alone can be heavy, even when you can't quite explain why. You don't have to pretend otherwise. Maybe reach out to someone you trust, send a random meme, or simply take a moment to breathe. You matter, even on quiet days.",
        practicalTip: 'Send a funny picture or simple "Thinking of you!" text to a friend with no expectation of an essay reply.',
        surpriseTitle: 'A tether back to reality',
        surpriseAction: 'Feel the connection',
        surpriseContent: 'Someone out there smiled at a memory of you recently. You leave fingerprints on the lives around you.',
      },
      {
        id: 'lon-2',
        message:
          "Loneliness has a trick where it makes you feel like you’re the only person on earth feeling solitary. In this exact second, millions of wonderful people are staring at ceilings feeling the same ache.",
        practicalTip: 'Step outside or open a window. Watch the birds, cars, or trees moving. You belong to the wider living world.',
        surpriseTitle: 'Warm friendship hug',
        surpriseAction: 'Unfold warm hug',
        surpriseContent: 'If we were in the same room right now, I would hand you a warm cup of tea and sit in comfortable silence.',
      },
      {
        id: 'lon-3',
        message:
          "Quietness doesn’t equal abandonment. People get swept up in their chaotic weekly routines, but their fondness for you doesn’t expire when they are busy.",
        practicalTip: 'Listen to an engaging podcast or audiobook. Hearing conversational human voices gently dispels silence.',
        surpriseTitle: 'Low-effort connection',
        surpriseAction: 'Try this tiny idea',
        surpriseContent: 'Wave at a neighbor, thank a barista or cashier warmly, or leave a sweet comment on a small creator’s post.',
      },
      {
        id: 'lon-4',
        message:
          "You are worthy of companionship, warmth, and laughter, even when your phone has been quiet today. Solitude is a temporary state, not an identity.",
        practicalTip: 'Wrap both arms across your chest in a self-hug and take a deep breath. Biological pressure releases oxytocin.',
        surpriseTitle: 'A keepsake message',
        surpriseAction: 'Read keepsake',
        surpriseContent: 'You are someone’s favorite person to talk to when the timing lines up. Don’t forget that.',
      },
      {
        id: 'lon-5',
        message:
          "Remember that you are good company for yourself too. Put on something comforting, make yourself your favorite snack, and treat yourself as an honored guest.",
        practicalTip: 'Write down 3 things you love about your own personality or senses (e.g., your taste in music, your humor).',
        surpriseTitle: 'A friend’s whisper',
        surpriseAction: 'Open note',
        surpriseContent: 'I’m so glad you exist in this world. This page is here whenever you need a companion.',
      },
    ],
  },
  {
    id: 'laugh',
    label: 'Need a laugh',
    emoji: '☀️',
    iconName: 'Smile',
    tagline: 'Laughter is medicine, no prescription required.',
    themeColor: {
      bg: 'bg-yellow-50/80',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      badge: 'bg-yellow-100 text-yellow-700',
      glow: 'shadow-yellow-100',
      accent: '#EAB308',
    },
    messages: [
      {
        id: 'lgh-1',
        message:
          "Life is fundamentally ridiculous. We are conscious stardust standing on a wet spinning rock hurtling through space at 67,000 mph, yet we stress about email phrasing. Take things 20% less seriously.",
        practicalTip: 'Make the ugliest, most absurd face you can in front of a mirror or camera. Hold it for 5 seconds.',
        surpriseTitle: 'Absurd truth',
        surpriseAction: 'Give me the chuckle',
        surpriseContent: 'A group of flamingos is officially called a "flamboyance". A group of pugs is called a "grumble". Imagine being grumpy in a flamboyance.',
      },
      {
        id: 'lgh-2',
        message:
          "Remember: somewhere right now, someone is pushing a door that clearly says PULL with increasing fury. You are doing just fine by comparison.",
        practicalTip: 'Watch a 30-second video of animals failing at jumps or cats being startled by cucumbers.',
        surpriseTitle: 'Funny observation',
        surpriseAction: 'Read observation',
        surpriseContent: 'Whoever said "nothing is impossible" clearly never tried slamming a revolving door or untangling headphone wires in the dark.',
      },
      {
        id: 'lgh-3',
        message:
          "If you ever feel clumsy, remember that penguins fall over constantly on flat ice and just stand back up like 'I meant to do that.' Adopt penguin swagger.",
        practicalTip: 'Text a friend an out-of-context picture of a potato and refuse to elaborate.',
        surpriseTitle: 'Tiny riddle',
        surpriseAction: 'Tell me the joke',
        surpriseContent: 'Why do we tell actors to "break a leg"? Because every play has a cast! (I’ll see myself out.)',
      },
      {
        id: 'lgh-4',
        message:
          "Adulting is mostly whispering 'what on earth' to yourself in different grocery aisles while comparing olive oil prices.",
        practicalTip: 'Do a dramatic slow-motion victory walk across the room like you just won the Olympic gold in Existing.',
        surpriseTitle: 'Wholesome giggles',
        surpriseAction: 'Open giggle',
        surpriseContent: 'Cows have best friends and get stressed out when they are separated. So technically, missing your buddies is bovine biology.',
      },
      {
        id: 'lgh-5',
        message:
          "You are allowed to laugh at the chaos. Sometimes finding the humor isn't minimizing the problem; it’s taking away its power to terrorize you.",
        practicalTip: 'Pronounce ordinary words with a silly dramatic accent for the next two minutes.',
        surpriseTitle: 'Comedic blessing',
        surpriseAction: 'Receive blessing',
        surpriseContent: 'May your Wi-Fi be strong, your coffee never lukewarm, and your autocorrect never substitute something mortifying.',
      },
    ],
  },
  {
    id: 'good',
    label: 'Actually having a good day!',
    emoji: '✨',
    iconName: 'Sun',
    tagline: 'Bottling the sunshine and celebrating your glow.',
    themeColor: {
      bg: 'bg-sky-50/80',
      border: 'border-sky-200',
      text: 'text-sky-800',
      badge: 'bg-sky-100 text-sky-700',
      glow: 'shadow-sky-100',
      accent: '#0284C7',
    },
    messages: [
      {
        id: 'gd-1',
        message:
          "Yesss! Soak this up! Good days aren't just flukes — they are proof that joy, lightness, and ease still find their way to you. Let the warmth sink into your bones.",
        practicalTip: 'Take a mental snapshot right now: notice what feels good, what tastes good, or what made you smile today.',
        surpriseTitle: 'Celebration sparkler',
        surpriseAction: 'Launch confetti',
        surpriseContent: 'You deserve good days. Not because you earned them through suffering, but simply because good things belong in your life.',
      },
      {
        id: 'gd-2',
        message:
          "Ride that wave! When your energy is bright, it ripples out. Share a high five, put on that banger song, and enjoy being alive in this moment.",
        practicalTip: 'Share a tiny piece of your good vibe: pay someone a genuine compliment or send someone a cheerful note.',
        surpriseTitle: 'Bottle the sunshine',
        surpriseAction: 'Store sunshine',
        surpriseContent: 'Sunshine token saved! You can withdraw this happy memory on a cloudy Tuesday later on.',
      },
      {
        id: 'gd-3',
        message:
          "Look at you thriving! Don't let your brain say 'oh no, when will the other shoe drop?' Just enjoy this shoe. It’s a great shoe. Walk around in it.",
        practicalTip: 'Treat yourself to something small you love: your favorite snack, a leisurely stroll, or an extra chapter of a book.',
        surpriseTitle: 'Friend toast',
        surpriseAction: 'Raise a glass',
        surpriseContent: 'Here is to good days, easy breaths, good snacks, and having you as a friend in this world!',
      },
      {
        id: 'gd-4',
        message:
          "Celebrate the smooth moments. When everything clicks, it feels effortless, but it’s built on all the resilience you’ve cultivated along the way.",
        practicalTip: 'Jot down one sentence in your notes about what went right today so future-you can read it.',
        surpriseTitle: 'Golden badge',
        surpriseAction: 'Claim badge',
        surpriseContent: '🏆 Awarded: "Champion of having a genuinely nice afternoon". Display proudly in your heart.',
      },
      {
        id: 'gd-5',
        message:
          "I am so thrilled you are feeling good today! Let the feeling stretch out. Do something fun just for the pure joy of it.",
        practicalTip: 'Put on your all-time favorite track and dance or tap your steering wheel with zero shame.',
        surpriseTitle: 'Friend cheer',
        surpriseAction: 'High five!',
        surpriseContent: '✋ *Virtual crisp high-five with satisfying acoustic snap* Keep being wonderful!',
      },
    ],
  },
];
