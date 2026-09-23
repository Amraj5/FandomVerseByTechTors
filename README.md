# FandomVerseByTechTors
## FandomVerse 🎬🎮📖
 
A single-page portal that pulls anime, gaming, movies, TV, K-pop, comics, and manga into one place — because right now, staying updated on even one fandom means bouncing between five different tabs. FandomVerse tries to fix that.
 
Built for **Techwiz 7 – Web Innovation Unleashed** (Aptech).
 
---
 
### What this actually is
 
Seven fandom categories, each with its own hub — articles, character profiles, trailers, image galleries, events, and a merch showcase (browse-only, no real checkout). There's a global search that works across everything, a chatbot that answers FAQs and points you to the right page, and a bookmarking system so you can save what you care about without needing an account.
 
No backend. No database. Content is pre-populated in JSON/TXT files and rendered client-side — this was a deliberate constraint from the brief, not a shortcut.
 
---
 
### Design system — why it looks the way it does
 
We didn't want to just pick "a style." Seven very different fandoms sharing one layout needed something that could stay consistent while still letting each category feel like itself. Here's what we landed on and why:
 
**Bento grid** carries the structure. The landing page and category hubs have a lot of different content types competing for space — featured articles, trending content, trailers, events — and bento's variable-sized cells let us rank things by importance instead of listing everything with equal weight.
 
**Dark theme as the base**, with real color tokens rather than just "dark mode":
- Background: `#0D0D14`
- Surface: `#16161F`
- Elevated surface: `#1E1E2A`
- Primary text: `#F2F2F7`
- Secondary text: `#A0A0B0`
**Glass — but only in two places**: the nav bar and the chatbot panel. Both already sit above scrolling content, so the frosted effect is doing real work, not just decoration. Blur is capped at 8px (not the usual 20px+) to keep it cheap, and on anything under 768px wide it drops to a flat translucent fill with no blur at all — mobile devices and Lighthouse punish heavy blur, so this was the safest trade.
 
**One accent color per category**, swapped through a single CSS variable — nothing about the layout changes between hubs, just the accent:
 
| Category | Accent |
|---|---|
| Anime | `#A855F7` |
| Gaming | `#22D3EE` |
| Movies | `#F59E0B` |
| TV Shows | `#FB7185` |
| K-Pop | `#EC4899` |
| Comics | `#EF4444` |
| Manga | `#E5E5E5` |
 
**Editorial layout for reading surfaces.** Article pages and character profile pages break from the bento/dark energy on purpose — generous line-height, a ~720px max reading width, quieter chrome. Long-form reading needs a different rhythm than browsing does. Think of it like YouTube's homepage versus its watch page.
 
**Motion is doing more work than any extra visual style would.** Card hover lifts, staggered fade-ins on bento cells, short route transitions between views. Since the deliverable includes a demo video, this is where quality actually shows — a static screenshot can't show glassmorphism, but it will absolutely show if the UI feels janky.
 
**What we deliberately left out:** neumorphism (too low-contrast to pass an accessibility audit without fighting the whole aesthetic), heavy aurora gradients everywhere (contrast risk, expensive to repaint across seven hubs), and brutalism (fights both "media-rich" and the bento grid's whole point, which is guiding the eye by size and softness — not flattening everything to the same visual weight).
 
The rule we kept coming back to for every decision: **does this help someone find content faster?** If not, it didn't make the cut.
 
---
 
### Tech stack
 
- REACTJS
- JSON/TXT files for content (no server-side storage, per the brief's constraints)
- Chatbot: pre-scripted Q&A dataset, no live external AI service
- Bookmarks: browser `localStorage`; session notes in `sessionStorage`
---
 
## Getting it running locally
 
```bash
# clone the repo
git clone <repo-url>
cd fandomverse
 
# install dependencies
npm install
 
# run locally
npm start
```
 
Open `http://localhost:3000` (or whatever port your dev server defaults to).
 
No environment variables, no API keys, no backend setup needed — everything reads from the local JSON files in `/data`.
 
---
 
## Project structure
 
```
/src
  /components     — reusable UI (bento cell, card, chatbot widget, nav)
  /pages          — Home, category hubs, article detail, character profile, search, cart, about, contact
  /data           — JSON content per category
  /styles         — design tokens, theme variables
/public
```
 
---
 
### Assumptions made
 
- Login/signup buttons are UI-only per the brief — they don't authenticate anyone.
- The shopping cart calculates a running total client-side but has no real checkout or payment flow.
- The visitor counter is simulated with `localStorage`, not real traffic data.
- All images and illustrations are original, royalty-free, or AI-generated for this project — nothing copyrighted is used without a license.
---
 
###AI tools used
 
In line with the competition's disclosure requirement: (Claude, DeepSeek, Kimi) were used for design direction, UI/UX discussion, and code assistance during development. All final implementation, structure, and logic decisions were made and understood by the team, and we can walk through any part of the codebase on request.
 
---
 
### Team
-  *OBASANJO ADAM*
  
-  *Tella Obaloluwa*
  
-  *Israel Tuyife*
  
-  *Abdulkabir Pelumi Ajiboye*
  
- *Azeezat Okunola*
---
 
Built for Techwiz 7, Aptech Limited
