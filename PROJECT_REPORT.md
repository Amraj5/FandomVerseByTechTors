# FandomVerse — Project Report

## 1. Problem Definition

### 1.1 Background
Modern fandom communities are fragmented across multiple platforms—wikis, social media, video sites, and forums. Fans lack a unified hub where they can discover characters, read editorial content, participate in polls, and track their interests across anime, gaming, movies, TV shows, K-pop, comics, and manga.

### 1.2 Problem Statement
There is no single platform that:
- Aggregates character profiles, articles, and community polls across major fandom categories
- Provides a consistent, reusable component architecture for content rendering
- Supports personalization (bookmarks, filters) without requiring user accounts
- Maintains performance through modular data loading and client-side filtering

### 1.3 Objectives
- Build a responsive, category-driven fandom hub with three core content types: Characters, Articles, Polls
- Implement a reusable component system (cards, pages, filters) using React
- Design a modular JSON-based data architecture with explicit relationship keys (slugs, IDs, categories)
- Deliver client-side filtering, search, and bookmarking with zero backend dependency
- Ensure accessibility, responsive design, and consistent theming per category

---

## 2. Design Specifications

### 2.1 Technology Stack
| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend Framework | React 18 (Vite) | Component reusability, fast HMR, mature ecosystem |
| Routing | React Router v6 | Declarative routing, nested routes, dynamic params |
| Styling | CSS Custom Properties + CSS Modules pattern | Theming via `--accent` per category, no runtime dependency |
| Data | Static JSON files | Zero backend, version-controllable, fast initial load |
| State | React hooks (`useState`, `useMemo`, `useEffect`) | Lightweight, no external store needed |
| Persistence | localStorage | Bookmarks survive reloads without auth |

### 2.2 Information Architecture
```
/
├── /characters                 → CharacterHub (all characters)
├── /characters/:slug           → CharacterPage (detail)
├── /polls                      → PollsHub (all polls)
├── /categories                 → CategoriesPage (overview)
├── /category/:category         → CategoryHub (tabbed: characters/articles/polls)
├── /articles/:slug             → ArticlePage (editorial)
└── /bookmarks                  → BookmarksPage (saved items)
```

### 2.3 Data Model
Each entity uses a **slug** (URL-safe identifier) as primary key. Relationships are explicit via foreign-key fields.

**Character**
```json
{
  "id": "char-anime-001",
  "slug": "gojo-satoru",
  "category": "anime",
  "franchise": "Jujutsu Kaisen",
  "name": "Gojo Satoru",
  "role": "Special Grade Sorcerer",
  "image": "https://...",
  "accent": "#A855F7",
  "biography": "...",
  "traits": ["Limitless", "Six Eyes"],
  "relatedCharacters": ["char-anime-003"]
}
```

**Article**
```json
{
  "slug": "bojack-horseman-retrospective",
  "category": "tvshows",
  "title": "10 Years Later: Why BoJack Horseman Remains Unmatched",
  "publishedDate": "2026-08-14",
  "heroImage": "https://...",
  "sections": [{ "type": "paragraph", "content": "..." }]
}
```

**Poll**
```json
{
  "id": "poll-001",
  "category": "anime",
  "question": "Which Fall 2026 release are you seated for on day one?",
  "totalVotes": 14230,
  "options": [{ "id": "opt-1", "label": "...", "votes": 6820 }]
}
```

### 2.4 Component Architecture
| Component | Purpose | Reused In |
|-----------|---------|-----------|
| `ArticleCard` | Article preview link | Home, CategoryHub |
| `CharacterCard` | Character preview + bookmark | CharacterHub, CategoryHub, BookmarksPage |
| `PollCard` | Poll results visualization | PollsHub, CategoryHub, BookmarksPage |
| `FilterBar` | Unified filter UI (search, category, sort, time, bookmarks) | All hub pages |
| `CharacterPage` | Detail view with biography, traits, related | `/characters/:slug` |
| `ArticlePage` | Editorial layout with sections, pull quotes | `/articles/:slug` |

### 2.5 Theming System
- **Category accent colors** defined in `CATEGORY_CONFIG` and CSS `[data-category]` selectors
- Each page sets `--accent` via inline style from data
- `color-mix()` used for derived backgrounds (chips, badges, hover states)
- Typography: **Space Grotesk** (display), **Inter** (body) via Google Fonts

### 2.6 Filtering & Search (Agnostic Hook)
`useFilters(items, config)` accepts:
- `categoryKey`, `dateKey`, `popularityKey`, `searchKeys[]`
- `idKey` + `bookmarks` Set → enables "Show Bookmarked Only"
- Returns `{ filters, filteredItems, categories, setters }`

### 2.7 Bookmarking
- `useBookmarks()` hook manages a `Set<string>` in localStorage
- Keys: character `id`, article `slug`, poll `id`
- UI: bookmark button on every card; `/bookmarks` page groups by type

---

## 3. Diagrams

### 3.1 User Flow Flowchart
```
[Home] 
   │
   ├─→ [Categories] ──→ [Category/:cat] ──→ (Characters | Articles | Polls tabs)
   │                        │
   │                        ├─→ [Character/:slug]
   │                        ├─→ [Article/:slug]
   │                        └─→ (Poll vote view)
   │
   ├─→ [Characters] ──→ [Character/:slug]
   │
   ├─→ [Polls] ──→ (Poll detail inline)
   │
   └─→ [Bookmarks] ──→ (Grouped: Characters / Articles / Polls)
```

