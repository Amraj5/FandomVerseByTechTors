import React from "react";
import { Link } from "react-router-dom";

export function CharacterCard({ character, isBookmarked, onToggleBookmark }) {
  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleBookmark?.(character.id);
  };

  return (
    <article className="character-card" data-category={character.category}>
      <Link to={character.href} className="character-card-link">
        <figure className="character-card-thumb">
          {character.image ? (
            <img src={character.image} alt={character.name} loading="lazy" />
          ) : (
            <div
              className="character-card-placeholder"
              style={{ background: character.imagePlaceholder?.bg }}
              aria-hidden="true"
            >
              <span>{character.imagePlaceholder?.label}</span>
            </div>
          )}
        </figure>
        <div className="character-card-body">
          <span className="character-card-franchise">{character.franchise}</span>
          <h3 className="character-card-name">{character.name}</h3>
          <p className="character-card-role">{character.role}</p>
          <div className="character-card-tags">
            {character.card?.tagRow?.slice(0, 3).map((tag, i) => (
              <span key={i} className="character-card-tag">{tag}</span>
            ))}
          </div>
        </div>
      </Link>
      <button
        className={`character-card-bookmark ${isBookmarked ? "active" : ""}`}
        onClick={handleBookmarkClick}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        aria-pressed={isBookmarked}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </article>
  );
}