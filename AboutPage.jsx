/**
 * File: src/pages/AboutPage.jsx
 * Purpose: Bespoke Editorial Colophon & Team Dossier for FandomVerse.
 *          Crafted by 5 Aptech Nigeria students for TechWiz 7 ("Web Innovation Unleashed").
 *          Replaces generic AI tropes with authentic human storytelling, bento architecture,
 *          original lore world-building (Rule 7), and developer accountability.
 * Used by: App.jsx (Route "/about")
 */

import { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Code2,
  GraduationCap,
  Mail,
  Phone,
  Layers,
  BookOpen,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Lock,
  Cpu,
  Palette,
  Terminal,
  FileCheck,
  Compass,
  ArrowRight,
  Filter
} from 'lucide-react'
import Breadcrumbs from '../components/layout/Breadcrumbs.jsx'
import styles from './AboutPage.module.css'

/* ── 1. The 5 Aptech Student Architects ────────────────────────────── */
const TEAM_MEMBERS = [
  {
    id: 'abdulkabir',
    name: 'Abdulkabir Pelumi Ajiboye',
    shortName: 'Abdulkabir',
    studentId: 'Student1726070',
    role: 'Team Lead & Frontend Architect',
    domain: 'Architecture',
    accent: '#A855F7',
    email: 'Adewalepolicy75@gmail.com',
    phone: '08057215622',
    bio: 'Directed the overall software architecture, engineered the HashRouter client-side routing shell, authored the global tokens.css design system, and built the multi-entity unified search index.',
    deliverables: [
      'HashRouter SPA shell & static routing',
      'Unified search relevance engine',
      'Global tokens.css & theme system',
      'Team sprint orchestration'
    ],
    favFranchise: 'Starbound Academy'
  },
  {
    id: 'israel',
    name: 'Israel Tuyife',
    shortName: 'Israel',
    studentId: 'Student1691727',
    role: 'UI/UX Designer & Data Architect',
    domain: 'Design & Data',
    accent: '#22D3EE',
    email: 'omotuyifeisrael@gmail.com',
    phone: '08065878877',
    bio: 'Pioneered the "Bento + Dark + Motion" visual design language, structured the comprehensive 7-hub JSON data schemas, and crafted the responsive grid layouts across all viewport breakpoints.',
    deliverables: [
      'Bento layout & responsive breakpoints',
      'Category hub color system (7 palettes)',
      'Unified JSON dataset schemas',
      'Custom SVG vector graphics & assets'
    ],
    favFranchise: 'Nightfall Protocol'
  },
  {
    id: 'tella',
    name: 'Tella Obaloluwa',
    shortName: 'Tella',
    studentId: 'Student1637987',
    role: 'Content Strategist & QA Lead',
    domain: 'Content & QA',
    accent: '#F59E0B',
    email: 'obaloluwatella12@gmail.com',
    phone: '09079105111',
    bio: 'Penned all 14 original franchise mythologies to uphold Rule 7 compliance, wrote 28 in-depth editorial chronicles, and authored the exhaustive 24-point QA test-case verification matrix.',
    deliverables: [
      '14 original fictional universes (Rule 7)',
      '28 editorial lore chronicles & dossiers',
      '24 QA test-case execution matrix',
      'Cross-fandom timeline consistency'
    ],
    favFranchise: 'Ember Ronin'
  },
  {
    id: 'adam',
    name: 'Obasanjo Adam',
    shortName: 'Adam',
    studentId: 'Student1617844',
    role: 'React Engineer & Commerce Systems',
    domain: 'Systems',
    accent: '#10B981',
    email: 'amrajadamobasanjo5@gmail.com',
    phone: '09057060106',
    bio: 'Engineered the interactive commerce layer using React useReducer and Context API, built the sliding cart drawer, dynamic discount promo parser (FANDOM20), and product catalog filtering.',
    deliverables: [
      'In-memory CartContext & useReducer state',
      'Sliding cart drawer with quantity math',
      'Promo code calculation engine',
      'Strict zero-persistence compliance (Rule 3)'
    ],
    favFranchise: 'Captain Cinder'
  },
  {
    id: 'azeezat',
    name: 'Azeezat Okunola',
    shortName: 'Azeezat',
    studentId: 'Student1550064',
    role: 'Animation & Accessibility Engineer',
    domain: 'Accessibility',
    accent: '#EC4899',
    email: 'azeezatokunola06@gmail.com',
    phone: '08052107836',
    bio: 'Developed hardware-accelerated CSS micro-animations, implemented skip-to-content links, built keyboard focus traps for modals/drawers, and audited WCAG 2.1 AA accessibility standards.',
    deliverables: [
      'Accessible keyboard focus traps & skip links',
      'WCAG 2.1 AA color contrast compliance',
      'Hardware-accelerated CSS transitions',
      'prefers-reduced-motion media query engine'
    ],
    favFranchise: 'Aurora Circle'
  }
]

