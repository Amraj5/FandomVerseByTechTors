## 1.9 Project Deliverables — Documentation

### Project Report

#### Problem Definition

Our team chose **FandomVerse** because most members were well-versed in pop culture and the categories surrounding it — anime, gaming, movies, TV shows, K-pop, comics, and manga. This shared domain knowledge allowed us to design authentic data structures and user flows that reflect how fans actually explore content.

Before finalizing the project, we researched existing platforms for inspiration. We examined minimalist, content-first sites like **Archive of Our Own (AO3)** and **Fandom.com**, analyzing their information architecture and visual patterns. The design pattern that best fit our multi-category, card-heavy requirements was the **bento grid** — a modular layout that stacks images and information like a bento box, allowing heterogeneous content (characters, articles, polls) to coexist in a scannable, responsive grid.

For the color scheme, we wanted something energetic and playful that reinforced the fandom vibe. Each category receives its own **accent color** (Anime: #A855F7, Gaming: #22D3EE, Movies: #F59E0B, TV Shows: #FB7185, K-pop: #EC4899, Comics: #EF4444, Manga: #E5E5E5), applied dynamically via CSS custom properties (`--accent`) so every hub, card, and detail page feels distinct while sharing a unified design system.

---

#### Technical Approach & Architecture

As we mapped out the flowcharts and data structures, it became clear that **data modeling** would be more critical than the UI itself — reusable components are only as good as the data feeding them. We chose **React.js** (with Vite) for three reasons:

1. **Component reusability** — Card, FilterBar, and Page components compose into any view via `.map()` over JSON.
2. **Familiarity** — The team had prior React experience, reducing ramp-up time.
3. **Modular data loading** — Static JSON files can be split by domain and loaded on demand.

**Data Strategy: Modular JSON over Monolith**

Our initial idea was a single large JSON file. We abandoned it because:
- Bundle size would penalize initial load.
- Searching/filtering across unrelated entities (e.g., characters + polls) would require client-side partitioning anyway.
- Maintaining one file creates merge conflicts in team workflows.

Instead, we split data into **separate JSON files per domain**:
- `characters.json` — 30 profiles with `id`, `slug`, `category`, `franchise`, `traits`, `relatedCharacters`
- `articles.json` — 7 editorial pieces with `slug`, `sections[]`, `heroImage`, `tags`
- `polls.json` — 14 polls with `id`, `options[]`, `totalVotes`

**Relationships are explicit via foreign keys:**
- **Slugs** — URL-safe identifiers (`gojo-satoru`, `bojack-horseman-retrospective`) used in routes (`/characters/:slug`, `/articles/:slug`).
- **Category** — Top-level taxonomy (`anime`, `gaming`, etc.) for hub routing (`/category/:category`).
- **IDs** — Stable internal keys for bookmarks and cross-references (`char-anime-001`, `poll-003`).

This structure keeps each file small, cacheable, and independently editable.

---

#### Task Distribution

| Member | Responsibilities |
|--------|------------------|
| **Member A** | Datasets (characters, articles, polls), chatbot rules, quick guides, bookmark functionality |
| **Member B** | Universal navbar & footer, dummy login/signup flows, global layout wrapper |
| **Member C** | Single-use pages: Contact, About, Merchandise listing, Cart |
| **Member D** | Hero carousel, home page assembly, featured stats section |
| **Member E** | Reusable card modules (ArticleCard, MerchandiseCard), individual merchandise detail page |

---

#### Implementation Highlights

- **Agnostic `useFilters` hook** — One implementation powers search, category filter, sort (recent/popular/alphabetical), time-range, and "bookmarked only" across Characters, Polls, Articles, and Category tabs.
- **`useBookmarks` hook** — Persists a `Set<id>` to `localStorage`; global nav badge updates in real time.
- **Per-category theming** — `--accent` set inline from data; `color-mix()` generates chip backgrounds, hover states, and borders automatically.
- **Editorial article layout** — Sections support paragraphs, headings, captioned images, and pull quotes with accent-colored left borders.
- **Poll visualization** — Ranked bars with vote counts and percentages, colored by category accent.
- **Zero-runtime CSS** — No UI library; ~3 KB gzipped custom properties + utility classes.

---

#### Test Data

| Dataset | Count | Categories Covered |
|---------|-------|-------------------|
| Characters | 30 | 5 per category |
| Articles | 7 | tvshows, manga, anime, gaming, movies, kpop, comics |
| Polls | 14 | 2 per category |

Test scenarios validated: category filtering, keyword search, bookmark persistence, cross-navigation bookmark sync, independent tab filter state in CategoryHub, and home navigation from all pages.

---

#### Installation Instructions

```bash
# Prerequisites: Node.js ≥ 18, npm ≥ 9
git clone <repository-url>
cd fandomverse
npm install
npm run dev          # http://localhost:5173
npm run build        # Production build → /dist
npm run preview      # Preview production build
```

No environment variables required. All content is static JSON in `src/data/`.

---

#### Assumptions

1. No backend/auth — bookmarks use `localStorage` only.
2. Static JSON content — no CMS integration.
3. Images hosted externally (MyAnimeList, TMDB, PlayStation CDN).
4. Client-side filtering — suitable for < 500 items per type.
5. Modern browsers only (CSS `color-mix()`, custom properties, grid).
6. English-only, no i18n.
7. SPA — React Router, no SSR.
7. Accessibility baseline (semantic HTML, ARIA labels) — not WCAG 2.1 AA audited.
8. Team workflow: data files edited directly; no admin UI.

---

*End of Documentation*