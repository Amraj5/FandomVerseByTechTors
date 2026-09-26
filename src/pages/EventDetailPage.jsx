import React from "react";
import { useParams, Link } from "react-router-dom";
import { events } from "../data/events.json";
import "../styles/event-detail.css";

const CATEGORY_CONFIG = {
  anime: { label: "Anime", accent: "#A855F7", icon: "🎌" },
  gaming: { label: "Gaming", accent: "#22D3EE", icon: "🎮" },
  movies: { label: "Movies", accent: "#F59E0B", icon: "🎬" },
  tvshows: { label: "TV Shows", accent: "#FB7185", icon: "📺" },
  kpop: { label: "K-pop", accent: "#EC4899", icon: "🎤" },
  comics: { label: "Comics", accent: "#EF4444", icon: "🦸" },
  manga: { label: "Manga", accent: "#E5E5E5", icon: "📖" },
};

export default function EventDetailPage() {
  const { id } = useParams();
  const event = events.find((e) => e.id === id);
  const config = CATEGORY_CONFIG[event?.category];

  if (!event) {
    return (
      <div className="event-detail-page not-found">
        <h2>404 - Event Not Found</h2>
        <Link to="/events">Back to Events</Link>
      </div>
    );
  }

  const accentStyle = { "--accent": config?.accent };

  return (
    <article className="event-detail-page" style={accentStyle} data-category={event.category}>
      <header className="event-detail-header">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="crumb-sep" aria-hidden="true">/</span>
          <Link to="/events">Events</Link>
          <span className="crumb-sep" aria-hidden="true">/</span>
          <span aria-current="page">{event.title}</span>
        </nav>

        <Link to="/events" className="back-link">
          ← Back to events
        </Link>

        <div className="event-detail-meta">
          <span className="event-category" style={{ backgroundColor: config?.accent }}>
            {config?.icon} {config?.label}
          </span>
          <span className="event-status">{event.status === "upcoming" ? "Upcoming" : "Recently Concluded"}</span>
        </div>

        <h1 className="event-detail-title">{event.title}</h1>

        <div className="event-detail-info">
          <div className="event-info-item">
            <span className="event-info-label">📅 Date</span>
            <span className="event-info-value">
              {new Date(event.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              {event.endDate && event.endDate !== event.date && (
                <> – {new Date(event.endDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</>
              )}
            </span>
          </div>
          <div className="event-info-item">
            <span className="event-info-label">📍 Location</span>
            <span className="event-info-value">{event.location}</span>
          </div>
        </div>
      </header>

      {event.image && (
        <figure className="event-detail-hero">
          <img src={event.image} alt={event.title} />
        </figure>
      )}

      <div className="event-detail-content">
        <section className="event-section">
          <h2>About This Event</h2>
          <p>{event.description}</p>
        </section>

        <section className="event-section">
          <h2>Tags</h2>
          <div className="event-tags">
            {event.tags.map((tag) => (
              <span key={tag} className="event-tag">{tag}</span>
            ))}
          </div>
        </section>
      </div>

      <footer className="event-detail-footer">
        <div className="event-share">
          <span>Share:</span>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener"
            aria-label="Share on Twitter"
          >
            Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener"
            aria-label="Share on Facebook"
          >
            Facebook
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(window.location.href)}`}
            aria-label="Share via Email"
          >
            Email
          </a>
          <button
            className="copy-link"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            aria-label="Copy link"
          >
            Copy
          </button>
        </div>
      </footer>
    </article>
  );
}