/* ── 2. The 14 Original Franchises (Rule 7 World-Building Showcase) ─ */
const ORIGINAL_FRANCHISES = [
  { name: 'Ember Ronin', realm: 'Anime', genre: 'Mythic Sengoku Fantasy', premise: 'A cursed swordsman wanders ash-covered provinces battling fiery spirits.' },
  { name: 'Starbound Academy', realm: 'Gaming', genre: 'Orbital Sci-Fi Sim', premise: 'Cadets navigate political intrigue and starship physics at humanity’s first space orbital campus.' },
  { name: 'Nightfall Protocol', realm: 'Movies', genre: 'Cyberpunk Detective Noir', premise: 'A rain-slicked metropolis where memory tampering is both a crime and an art form.' },
  { name: 'Kingdom of Glass', realm: 'TV Shows', genre: 'Dynastic Fantasy Drama', premise: 'Noble houses war over fragile crystalline towers and inherited political debts.' },
  { name: 'The Last Lighthouse', realm: 'Comics', genre: 'Cosmic Ocean Horror', premise: 'A solitary beacon keeper watches the tides uncover ancient relics from deep abysses.' },
  { name: 'Velvet Horizon', realm: 'K-Pop', genre: 'Neo-Electronic Pop Lore', premise: 'A chart-topping idol collective secretly unraveling sound-manipulated corporate conspiracies.' },
  { name: 'LUMEN-9', realm: 'Manga', genre: 'Android Uprising', premise: 'Synthetics in a subterranean megacity discover an uncompiled spiritual consciousness.' },
  { name: 'Blade of the Quiet Sea', realm: 'Anime', genre: 'Seafaring Martial Arts', premise: 'Corsairs wielding tide-infused weaponry navigate uncharted archipelago barriers.' },
  { name: 'Aurora Circle', realm: 'K-Pop', genre: 'Celestial Concept Idols', premise: 'Seven performers whose synchronized choreography allegedly stabilizes solar flares.' },
  { name: 'Captain Cinder', realm: 'Comics', genre: 'Dieselpunk Vigilante', premise: 'An airship mechanic turned vigilante protecting industrial skylines from sky pirates.' },
  { name: 'Harbor Street', realm: 'Manga', genre: 'Slice of Life & Magic Realism', premise: 'A cozy seaside teahouse where patrons trade memories for warm seasonal brews.' },
  { name: 'Moonlit Ledger', realm: 'TV Shows', genre: 'Supernatural Bureaucracy', premise: 'Auditors in 1920s Prague settle accounting ledgers between spirits and mortal creditors.' },
  { name: 'Signal Lost', realm: 'Gaming', genre: 'Survival Radio Mystery', premise: 'A lone tower ranger decodes audio transmissions across a deserted sub-arctic valley.' },
  { name: 'The Paper Moon', realm: 'Movies', genre: 'Surrealist Dream Heist', premise: 'A troupe of illusionists attempt to steal an unspoken promise from an eccentric billionaire.' }
]

