import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { events } from "../data/events.json";
import "../styles/global.css";
import "../styles/events-page.css";

const CATEGORY_CONFIG = {
  anime: { label: "Anime", accent: "#A855F7", icon: "🎌" },
  gaming: { label: "Gaming", accent: "#22D3EE", icon: "🎮" },
  movies: { label: "Movies", accent: "#F59E0B", icon: "🎬" },
  tvshows: { label: "TV Shows", accent: "#FB7185", icon: "📺" },
  kpop: { label: "K-pop", accent: "#EC4899", icon: "🎤" },
  comics: { label: "Comics", accent: "#EF4444", icon: "🦸" },
  manga: { label: "Manga", accent: "#E5E5E5", icon: "📖" },
};

const statusOrder = { upcoming: 0, "recently-released": 1 };

export default function EventsPage() {
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const statusA = statusOrder[a.status] ?? 2;
      const statusB = statusOrder[b.status] ?? 2;
      if (statusA !== statusB) return statusA - statusB;
      return new Date(a.date) - new Date(b.date);
    });
  }, []);

  return (
    <div className="events-page">
      <header className="events-header">
        <h1>Events</h1>
        <p className="events-tagline">
          Conventions, festivals, tournaments & premieres across every fandom
        </p>
      </header>

      <div className="events-grid">
        {sortedEvents.map((event) => {
          const config = CATEGORY_CONFIG[event.category];
          return (
            <Link key={event.id} to={`/events/${event.id}`} className="event-card" style={{ "--accent": config?.accent }}>
              <div className="event-card-image">
                <img src={event.image} alt={event.title} loading="lazy" />
                <span className="event-status">{event.status === "upcoming" ? "Upcoming" : "Recent"}</span>
              </div>
              <div className="event-card-content">
                <div className="event-card-meta">
                  <span className="event-category" style={{ backgroundColor: config?.accent }}>
                    {config?.icon} {config?.label}
                  </span>
                  <time className="event-date">
                    {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {event.endDate && event.endDate !== event.date && (
                      <> – {new Date(event.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</>
                    )}
                  </time>
                </div>
                <h3 className="event-title">{event.title}</h3>
                <p className="event-location">{event.location}</p>
                <p className="event-description">{event.description}</p>
                <div className="event-tags">
                  {event.tags.map((tag) => (
                    <span key={tag} className="event-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}