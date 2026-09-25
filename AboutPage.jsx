/**
 * File: src/pages/AboutPage.jsx
 * Purpose: Executive, pro-grade "About Us" showcase inspired by modern minimalist design (Pinterest reference).
 *          Features Obasanjo Adam prominently as Team Lead, circular portrait frames,
 *          local photo upload & persistence, spotlight carousel navigation (< >),
 *          and alternating staggered team layout.
 * Used by: App.jsx (Route "/about")
 */
import { useEffect, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  RotateCcw,
  Camera,
  Mail,
  Phone,
  GraduationCap,
  Trophy,
  ShieldAlert,
  Sparkles,
  Crown,
  Check,
  Copy,
  Plus,
  ArrowRight
} from 'lucide-react'
import Breadcrumbs from '../components/layout/Breadcrumbs.jsx'
import styles from './AboutPage.module.css'

/* ── Storage Key for Uploaded Team Avatars ───────────────────────── */
const STORAGE_KEY = 'fandomverse_real_team_avatars_v2'

/* ── Real Team Data — Obasanjo Adam (Team Lead) at #1 ────────────── */
const TEAM = [
  {
    id: 'Student1617844',
    name: 'Obasanjo Adam',
    shortName: 'Adam',
    initials: 'OA',
    studentId: 'Student1617844',
    role: 'Team Leader & Principal Systems Architect',
    isLead: true,
    email: 'amrajadamobasanjo5@gmail.com',
    phone: '09057060106',
    color: '#D9B36C', // Premium Gold
    experience: 'Team Leader • Full-Stack Systems Architecture • TechWiz 7',
    quote:
      'Spearheads overall project governance, client-side state architecture, and interactive commerce engines — steering Team FandomVerse from conceptual blueprint to an elite, competition-grade web portal.',
    specialties: ['Team Leadership', 'Systems Architecture', 'Commerce Engine', 'Code Governance']
  },
  {
    id: 'Student1726070',
    name: 'Abdulkabir Pelumi Ajiboye',
    shortName: 'Abdulkabir',
    initials: 'AP',
    studentId: 'Student1726070',
    role: 'Frontend Architect & Design Systems Lead',
    isLead: false,
    email: 'Adewalepolicy75@gmail.com',
    phone: '08057215622',
    color: '#A855F7', // Royal Amethyst
    experience: 'Design System Engineering • Component Architecture since 2023',
    quote:
      'Architects the Midnight Gold token system, layout engines, and modular component hierarchy powering every screen across the FandomVerse portal.',
    specialties: ['Design Tokens', 'Vite & React 18', 'Component Trees', 'Responsive Grid']
  },
  {
    id: 'Student1691727',
    name: 'Israel Tuyife',
    shortName: 'Israel',
    initials: 'IT',
    studentId: 'Student1691727',
    role: 'Lead UI/UX Designer & Information Architect',
    isLead: false,
    email: 'omotuyifeisrael@gmail.com',
    phone: '08065878877',
    color: '#06B6D4', // Electric Cyan
    experience: 'UI/UX Visual Design • Data Schema Modeling since 2022',
    quote:
      'Crafts pixel-perfect interfaces, editorial hierarchy, and structured schemas that bring all 7 fandom realms and rich universe lore into harmonious balance.',
    specialties: ['Visual Design', 'Information Architecture', 'Figma Prototyping', 'Content Schemas']
  },
  {
    id: 'Student1637987',
    name: 'Tella Obaloluwa',
    shortName: 'Tella',
    initials: 'TO',
    studentId: 'Student1637987',
    role: 'Head of Content Strategy & QA Engineering',
    isLead: false,
    email: 'obaloluwatella12@gmail.com',
    phone: '09079105111',
    color: '#F97316', // Vibrant Amber
    experience: 'Editorial Direction • Lore Curation • Quality Assurance since 2023',
    quote:
      'Shapes the brand voice, authors all original saga lore, and rigorously verifies that every journey passes stringent usability and quality standards.',
    specialties: ['Worldbuilding & Lore', 'Quality Assurance', 'Brand Voice', 'Cross-Device Testing']
  },
  {
    id: 'Student1550064',
    name: 'Azeezat Okunola',
    shortName: 'Azeezat',
    initials: 'AO',
    studentId: 'Student1550064',
    role: 'Lead Interaction & Accessibility Engineer',
    isLead: false,
    email: 'azeezatokunola06@gmail.com',
    phone: '08052107836',
    color: '#EC4899', // Vivid Rose
    experience: 'Motion Design • WCAG 2.1 AA Compliance • Ergonomics since 2023',
    quote:
      'Implements silky micro-animations, keyboard navigation traps, and WCAG 2.1 AA accessibility benchmarks across desktop, tablet, and mobile displays.',
    specialties: ['Micro-Interactions', 'WCAG AA Compliance', 'Focus Management', 'Performance CSS']
  }
]