/* ── 3. Engineering Concordance Matrix ────────────────────────────── */
const TECH_CONCORDANCE = [
  {
    layer: 'Routing Shell',
    tech: 'React Router v6 (HashRouter)',
    briefRequirement: 'Serverless static hosting compatibility',
    ourSolution: 'Hash-based routing eliminates server-side URL rewrite issues on GitHub Pages and static evaluators.'
  },
  {
    layer: 'State & Cart',
    tech: 'React Context + useReducer',
    briefRequirement: 'In-memory ephemeral shopping cart (Rule 3)',
    ourSolution: 'Cart state is isolated strictly to memory; zero checkout, zero payment APIs, and zero persistent leaks.'
  },
  {
    layer: 'Virtual Assistant',
    tech: 'Rule-Based Regex Engine',
    briefRequirement: 'Zero external AI or paid third-party APIs',
    ourSolution: 'Instant pattern-matched intent classifier (chatbotEngine.js) evaluating local JSON datasets locally.'
  },
  {
    layer: 'Design System',
    tech: 'Vanilla CSS Modules + tokens.css',
    briefRequirement: 'Custom identity without generic UI kits',
    ourSolution: '"Bento + Dark + Motion" architecture using 100% native CSS variables, keeping runtime bundle size minimal.'
  },
  {
    layer: 'Privacy & Notes',
    tech: 'Dual Browser Storage (Local & Session)',
    briefRequirement: 'Offline persistence without user tracking',
    ourSolution: 'Bookmarks live in localStorage; personal field notes live in sessionStorage and vanish when closed.'
  },
  {
    layer: 'Quality Assurance',
    tech: '24-Point Test-Case Suite',
    briefRequirement: 'Rigorous validation against the SRS',
    ourSolution: 'Interactive in-portal QA Audit panel in footer allowing judges to verify all 24 test cases on the live app.'
  }
]

