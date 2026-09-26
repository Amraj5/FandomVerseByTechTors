import React from "react";
import { Link } from "react-router-dom";

export function ArticleCard({ article, isBookmarked, onToggleBookmark }) {
  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleBookmark?.(article.slug);
  };

  return (
    <Link to={article.href} className="article-card-compact">
      {article.heroImage && (
        <div className="article-card-thumb" style={{ backgroundImage: `url(${article.heroImage})` }} />
      )}
      <div className="article-card-content">
        <span className="article-card-category">{article.category}</span>
        <h3 className="article-card-title">{article.title}</h3>
        <p className="article-card-meta">
          {article.readTime} &middot; {new Date(article.publishedDate).toLocaleDateString()}
        </p>
      </div>
      <button
        className={`article-bookmark ${isBookmarked ? "active" : ""}`}
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