export default function AboutPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [customAvatars, setCustomAvatars] = useState({})
  const [copiedId, setCopiedId] = useState(null)
  const fileInputRef = useRef(null)
  const [targetMemberForUpload, setTargetMemberForUpload] = useState(null)

  useEffect(() => {
    document.title = 'About the Team | FandomVerse — TechWiz 7'
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setCustomAvatars(JSON.parse(saved))
      }
    } catch (e) {
      console.warn('Unable to load custom avatars from storage', e)
    }
  }, [])

  const currentMember = TEAM[activeIndex]

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TEAM.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === TEAM.length - 1 ? 0 : prev + 1))
  }

  const triggerUpload = (memberId) => {
    setTargetMemberForUpload(memberId)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file || !targetMemberForUpload) return

    // Limit to 4MB for responsive base64 storage
    if (file.size > 4 * 1024 * 1024) {
      alert('Please select an image file under 4MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target.result
      setCustomAvatars((prev) => {
        const next = { ...prev, [targetMemberForUpload]: dataUrl }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch (err) {
          console.warn('Local storage quota exceeded', err)
        }
        return next
      })
    }
    reader.readAsDataURL(file)
  }

  const handleResetAvatar = (memberId, e) => {
    e?.stopPropagation()
    setCustomAvatars((prev) => {
      const next = { ...prev }
      delete next[memberId]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (err) {}
      return next
    })
  }

  const handleCopy = (text, id) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const hasPhoto = (memberId) => {
    return !!customAvatars[memberId]
  }

  const getPhotoSrc = (memberId) => {
    return customAvatars[memberId] || null
  }

  return (
    <div className={styles.page}>
      {/* Hidden file input for uploading pictures */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        aria-hidden="true"
      />

      {/* Atmospheric Ambient Glow Backdrop */}
      <div className={styles.glowBackdrop} aria-hidden="true" />

      <div className={styles.container}>
        {/* Top Minimalist Header */}
        <header className={styles.topHeader}>
          <div className={styles.navRow}>
            <Breadcrumbs
              items={[
                { label: 'Home', to: '/' },
                { label: 'About Us' }
              ]}
            />
            <div className={styles.headerBadges}>
              <div className={styles.techBadge}>
                <Trophy size={13} aria-hidden="true" />
                <span>Aptech TechWiz 7</span>
              </div>
              <div className={styles.leadHeaderBadge}>
                <Crown size={13} aria-hidden="true" />
                <span>Leader: Obasanjo Adam</span>
              </div>
            </div>
          </div>

          <div className={styles.titleBlock}>
            <div className={styles.heroPreTitle}>
              <span className={styles.teamTag}>EXECUTIVE TEAM PROFILE</span>
              <span className={styles.heroDot} />
              <span className={styles.heroSubTag}>APTECH NIGERIA</span>
            </div>
            <h1 className={styles.mainTitle}>ABOUT US</h1>
            <p className={styles.subHeadline}>
              WE JOINED FORCES TO BUILD THE MULTIVERSE WE WISHED WE COULD EXPERIENCE.
            </p>
          </div>
        </header>

        {/* ── 1. SPOTLIGHT SHOWCASE (Pinterest Staggered Split) ───────────────── */}
        <section className={styles.spotlightSection} aria-label="Featured Creator Spotlight">
          <div className={styles.spotlightLayout}>
            {/* Left Column: Round Portrait & Carousel Controls */}
            <div className={styles.portraitCol}>
              <div className={styles.roundFrameWrap}>
                <div
                  className={`${styles.roundFrame} ${currentMember.isLead ? styles.leadFrame : ''}`}
                  style={{ '--member-color': currentMember.color }}
                  onClick={() => triggerUpload(currentMember.id)}
                  title={`Click to upload photo for ${currentMember.name}`}
                >
                  {hasPhoto(currentMember.id) ? (
                    <img
                      src={getPhotoSrc(currentMember.id)}
                      alt={currentMember.name}
                      className={styles.portraitImg}
                    />
                  ) : (
                    <div className={styles.placeholderPortrait}>
                      <span className={styles.placeholderInitials}>{currentMember.initials}</span>
                      <div className={styles.placeholderUploadPrompt}>
                        <Camera size={16} />
                        <span>Upload Photo</span>
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className={styles.uploadOverlay}>
                    <Camera size={26} />
                    <span>{hasPhoto(currentMember.id) ? 'Change Photo' : 'Upload Photo'}</span>
                  </div>
                </div>

                {/* Team Leader Crown Indicator */}
                {currentMember.isLead && (
                  <div className={styles.leadSpotlightBadge}>
                    <Crown size={14} />
                    <span>TEAM LEADER</span>
                  </div>
                )}

                {hasPhoto(currentMember.id) && (
                  <button
                    type="button"
                    onClick={(e) => handleResetAvatar(currentMember.id, e)}
                    className={styles.resetBtn}
                    title="Remove custom photo"
                    aria-label="Remove photo"
                  >
                    <RotateCcw size={12} /> Remove Photo
                  </button>
                )}
              </div>

              {/* Pinterest-style Round Carousel Arrows (< >) */}
              <div className={styles.carouselControls}>
                <button
                  type="button"
                  onClick={handlePrev}
                  className={styles.roundNavBtn}
                  aria-label="Previous member"
                  title="Previous creator"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className={styles.counterText}>
                  0{activeIndex + 1} / 0{TEAM.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className={styles.roundNavBtn}
                  aria-label="Next member"
                  title="Next creator"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Right Column: Name with Horizontal Hairline, Role & Bio */}
            <div className={styles.spotlightInfoCol}>
              <div className={styles.headlineWithLine}>
                <div className={styles.hairline} aria-hidden="true" />
                <div className={styles.nameHeader}>
                  <div className={styles.nameLeadRow}>
                    <h2 className={styles.memberName}>{currentMember.name}</h2>
                    {currentMember.isLead && (
                      <span className={styles.leadInlineTag}>
                        <Crown size={12} /> LEADER
                      </span>
                    )}
                  </div>
                  <span className={styles.memberExperience}>
                    <strong style={{ color: currentMember.color }}>{currentMember.role}</strong>
                    {' • '}
                    {currentMember.experience}
                  </span>
                </div>
              </div>

              <div className={styles.spotlightBio}>
                <p className={styles.bioText}>{currentMember.quote}</p>

                {/* Specialties tags */}
                <div className={styles.specialtiesRow}>
                  {currentMember.specialties.map((spec) => (
                    <span key={spec} className={styles.specBadge}>
                      {spec}
                    </span>
                  ))}
                </div>

                <div className={styles.credentialsRow}>
                  <span className={styles.idPill}>
                    <GraduationCap size={13} aria-hidden="true" />
                    {currentMember.studentId}
                  </span>
                  <a href={`mailto:${currentMember.email}`} className={styles.actionPill}>
                    <Mail size={13} aria-hidden="true" />
                    {currentMember.email}
                  </a>
                  <a
                    href={`tel:+234${currentMember.phone.replace(/^0/, '')}`}
                    className={styles.actionPill}
                  >
                    <Phone size={13} aria-hidden="true" />
                    {currentMember.phone}
                  </a>
                  <button
                    type="button"
                    onClick={() => triggerUpload(currentMember.id)}
                    className={styles.uploadPill}
                  >
                    <Upload size={13} aria-hidden="true" />
                    {hasPhoto(currentMember.id) ? 'Change Photo' : 'Upload Photo'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. EDITORIAL TEAM ROSTER (Alternating Pinterest Stagger) ───────── */}
        <section className={styles.rosterSection} aria-label="Full Team Roster">
          <div className={styles.rosterIntro}>
            <div className={styles.kickerLine}>
              <span className={styles.kickerDot} />
              <span>THE FIVE CREATORS — APTECH TECHWIZ 7</span>
            </div>
            <h3 className={styles.rosterHeading}>Engineering & Creative Roster</h3>
            <p className={styles.rosterSub}>
              Meet the specialists behind the FandomVerse portal architecture, design tokens,
              lore curation, and accessibility standards.
            </p>
          </div>

          <div className={styles.rosterList}>
            {TEAM.map((member, index) => {
              const isEven = index % 2 === 1
              const isSelected = index === activeIndex
              const memberHasPhoto = hasPhoto(member.id)

              return (
                <div
                  key={member.id}
                  className={`${styles.rosterRow} ${isEven ? styles.rowReverse : ''} ${
                    isSelected ? styles.rowSelected : ''
                  } ${member.isLead ? styles.rosterRowLead : ''}`}
                  onClick={() => setActiveIndex(index)}
                >
                  {/* Circular Frame Container */}
                  <div className={styles.rosterAvatarCol}>
                    <div
                      className={`${styles.roundFrameMedium} ${
                        member.isLead ? styles.roundFrameMediumLead : ''
                      }`}
                      style={{ '--member-color': member.color }}
                      onClick={(e) => {
                        e.stopPropagation()
                        triggerUpload(member.id)
                      }}
                      title={`Click to upload photo for ${member.name}`}
                    >
                      {memberHasPhoto ? (
                        <img
                          src={getPhotoSrc(member.id)}
                          alt={member.name}
                          className={styles.portraitImg}
                        />
                      ) : (
                        <div className={styles.placeholderPortraitSm}>
                          <span className={styles.placeholderInitialsSm}>{member.initials}</span>
                        </div>
                      )}
                      <div className={styles.uploadOverlaySm}>
                        <Camera size={18} />
                      </div>
                    </div>

                    {member.isLead && (
                      <span className={styles.leadRosterBadge}>
                        <Crown size={11} /> Team Leader
                      </span>
                    )}

                    {memberHasPhoto ? (
                      <button
                        type="button"
                        onClick={(e) => handleResetAvatar(member.id, e)}
                        className={styles.resetBtnSm}
                        title="Remove photo"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          triggerUpload(member.id)
                        }}
                        className={styles.uploadPromptBtn}
                        title="Upload photo"
                      >
                        <Plus size={10} /> Add Photo
                      </button>
                    )}
                  </div>

                  {/* Info Column with Connecting Hairline */}
                  <div className={styles.rosterDetailsCol}>
                    <div className={styles.detailHeader}>
                      <div className={styles.hairlineSub} aria-hidden="true" />
                      <div>
                        <div className={styles.memberNumberRow}>
                          <span className={styles.memberNumberTag}>0{index + 1}</span>
                          {member.isLead && (
                            <span className={styles.leadPillSmall}>
                              <Crown size={11} /> TEAM LEADER
                            </span>
                          )}
                        </div>
                        <h4 className={styles.rosterMemberName}>{member.name}</h4>
                        <p className={styles.rosterRole}>
                          <span style={{ color: member.color, fontWeight: 700 }}>
                            {member.role}
                          </span>{' '}
                          • <span className={styles.studentIdText}>{member.studentId}</span>
                        </p>
                      </div>
                    </div>

                    <p className={styles.rosterBio}>{member.quote}</p>

                    {/* Skill Badges */}
                    <div className={styles.miniSpecsRow}>
                      {member.specialties.map((s) => (
                        <span key={s} className={styles.miniSpecTag}>
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className={styles.rosterLinks}>
                      <a
                        href={`mailto:${member.email}`}
                        className={styles.quickLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail size={12} /> {member.email}
                      </a>
                      <a
                        href={`tel:+234${member.phone.replace(/^0/, '')}`}
                        className={styles.quickLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone size={12} /> {member.phone}
                      </a>
                      <button
                        type="button"
                        className={styles.rosterUploadLink}
                        onClick={(e) => {
                          e.stopPropagation()
                          triggerUpload(member.id)
                        }}
                      >
                        <Upload size={12} /> {memberHasPhoto ? 'Change Photo' : 'Upload Photo'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── 3. SHORT & MEANINGFUL TECHWIZ COLOPHON ─────────────────────────── */}
        <section className={styles.pillarsRow}>
          <div className={styles.statPill}>
            <span className={styles.statNumber}>7</span>
            <span className={styles.statDesc}>Fandom Realms</span>
          </div>
          <div className={styles.statPill}>
            <span className={styles.statNumber}>14</span>
            <span className={styles.statDesc}>Original Sagas</span>
          </div>
          <div className={styles.statPill}>
            <span className={styles.statNumber}>100%</span>
            <span className={styles.statDesc}>Client-Side SPA</span>
          </div>
          <div className={styles.statPill}>
            <span className={styles.statNumber}>0</span>
            <span className={styles.statDesc}>External AI APIs</span>
          </div>
        </section>

        {/* Rule 7 & Competition Footer Card */}
        <footer className={styles.footerNote}>
          <div className={styles.footerContent}>
            <div className={styles.badgeRow}>
              <span className={styles.pillBadge}>
                <ShieldAlert size={12} />
                Rule 7 Compliant
              </span>
              <span className={styles.pillBadge}>
                <Sparkles size={12} />
                Midnight Gold System
              </span>
              <span className={styles.pillBadgeGold}>
                <Crown size={12} />
                Team Leader: Obasanjo Adam
              </span>
            </div>
            <p className={styles.disclaimerText}>
              All storylines, concept franchises, and characters featured on FandomVerse are
              original fictional universe materials developed exclusively for Aptech TechWiz 7.
              Engineered with React 18, Vite 5, Vanilla CSS Modules, and zero external backend
              dependencies.
            </p>
          </div>
          <div className={styles.techwizStamp}>
            <span className={styles.stampYear}>TECHWIZ 7</span>
            <strong className={styles.stampTeam}>TEAM FANDOMVERSE</strong>
            <span className={styles.stampOrg}>APTECH NIGERIA • 2026</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