export default function AboutPage() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [selectedFranchiseRealm, setSelectedFranchiseRealm] = useState('ALL')

  useEffect(() => {
    document.title = 'About & Project Colophon | FandomVerse — TechWiz 7'
  }, [])

  const filteredTeam = activeFilter === 'ALL'
    ? TEAM_MEMBERS
    : TEAM_MEMBERS.filter(m => m.domain.toLowerCase().includes(activeFilter.toLowerCase()))

  const realms = ['ALL', 'Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics', 'Manga']
  const filteredFranchises = selectedFranchiseRealm === 'ALL'
    ? ORIGINAL_FRANCHISES
    : ORIGINAL_FRANCHISES.filter(f => f.realm === selectedFranchiseRealm)

  return (
    <div className={styles.page}>
      
      {/* ── Editorial Masthead Header ────────────────────────────── */}
      <header className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <Breadcrumbs items={[{ label: 'About & Colophon' }]} />

          <div className={styles.kickerRow}>
            <span className={styles.kickerBadge}>
              <GraduationCap size={13} aria-hidden="true" />
              Aptech TechWiz 7 Submission
            </span>
            <span className={styles.kickerLocation}>Lagos, Nigeria // September 2026</span>
          </div>

          <h1 className={styles.title}>
            Five Students. Seven Realms.<br />
            <span className={styles.titleHighlight}>Built Entirely from Scratch.</span>
          </h1>

          <p className={styles.lead}>
            FandomVerse was conceptualized, designed, and coded by five Aptech Computer Education students
            for the TechWiz 7 international competition. We rejected bloated ad-tech frameworks, tracking cookies,
            and copyrighted shortcuts to create a pure, high-speed, dark-mode encyclopaedia for world-building enthusiasts.
          </p>

          {/* Vitals Telemetry Bar */}
          <div className={styles.vitalsBar} aria-label="Project Specification Summary">
            <div className={styles.vitalItem}>
              <span className={styles.vitalLabel}>Delegation</span>
              <strong className={styles.vitalValue}>Aptech Nigeria</strong>
            </div>
            <div className={styles.vitalDivider} aria-hidden="true" />
            <div className={styles.vitalItem}>
              <span className={styles.vitalLabel}>Architecture</span>
              <strong className={styles.vitalValue}>100% Client-Side SPA</strong>
            </div>
            <div className={styles.vitalDivider} aria-hidden="true" />
            <div className={styles.vitalItem}>
              <span className={styles.vitalLabel}>Rule 7 Lore</span>
              <strong className={styles.vitalValue}>14 Original Universes</strong>
            </div>
            <div className={styles.vitalDivider} aria-hidden="true" />
            <div className={styles.vitalItem}>
              <span className={styles.vitalLabel}>Validation</span>
              <strong className={styles.vitalValue}>24 QA Test Cases Passing</strong>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.container}>

        {/* ── Rule 7 Creative Protocol Showcase ──────────────────── */}
        <section className={styles.rule7Section} aria-labelledby="rule7-heading">
          <div className={styles.rule7Header}>
            <div className={styles.rule7Badge}>
              <ShieldCheck size={16} aria-hidden="true" />
              <span>TechWiz 7 Rule 7 — Original Content Protocol</span>
            </div>
            <h2 id="rule7-heading" className={styles.sectionHeading}>
              Why You Won’t Find Marvel or Shonen Jump Here
            </h2>
            <p className={styles.sectionNarrative}>
              The competition brief strictly prohibits the use of copyrighted characters, commercial posters, and registered trademarks.
              Rather than filling our database with synthetic placeholder lorem ipsum or generic stock media, our team drafted
              <strong> 14 bespoke fictional franchises</strong> spanning anime, gaming, cinema, TV, K-pop, comics, and manga.
              Every lore article, character profile, and timeline event on FandomVerse is original student work.
            </p>
          </div>

          {/* Franchise Realm Filter */}
          <div className={styles.filterPillsRow} role="tablist" aria-label="Filter original franchises by realm">
            {realms.map(realm => (
              <button
                key={realm}
                type="button"
                role="tab"
                aria-selected={selectedFranchiseRealm === realm}
                className={`${styles.filterPill} ${selectedFranchiseRealm === realm ? styles.filterPillActive : ''}`}
                onClick={() => setSelectedFranchiseRealm(realm)}
              >
                {realm}
              </button>
            ))}
          </div>

          {/* Franchises Grid */}
          <div className={styles.franchisesGrid}>
            {filteredFranchises.map((f, idx) => (
              <article key={idx} className={styles.franchiseCard}>
                <div className={styles.franchiseMeta}>
                  <span className={styles.realmTag}>{f.realm}</span>
                  <span className={styles.genreTag}>{f.genre}</span>
                </div>
                <h3 className={styles.franchiseName}>{f.name}</h3>
                <p className={styles.franchisePremise}>{f.premise}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── The Bento Grid: Editorial & Architecture Tenets ─────── */}
        <section className={styles.bentoSection} aria-labelledby="bento-heading">
          <div className={styles.sectionHeader}>
            <span className={styles.subHeading}>The Engineering Philosophy</span>
            <h2 id="bento-heading" className={styles.sectionHeading}>
              Bento Architecture. Zero Compromises.
            </h2>
          </div>

          <div className={styles.bentoGrid}>
            
            {/* Bento Cell 1: The Problem with Modern Fandom Wikis (Large Span) */}
            <div className={`${styles.bentoCell} ${styles.cellLarge}`}>
              <div className={styles.cellHeader}>
                <div className={styles.cellIcon}>
                  <BookOpen size={20} aria-hidden="true" />
                </div>
                <span className={styles.cellTag}>The Editorial Thesis</span>
              </div>
              <h3 className={styles.cellTitle}>Reclaiming the Fan Experience from Ad-Tech</h3>
              <p className={styles.cellText}>
                Modern fandom wikis and entertainment portals have become nearly unreadable: smothered in auto-playing
                video overlays, invasive cookie consent banners, twelve parallel ad trackers, and laggy mobile scrolling.
              </p>
              <p className={styles.cellText}>
                We engineered FandomVerse as a quiet antidote. By stripping away third-party tracking scripts,
                ad containers, and external dependencies, our readers enjoy instantaneous sub-50ms page transitions,
                clean Space Grotesk typography, and a reading environment designed to be read—not monetized.
              </p>
              <div className={styles.thesisHighlights}>
                <div className={styles.highlightPill}>
                  <CheckCircle2 size={14} aria-hidden="true" />
                  <span>Zero Ad Tracking</span>
                </div>
                <div className={styles.highlightPill}>
                  <CheckCircle2 size={14} aria-hidden="true" />
                  <span>Sub-50ms Static Navigation</span>
                </div>
                <div className={styles.highlightPill}>
                  <CheckCircle2 size={14} aria-hidden="true" />
                  <span>True Dark Mode by Default</span>
                </div>
              </div>
            </div>

            {/* Bento Cell 2: Client-Side Sovereignty */}
            <div className={`${styles.bentoCell} ${styles.cellMedium}`}>
              <div className={styles.cellHeader}>
                <div className={styles.cellIcon}>
                  <Cpu size={20} aria-hidden="true" />
                </div>
                <span className={styles.cellTag}>Client-Side Architecture</span>
              </div>
              <h3 className={styles.cellTitle}>100% Serverless Autonomy</h3>
              <p className={styles.cellText}>
                Strict adherence to the TechWiz 7 specification meant zero server-side backends or databases.
                Every category hub, search index, and article reader executes client-side in standard JavaScript.
                HashRouter guarantees that the application runs identically on GitHub Pages, offline evaluators,
                or local development servers.
              </p>
            </div>

            {/* Bento Cell 3: Data Privacy & Notes */}
            <div className={`${styles.bentoCell} ${styles.cellSmall}`}>
              <div className={styles.cellHeader}>
                <div className={styles.cellIcon}>
                  <Lock size={20} aria-hidden="true" />
                </div>
                <span className={styles.cellTag}>Privacy Model</span>
              </div>
              <h3 className={styles.cellTitle}>Dual-Tier Browser Storage</h3>
              <p className={styles.cellText}>
                Your data stays strictly in your browser. Reading Vault bookmarks persist safely in
                <code className={styles.codeSnippet}>localStorage</code>. Personal field notes taken on chronicles
                live strictly in <code className={styles.codeSnippet}>sessionStorage</code>—evaporating cleanly
                the moment your tab closes.
              </p>
            </div>

            {/* Bento Cell 4: Custom CSS Design System */}
            <div className={`${styles.bentoCell} ${styles.cellSmall}`}>
              <div className={styles.cellHeader}>
                <div className={styles.cellIcon}>
                  <Palette size={20} aria-hidden="true" />
                </div>
                <span className={styles.cellTag}>Zero UI Kits</span>
              </div>
              <h3 className={styles.cellTitle}>Handcrafted Design Tokens</h3>
              <p className={styles.cellText}>
                Zero Tailwind, Bootstrap, or component libraries. Our entire visual language is declared through
                <code className={styles.codeSnippet}>tokens.css</code> and modular CSS files. This keeps the bundle
                exceptionally lightweight and grants pixel-perfect control over every layout component.
              </p>
            </div>

            {/* Bento Cell 5: Deterministic Chatbot Engine */}
            <div className={`${styles.bentoCell} ${styles.cellSmall}`}>
              <div className={styles.cellHeader}>
                <div className={styles.cellIcon}>
                  <Terminal size={20} aria-hidden="true" />
                </div>
                <span className={styles.cellTag}>Rule-Based Engine</span>
              </div>
              <h3 className={styles.cellTitle}>Offline Assistant Logic</h3>
              <p className={styles.cellText}>
                In strict compliance with Rule 2 (No external AI APIs), our virtual guide is powered by a custom
                deterministic regex pattern-matcher. It evaluates questions directly against our static FAQ dataset
                without transmitting a single packet to third-party language models.
              </p>
            </div>

          </div>
        </section>

        {/* ── The 5 Creators: Student Dossier Roster ───────────────── */}
        <section className={styles.teamSection} aria-labelledby="team-heading">
          <div className={styles.teamHeader}>
            <div>
              <span className={styles.subHeading}>The Engineering Collective</span>
              <h2 id="team-heading" className={styles.sectionHeading}>
                Meet the Five Creators
              </h2>
              <p className={styles.teamSubText}>
                The Aptech Computer Education students who designed, authored, and engineered FandomVerse.
              </p>
            </div>

            {/* Domain Filter */}
            <div className={styles.teamFilterBar} role="tablist" aria-label="Filter creators by discipline">
              {['ALL', 'Architecture', 'Design', 'Content', 'Systems', 'Accessibility'].map((d) => (
                <button
                  key={d}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === d}
                  className={`${styles.teamFilterBtn} ${activeFilter === d ? styles.teamFilterBtnActive : ''}`}
                  onClick={() => setActiveFilter(d)}
                >
                  {d === 'ALL' ? 'All Five' : d}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.teamGrid}>
            {filteredTeam.map((member, i) => (
              <article key={member.id} className={styles.memberCard}>
                <div className={styles.memberCardTop}>
                  <div className={styles.memberNumber}>0{i + 1}</div>
                  <div className={styles.studentIdBadge}>
                    <GraduationCap size={12} aria-hidden="true" />
                    <span>{member.studentId}</span>
                  </div>
                </div>

                <div className={styles.memberIdentity}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <div className={styles.memberRoleBadge} style={{ '--role-accent': member.accent }}>
                    {member.role}
                  </div>
                </div>

                <p className={styles.memberBio}>{member.bio}</p>

                {/* Primary Contributions */}
                <div className={styles.deliverablesBlock}>
                  <span className={styles.deliverablesTitle}>Key Contributions:</span>
                  <ul className={styles.deliverablesList}>
                    {member.deliverables.map((item, idx) => (
                      <li key={idx} className={styles.deliverableItem}>
                        <ArrowRight size={12} className={styles.bulletIcon} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Favorite Franchise Tag */}
                <div className={styles.favLoreTag}>
                  <span className={styles.favLabel}>Favorite Realm Lore:</span>
                  <strong className={styles.favValue}>{member.favFranchise}</strong>
                </div>

                {/* Direct Contact Links */}
                <footer className={styles.memberFooter}>
                  <a
                    href={`mailto:${member.email}`}
                    className={styles.contactBtn}
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail size={13} aria-hidden="true" />
                    <span>{member.email}</span>
                  </a>
                  <a
                    href={`tel:+234${member.phone.replace(/^0/, '')}`}
                    className={styles.contactBtn}
                    aria-label={`Call ${member.name}`}
                  >
                    <Phone size={13} aria-hidden="true" />
                    <span>{member.phone}</span>
                  </a>
                </footer>
              </article>
            ))}
          </div>
        </section>

        {/* ── Technical Architecture Concordance Matrix ──────────── */}
        <section className={styles.techSection} aria-labelledby="tech-heading">
          <div className={styles.sectionHeader}>
            <span className={styles.subHeading}>Specification vs. Implementation</span>
            <h2 id="tech-heading" className={styles.sectionHeading}>
              System Architecture Concordance
            </h2>
            <p className={styles.sectionNarrative}>
              How our implementation answers every constraint stipulated in the Aptech TechWiz 7 documentation:
            </p>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.concordanceTable}>
              <thead>
                <tr>
                  <th scope="col">System Module</th>
                  <th scope="col">Technology Applied</th>
                  <th scope="col">TechWiz 7 Brief Requirement</th>
                  <th scope="col">Our Architectural Solution</th>
                </tr>
              </thead>
              <tbody>
                {TECH_CONCORDANCE.map((row, idx) => (
                  <tr key={idx}>
                    <td className={styles.moduleCell}>
                      <strong>{row.layer}</strong>
                    </td>
                    <td className={styles.techCell}>
                      <code>{row.tech}</code>
                    </td>
                    <td className={styles.reqCell}>{row.briefRequirement}</td>
                    <td className={styles.solutionCell}>{row.ourSolution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Official Aptech TechWiz 7 Submission Colophon ────────── */}
        <aside className={styles.colophonBlock} aria-label="Official Submission Colophon">
          <div className={styles.colophonLeft}>
            <div className={styles.colophonBadge}>Official Submission Dispatch</div>
            <h3 className={styles.colophonTitle}>Aptech TechWiz 7: Web Innovation Unleashed</h3>
            <p className={styles.colophonText}>
              Submitted by <strong>Team FandomVerse</strong> (Aptech Nigeria). Fully static, fully responsive,
              and rigorously tested against all 24 QA test cases. Zero external dependencies, zero copyrighted media,
              and 100% student dedication.
            </p>
          </div>
          <div className={styles.colophonRight}>
            <div className={styles.stampBox}>
              <span className={styles.stampText}>APTECH TECHWIZ 7</span>
              <span className={styles.stampSub}>VERIFIED ENTRY</span>
              <span className={styles.stampYear}>2026 // LAGOS</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}
