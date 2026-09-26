import React from "react";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <header className={styles.pageHeader}>
        <h1>About FandomVerse</h1>
        <p className={styles.pageSubtitle}>Your universe of fandoms — all in one place</p>
      </header>

      <main className={styles.aboutContent}>
        <section className={styles.aboutSection}>
          <h2>Our Mission</h2>
          <p>
            FandomVerse was built for fans, by fans. We believe that whether you're into anime, gaming, movies, 
            TV shows, K-pop, comics, or manga — you shouldn't have to jump between a dozen different sites to 
            stay updated. We bring it all together in one beautiful, fast, and intuitive platform.
          </p>
        </section>

        <section className={styles.aboutSection}>
          <h2>What We Offer</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3>📰 Articles & Editorials</h3>
              <p>Deep dives, retrospectives, news breakdowns, and analysis across every fandom category.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>👥 Character Profiles</h3>
              <p>Detailed character pages with bios, relationships, powers, and story arcs.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>📅 Events Calendar</h3>
              <p>Track conventions, festivals, premieres, and tournaments worldwide.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>🗳️ Community Polls</h3>
              <p>Vote on hot topics and see what the community thinks about the latest releases.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>🛍️ Merch Store</h3>
              <p>Official merchandise from your favorite series — figures, apparel, collectibles, and more.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>🤖 AI Assistant</h3>
              <p>Ask our chatbot for recommendations, lore explanations, or site navigation help.</p>
            </div>
          </div>
        </section>

        <section className={styles.aboutSection}>
          <h2>Built for Techwiz 7</h2>
          <p>
            FandomVerse is a submission for <strong>Techwiz 7 — Web Innovation Unleashed</strong> by Team TechTors. 
            All content lives in local JSON files with no backend or database required. The project showcases 
            modern React patterns, responsive design, and a fan-first user experience.
          </p>
        </section>

        <section className={styles.aboutSection}>
          <h2>The Team</h2>
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <div className={styles.memberAvatar}>TD</div>
              <h4>TechTors Dev</h4>
              <p>Lead Developer</p>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.memberAvatar}>TD</div>
              <h4>TechTors Design</h4>
              <p>UI/UX Designer</p>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.memberAvatar}>TD</div>
              <h4>TechTors Content</h4>
              <p>Content Curator</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}