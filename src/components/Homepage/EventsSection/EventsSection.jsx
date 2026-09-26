import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { events } from "../../../data/events.json";
import "./EventsSection.css";

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

function EventsSection() {
  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter((e) => e.status === "upcoming")
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 4);
  }, []);

  return (
    <section className="events-section">
      <div className="events-section-header">
        <div>
          <p className="section-label">UPCOMING EVENTS</p>
          <h2 className="events-section-title">Featured Events</h2>
        </div>
        <Link to="/events" className="view-all-link">View all →</Link>
      </div>

      <div className="events-grid">
        {upcomingEvents.map((event) => {
          const config = CATEGORY_CONFIG[event.category];
          return (
            <Link key={event.id} to={`/events/${event.id}`} className="event-card" style={{ "--accent": config?.accent }}>
              <div className="event-card-image">
                <img src={event.image} alt={event.title} loading="lazy" />
                <span className="event-category-badge" style={{ backgroundColor: config?.accent }}>
                  {config?.icon} {config?.label}
                </span>
              </div>
              <div className="event-card-content">
                <time className="event-date">
                  {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  {event.endDate && event.endDate !== event.date && (
                    <> – {new Date(event.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</>
                  )}
                </time>
                <h3 className="event-title">{event.title}</h3>
                <p className="event-location">{event.location}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default EventsSection;