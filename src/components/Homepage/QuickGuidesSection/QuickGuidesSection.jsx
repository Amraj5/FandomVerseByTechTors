import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { quickGuides } from "../../../data/quickGuides.json";
import "./QuickGuidesSection.css";

const CATEGORY_CONFIG = {
  anime: { label: "Anime", accent: "#A855F7", icon: "🎌" },
  gaming: { label: "Gaming", accent: "#22D3EE", icon: "🎮" },
  movies: { label: "Movies", accent: "#F59E0B", icon: "🎬" },
  tvshows: { label: "TV Shows", accent: "#FB7185", icon: "📺" },
  kpop: { label: "K-pop", accent: "#EC4899", icon: "🎤" },
  comics: { label: "Comics", accent: "#EF4444", icon: "🦸" },
  manga: { label: "Manga", accent: "#E5E5E5", icon: "📖" },
};

function QuickGuidesSection() {
  const guides = useMemo(() => quickGuides.slice(0, 4), []);

  return (
    <section className="quick-guides-section">
      <div className="quick-guides-section-header">
        <div>
          <p className="section-label">QUICK GUIDES</p>
          <h2 className="quick-guides-section-title">Essential Primers</h2>
        </div>
        <Link to="/guides" className="view-all-link">View all →</Link>
      </div>

      <div className="quick-guides-grid">
        {guides.map((guide) => {
          const config = CATEGORY_CONFIG[guide.category];
          return (
            <Link key={guide.id} to={guide.ctaUrl} className="guide-card" style={{ "--accent": config?.accent }}>
              <div className="guide-card-content">
                <span className="guide-category-badge" style={{ backgroundColor: config?.accent }}>
                  {config?.icon} {config?.label}
                </span>
                <h3 className="guide-title">{guide.title}</h3>
                <p className="guide-summary">{guide.summary}</p>
                <div className="guide-meta">
                  <span className="guide-read-time">{guide.readTime}</span>
                  <div className="guide-tags">
                    {guide.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="guide-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default QuickGuidesSection;