import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { series as seriesData } from "../data/series.json";
import { characters } from "../data/characters.json";
import { articles } from "../data/articles.json";
import { useBookmarks } from "../hooks/useFilters";
import "../styles/series-detail.css";

export default function SeriesDetailPage() {
  const { slug } = useParams();
  const { has: hasBookmark, toggle: toggleBookmark } = useBookmarks();

  // Find series by slug (check across all categories)
  const series = useMemo(() => {
    for (const category of seriesData) {
      const found = category.featuredSeries.find(s => s.slug === slug);
      if (found) return { ...found, category: category.slug };
    }
    return null;
  }, [slug]);

  // Find characters from this series
  const seriesCharacters = useMemo(() => {
    return characters.filter(c => c.series === series?.title);
  }, [series]);

  // Find articles about this series
  const seriesArticles = useMemo(() => {
    return articles.filter(a => 
      a.tags?.some(tag => tag.toLowerCase().includes(series?.title.toLowerCase())) ||
      a.title.toLowerCase().includes(series?.title.toLowerCase())
    );
  }, [series]);

  if (!series) {
    return (
      <div className="series-detail-page not-found">
        <h2>404 - Series Not Found</h2>
        <Link to="/categories">Back to Categories</Link>
      </div>
    );
  }

  const config = {
    anime: { label: "Anime", accent: "#A855F7", icon: "🎌" },
    "tv-shows": { label: "TV Shows", accent: "#FB7185", icon: "📺" },
    movies: { label: "Movies", accent: "#F59E0B", icon: "🎬" },
    gaming: { label: "Gaming", accent: "#22D3EE", icon: "🎮" },
    manga: { label: "Manga", accent: "#E5E5E5", icon: "📖" },
    kpop: { label: "K-pop", accent: "#EC4899", icon: "🎤" },
    comics: { label: "Comics", accent: "#EF4444", icon: "🦸" },
  }[series.category] || { label: series.category, accent: "#A855F7", icon: "📺" };

  const isBookmarked = hasBookmark(series.id);
  const statusColor = series.status === "Ongoing" ? "#22D3EE" : "#A855F7";

  return (
    <article className="series-detail-page" style={{ "--accent": config.accent }} data-category={series.category}>
      <header className="series-detail-header">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="crumb-sep" aria-hidden="true">/</span>
          <Link to={`/category/${series.category}`}>{config.icon} {config.label}</Link>
          <span className="crumb-sep" aria-hidden="true">/</span>
          <span aria-current="page">{series.title}</span>
        </nav>

        <Link to={`/category/${series.category}`} className="back-link">
          ← Back to {config.label}
        </Link>

        <div className="series-detail-meta">
          <span className="series-category" style={{ backgroundColor: config.accent }}>
            {config.icon} {config.label}
          </span>
          <span className="series-status" style={{ backgroundColor: statusColor }}>
            {series.status}
          </span>
        </div>

        <h1 className="series-detail-title">{series.title}</h1>

        {series.heroImage && (
          <figure className="series-hero">
            <img src={series.heroImage} alt={series.title} />
          </figure>
        )}

        <div className="series-quick-info">
          <div className="info-item">
            <span className="info-label">Seasons</span>
            <span className="info-value">{series.seasons}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Rating</span>
            <span className="info-value">⭐ {series.rating}/10</span>
          </div>
          <div className="info-item">
            <span className="info-label">Genres</span>
            <span className="info-value">{series.genre.join(", ")}</span>
          </div>
        </div>
      </header>

      <div className="series-detail-content">
        <section className="series-section">
          <h2>About</h2>
          <p>{series.description}</p>
        </section>

        <section className="series-section">
          <h2>Themes</h2>
          <div className="series-tags">
            {series.themes.map((theme, i) => (
              <span key={i} className="series-tag">{theme}</span>
            ))}
          </div>
        </section>

        {seriesCharacters.length > 0 && (
          <section className="series-section">
            <h2>Characters ({seriesCharacters.length})</h2>
            <div className="characters-grid">
              {seriesCharacters.slice(0, 8).map((character) => (
                <Link key={character.id} to={character.href} className="character-card-link">
                  <div className="character-card-compact">
                    {character.image && (
                      <img src={character.image} alt={character.name} loading="lazy" />
                    )}
                    <div className="character-card-info">
                      <h4>{character.name}</h4>
                      <span className="character-role">{character.role}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {seriesCharacters.length > 8 && (
              <Link to="/characters" className="view-all">
                View all {seriesCharacters.length} characters
              </Link>
            )}
          </section>
        )}

        {seriesArticles.length > 0 && (
          <section className="series-section">
            <h2>Related Articles ({seriesArticles.length})</h2>
            <div className="articles-grid">
              {seriesArticles.slice(0, 6).map((article) => (
                <Link key={article.slug} to={article.href} className="article-card-compact">
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
                </Link>
              ))}
            </div>
            {seriesArticles.length > 6 && (
              <Link to={`/category/${series.category}`} className="view-all">
                View all {seriesArticles.length} articles
              </Link>
            )}
          </section>
        )}
      </div>

      <footer className="series-detail-footer">
        <div className="series-share">
          <span>Share:</span>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(series.title)}&url=${encodeURIComponent(window.location.href)}`}
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
            href={`mailto:?subject=${encodeURIComponent(series.title)}&body=${encodeURIComponent(window.location.href)}`}
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