# Ocean Explorer — Discover the Blue

An immersive, ocean-themed interactive marine-life field guide built with React, TypeScript, and Vite. Users can explore species profiles, filter by ocean zone and creature type, save favorites, record discoveries, and complete an educational quiz.

## Problem statement
Ocean ecosystems are fascinating but can feel inaccessible to learners. Ocean Explorer offers an engaging, structured way to discover marine species and learn introductory facts about their habitats and adaptations.

## Target users
Students, curious learners, and people interested in marine life and ocean conservation.

## Key features
- Responsive cinematic underwater interface
- Search marine species by common name, scientific name, habitat, or type
- Filter by ocean zone and species category
- Detailed species profiles with habitat, depth, diet, conservation label, and a fact
- Save favorite species
- Mark species as discovered and track exploration progress
- Five-question quiz with answer feedback, score, and personal best
- Browser persistence through localStorage
- Input empty states, confirmation before resetting progress, and graceful handling of malformed stored data

## Tech stack
- React 18
- TypeScript
- Vite
- CSS
- Browser localStorage

## Architecture
- `src/data.ts`: curated sample species, ocean zones, and quiz questions
- `src/types.ts`: TypeScript domain types
- `src/App.tsx`: UI, navigation, filtering, discovery/favorites state, quiz logic, persistence
- `src/styles.css`: responsive layout, theme, and components

The app is a client-side single-user demo. localStorage is browser-specific and is not shared across devices or users. No authentication or backend is included.

## Local setup
Requires Node.js (prefer a current LTS release) and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Production build

```bash
npm run build
npm run preview
```

The production output is written to `dist/`.

## Deployment
Deploy this repository to Vercel or Netlify using the Vite preset:
- Build command: `npm run build`
- Output directory: `dist`

After deployment, open the public URL in a private/incognito window to confirm access.

## Data and attribution notes
- Species profiles are introductory educational summaries, not a substitute for current scientific or conservation databases.
- Images are loaded from Unsplash image URLs and require an internet connection. Replace them with locally licensed images if needed.
- Google Fonts are loaded externally; system fallbacks are defined.
- Review species image matching, conservation labels, depth ranges, and facts before final academic submission.

## Suggested demo walkthrough (3–5 minutes)
1. Introduce the problem and the intended users.
2. Search for a species and filter by habitat/type.
3. Open a profile and explain the field notes and discovery action.
4. Save a favorite, refresh, and show the browser-persisted field journal.
5. Complete the quiz and show score feedback.
6. Visit Ocean Zones and the field journal.
7. Close with the stack and architecture.

## End-term submission checklist
- [ ] Verify all key workflows in the browser
- [ ] Run `npm run build` and fix any errors
- [ ] Push source code to GitHub with meaningful commits
- [ ] Deploy and verify the public URL
- [ ] Record and upload a 3–5 minute demo
- [ ] Complete the official submission form
