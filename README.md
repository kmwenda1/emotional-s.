# 🌧️ The Little Happy Place — A Gentle Rainy Night Sanctuary

> *"Made to make your day a little lighter. One little step at a time."*

A complete, responsive, personalized digital sanctuary designed as a thoughtful gift for friends to visit whenever they feel sad, stressed, lonely, overwhelmed, unmotivated, or simply need a quiet nocturnal haven.

---

## 🚪 Single Hosted URL with Personalized Entry Gate

Rather than sending clunky custom query links, you can share a single, clean hosted website URL (e.g. `https://the-little-happy-place.vercel.app`). 

### How It Works for Visitors:
1. **First-Time Arrival (The Sanctuary Gate):**
   - When any friend opens the site, a gentle welcoming gate asks:
     - **Name / Nickname:** *"What should we call you tonight?"*
     - **Check-In Question:** *"How is your spirit feeling as you step out of the rain tonight?"*
       - 🌧️ *A little sad or heavy*
       - 🌀 *Overthinking again*
       - ⚡ *Stressed & overwhelmed*
       - 🌱 *Low energy & unmotivated*
       - 🫂 *Feeling a little lonely*
       - ✨ *Actually having a good day*
     - **Night Vibe:** Choice of ambient theme palette.
2. **Instant Personalization:**
   - If you (the creator) already pre-configured a profile/note for that name (e.g. *Alex*, *Sam*, *Taylor*), the site automatically links their custom note and settings.
   - If they are a new friend, it dynamically creates a personalized sanctuary on the fly.
   - Their mood check-in question directly opens the appropriate comfort card on their homepage.
3. **Session Persistence & Total Privacy:**
   - The visitor's device remembers who they are locally in `localStorage`, so every future visit greets them directly without re-asking.
   - **Privacy Shield:** A visitor only ever sees their own name. Other friends' names and notes are completely invisible.
   - Anyone can switch who is visiting anytime by tapping `"(Not [Name]? Switch)"` in the banner or navbar.
4. **Creator Mode:**
   - Tapping the discreet lock icon in the top bar (passcode `friend`) lets you view all friend profiles, add custom notes, and edit settings.

---

## ☁️ How to Host for Free (Zero Cost)

### Option 1: Vercel (Recommended - Takes 1 Minute)
1. Push this folder to a GitHub repository (public or private).
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Vercel automatically detects the Vite React framework and the included `vercel.json`.
4. Click **Deploy** — your live link is generated immediately!

Alternatively, deploy directly from your terminal:
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
1. Drag and drop the `dist/` folder to [Netlify Drop](https://app.netlify.com/drop), or connect your GitHub repo.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. The included `netlify.toml` automatically handles SPA routing.

### Option 3: Cloudflare Pages
1. Connect your GitHub repository to Cloudflare Pages.
2. Build command: `npm run build`
3. Build output directory: `dist`

---

## 🌙 Atmospheric Features & Tools

1. **Active Falling Rain & Splashes:**
   - Real-time HTML5 Canvas particle simulation with wind-driven raindrops and ground puddle ripples.
   - Multi-intensity control (**Gentle**, **Steady**, **Storm ⚡**, and **Off**).
2. **Zero-Dependency Synthesized Audio:**
   - Continuous ambient rain soundscape & optional distant thunder rumbles synthesized entirely via browser Web Audio API (zero audio files needed, works offline).
3. **Playful Custom Cursor & Stardust:**
   - Umbrella/star pointer with trailing stardust/rain mist particles and water ripples on click.
4. **Night Sky Lanterns:**
   - Type a worry, frustration, or gentle hope and release it as a glowing lantern floating up into the dark clouds.
5. **Interactive Mood Check-In:**
   - 8 distinct moods with 5+ non-romantic, supportive, occasionally humorous messages and practical next steps.
6. **The Wheel of Randomness:**
   - Canvas-based spinning wheel with 8 low-pressure activities and a dismiss option.
7. **"Open When..." Letters:**
   - 9 heartfelt friendship envelopes with interactive modal letter reader.
8. **Tiny Wins Tracker:**
   - Celebrate small milestones (*Got out of bed*, *Drank water*, etc.) with zero guilt, streaks, or scores.
9. **Mini Reset Corner:**
   - Visual breathing guide (Box Breathing, Gentle Flow, 4-7-8 Deep Relaxation), 5-minute guided step sequence, and a private "Shred & Release" brain dump.

---

## 🛠️ Development & Build Commands

```bash
# Start local dev server with hot reload
npm run dev

# TypeScript type check and production build
npm run build

# Preview production build locally
npm run preview
```
