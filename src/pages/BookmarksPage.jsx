import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { characters } from "../data/characters.json";
import { articles } from "../data/articles.json";
import { polls } from "../data/polls.json";
import { useBookmarks } from "../hooks/useFilters";
import { CharacterCard } from "../components/CharacterCard";
import "../styles/global.css";
import "../styles/bookmarks-page.css";

export default function BookmarksPage() {
  const { bookmarks, has } = useBookmarks();

  const bookmarkedCharacters = useMemo(() => 
    characters.filter(c => has(c.id)), [has]
  );
  
  const bookmarkedArticles = useMemo(() => 
    articles.filter(a => has(a.slug)), [has]
  );
  
  const bookmarkedPolls = useMemo(() => 
    polls.filter(p => has(p.id)), [has]
  );

  const totalCount = bookmarkedCharacters.length + bookmarkedArticles.length + bookmarkedPolls.length;

  if (totalCount === 0) {
    return (
      <div className="bookmarks-page empty">
        <header className="bookmarks-header">
          <h1>Bookmarks</h1>
          <p className="bookmarks-count">0 saved</p>
        </header>
        <div className="bookmarks-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <h2>No bookmarks yet</h2>
          <p>Click the bookmark icon on any character, article, or poll to save it here.</p>
<div className="bookmarks-empty-actions">
          <Link to="/" className="btn btn-secondary">Home</Link>
          <Link to="/characters" className="btn btn-primary">Browse Characters</Link>
          <Link to="/polls" className="btn btn-secondary">Browse Polls</Link>
        </div>
        </div>
      </div>
    );
  }

  const { toggle: toggleBookmark } = useBookmarks();

  return (
    <div className="bookmarks-page">
      <header className="bookmarks-header">
        <nav className="bookmarks-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="crumb-sep" aria-hidden="true">/</span>
          <span aria-current="page">Bookmarks</span>
        </nav>
        <h1>Bookmarks</h1>
        <p className="bookmarks-count">{totalCount} saved · {bookmarkedCharacters.length} characters · {bookmarkedArticles.length} articles · {bookmarkedPolls.length} polls</p>
      </header>

      {bookmarkedCharacters.length > 0 && (
        <section className="bookmarks-section" aria-labelledby="bookmarked-characters">
          <div className="bookmarks-section-header">
            <h2 id="bookmarked-characters">Characters</h2>
            <span className="bookmarks-section-count">{bookmarkedCharacters.length}</span>
          </div>
          <div className="bookmarks-grid characters-grid">
            {bookmarkedCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} isBookmarked={true} onToggleBookmark={() => {}} />
            ))}
          </div>
        </section>
      )}

      {bookmarkedArticles.length > 0 && (
        <section className="bookmarks-section" aria-labelledby="bookmarked-articles">
          <div className="bookmarks-section-header">
            <h2 id="bookmarked-articles">Articles</h2>
            <span className="bookmarks-section-count">{bookmarkedArticles.length}</span>
          </div>
          <div className="bookmarks-grid articles-grid">
            {bookmarkedArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} isBookmarked={true} onToggleBookmark={() => {}} />
            ))}
          </div>
        </section>
      )}

      {bookmarkedPolls.length > 0 && (
        <section className="bookmarks-section" aria-labelledby="bookmarked-polls">
          <div className="bookmarks-section-header">
            <h2 id="bookmarked-polls">Polls</h2>
            <span className="bookmarks-section-count">{bookmarkedPolls.length}</span>
          </div>
          <div className="bookmarks-grid polls-grid">
            {bookmarkedPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} isBookmarked={true} onToggleBookmark={() => {}} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ArticleCard({ article, isBookmarked, onToggleBookmark }) {
  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleBookmark(article.slug);
  };

  return (
    <Link to={article.href} className="article-card-compact bookmarked">
      {article.heroImage && (
        <div className="article-card-thumb" style={{ backgroundImage: `url(${article.heroImage})` }} />
      )}
      <div className="article-card-content">
        <span className="article-card-category">{article.category}</span>
        <h3 className="article-card-title">{article.title}</h3>
        <p className="article-card-meta">{article.readTime} · {new Date(article.publishedDate).toLocaleDateString()}</p>
      </div>
      <button
        className={`article-bookmark ${isBookmarked ? "active" : ""}`}
        onClick={handleBookmarkClick}
        aria-label="Remove bookmark"
        aria-pressed={true}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </Link>
  );
}

function PollCard({ poll, isBookmarked, onToggleBookmark }) {
  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleBookmark(poll.id);
  };

  return (
    <article className="poll-card bookmarked" data-category={poll.category}>
      <button
        className={`poll-bookmark ${isBookmarked ? "active" : ""}`}
        onClick={handleBookmarkClick}
        aria-label="Remove bookmark"
        aria-pressed={true}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>
      <div className="poll-card-header">
        <span className="poll-category">{poll.category}</span>
        <span className="poll-vote-count">{poll.totalVotes.toLocaleString()} votes</span>
      </div>
      <h3 className="poll-question">{poll.question}</h3>
      <ul className="poll-options">
        {poll.options.map((opt, i) => (
          <li key={opt.id} className="poll-option">
            <div className="poll-option-main">
              <span className="poll-option-rank">{i + 1}</span>
              <span className="poll-option-label">{opt.label}</span>
            </div>
            <div className="poll-option-stats">
              <div className="poll-bar">
                <div className="poll-bar-fill" style={{ width: `${(opt.votes / poll.totalVotes) * 100}%` }} />
              </div>
              <div className="poll-option-meta">
                <span className="poll-option-votes">{opt.votes.toLocaleString()}</span>
                <span className="poll-option-pct">{(opt.votes / poll.totalVotes * 100).toFixed(1)}%</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}