### 3.2 Data Flow Diagram
```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  JSON Files │────▶│  React App   │────▶│  Browser Render │
│ (characters,│     │  (Components)│     │  (DOM + State)  │
│  articles,  │     │  + Hooks     │     │                 │
│  polls)     │     │              │     │  ┌───────────┐  │
└─────────────┘     └──────────────┘     │  │ localStorage  │
       ▲                                   │  │ (Bookmarks) │  │
       │                                   │  └───────────┘  │
       │            User Actions           └─────────────────┘
       └──────────────────────────────────────────────────────
                    (Filter, Search, Bookmark, Navigate)
```

### 3.3 Component Hierarchy
```
App
├── Header (Nav + Bookmark Badge)
├── Routes
│   ├── Home
│   │   ├── Hero Stats
│   │   ├── Article Cards Grid
│   │   └── Quick Links
│   ├── CharacterHub
│   │   ├── FilterBar
│   │   └── CharacterCard[] → CharacterPage
│   ├── PollsHub
│   │   ├── FilterBar
│   │   └── PollCard[]
│   ├── CategoriesPage
│   │   └── CategoryCard[] → CategoryHub
│   ├── CategoryHub
│   │   ├── CategoryTabs
│   │   ├── FilterBar (per tab)
│   │   ├── CharacterCard[]
│   │   ├── ArticleCard[]
│   │   └── PollCard[]
│   ├── ArticlePage
│   ├── CharacterPage
│   └── BookmarksPage
│       ├── Breadcrumbs
│       ├── CharacterCard[] (bookmarked)
│       ├── ArticleCard[] (bookmarked)
│       └── PollCard[] (bookmarked)
└── Footer
```

---

## 4. Test Data Used

### 4.1 Characters (30 entries)
- 5 Anime (Jujutsu Kaisen, Demon Slayer, Apothecary Diaries, One Piece)
- 5 Gaming (God of War, LoL/Arcane, RDR2, Horizon, FFXVI)
- 5 Movies (Spider-Verse, MCU, Dune, Alien, Mad Max)
- 5 TV Shows (BoJack, Invincible, Stranger Things, The Bear, Succession)
- 5 K-pop (BLACKPINK ×2, BTS, Stray Kids, NewJeans)
- 5 Comics (Batman, Wolverine, Wonder Woman, Spider-Man, Catwoman)
- 5 Manga (Berserk, Chainsaw Man, Kagurabachi, Vinland Saga, Death Note)

Each includes: image URL, biography, traits, related characters, category accent.

### 4.2 Articles (7 entries)
- BoJack retrospective, Kagurabachi milestone, Shibuya Incident explainer
- GTA VI gameplay, Spider-Verse production, BLACKPINK tour, X-Men crossover
Each includes: hero image, sections (paragraph, heading, image, quote), tags, read time.

### 4.3 Polls (14 entries)
- 2 per category covering seasonal releases, GOTY predictions, concert anticipation, art quality, binge habits, etc.
Each includes: question, total votes, options with vote counts.

### 4.4 Test Scenarios
| Scenario | Data Used | Expected Result |
|----------|-----------|-----------------|
| Filter characters by franchise | CharacterHub → FilterBar franchise chips | Grid shows only Jujutsu Kaisen chars |
| Search polls by keyword | PollsHub → "GTA" | Shows GTA VI poll only |
| Bookmark + filter | Bookmark 3 chars → enable "Bookmarked Only" | Grid shows exactly 3 |
| Category hub tabs | `/category/anime` → switch tabs | Each tab maintains independent filter state |
| Cross-navigation bookmarks | Bookmark on CharacterPage → check /bookmarks | Appears in Characters section |
| Home navigation | Any page → click logo | Returns to `/` |

---

## 5. Project Installation Instructions

### 5.1 Prerequisites
- Node.js ≥ 18.x
- npm ≥ 9.x (or pnpm/yarn)

### 5.2 Local Development
```bash
# 1. Clone repository
git clone <repository-url>
cd fandomverse

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Vite will print:  Local: http://localhost:5173/
```

### 5.3 Production Build
```bash
npm run build
# Output in /dist — deploy to any static host (Vercel, Netlify, GitHub Pages, etc.)
```

### 5.4 Preview Production Build
```bash
npm run preview
```

### 5.5 Environment
No environment variables required. All data is static JSON in `src/data/`.

---

## 6. Assumptions (ReadMe)

1. **No backend / auth** — Bookmarks use localStorage; no user accounts, no server.
2. **Static content** — Articles, characters, polls are authored in JSON; no CMS integration.
3. **Images hosted externally** — URLs point to CDN/MyAnimeList/TMDB; no local asset pipeline.
4. **Client-side only** — All filtering, search, sorting runs in browser; suitable for datasets < ~500 items per type.
5. **Category accents fixed** — Defined in code (`CATEGORY_CONFIG`); not user-customizable.
6. **Single-page app** — React Router handles navigation; no SSR.
7. **Modern browsers** — Uses CSS `color-mix()`, `:has()`, grid, custom properties (IE not supported).
8. **No internationalization** — English only; dates formatted via `toLocaleDateString`.
9. **Accessibility baseline** — Semantic HTML, ARIA labels on filters, keyboard-navigable; not WCAG 2.1 AA audited.
10. **Team workflow** — Data files edited directly; no admin UI for content management.

---

## 7. Creativity & Extensions Applied

- **Bento-grid inspired card layouts** with consistent hover/tap micro-interactions
- **Per-category theming** via CSS custom properties — each fandom feels distinct
- **Agnostic filter hook** — one implementation powers Characters, Polls, Articles, and Category tabs
- **Bookmark-first UX** — persistent without auth, visible in global nav badge
- **Editorial article layout** — pull quotes, captioned figures, responsive typography scale
- **Poll visualization** — ranked bars with percentages, vote totals
- **Zero-dependency styling** — no UI library, ~3 KB gzipped CSS

---

*End of Report*