import React from "react";
import { Link } from "react-router-dom";

export function SeriesCard({ series, isBookmarked, onToggleBookmark }) {
  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleBookmark?.(series.id);
  };

  const statusColor = series.status === "Ongoing" ? "#22D3EE" : "#A855F7";

  return (
    <Link to={`/series/${series.slug}`} className="series-card-compact">
      {series.heroImage && (
        <div className="series-card-thumb" style={{ backgroundImage: `url(${series.heroImage})` }} />
      )}
      <div className="series-card-content">
        <span className="series-card-category">{series.category}</span>
        <h3 className="series-card-title">{series.title}</h3>
        <div className="series-card-meta">
          <span className="series-status" style={{ backgroundColor: statusColor }}>
            {series.status}
          </span>
          <span>{series.seasons} seasons</span>
          <span>⭐ {series.rating}</span>
        </div>
        <p className="series-card-genres">
          {series.genre.slice(0, 3).map((g, i) => (
            <span key={i} className="series-genre-tag">{g}</span>
          ))}
        </p>
      </div>
      <button
        className={`series-bookmark ${isBookmarked ? "active" : ""}`}
        onClick={handleBookmarkClick}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        aria-pressed={isBookmarked}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </Link>
  );
}