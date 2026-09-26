import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { characters } from "../data/characters.json";
import { articles } from "../data/articles.json";
import { polls } from "../data/polls.json";
import { videos } from "../data/videos.json";
import { events } from "../data/events.json";
import { merchandise } from "../data/merchandise.json";
import { quickGuides } from "../data/quickGuides.json";
import { topicHubs } from "../data/topicHubs.json";
import { series as seriesData } from "../data/series.json";
import { CharacterCard } from "../components/CharacterCard";
import { ArticleCard } from "../components/ArticleCard";
import { SeriesCard } from "../components/SeriesCard";
import { useFilters } from "../hooks/useFilters";
import { FilterBar } from "../components/FilterBar";
import { useBookmarks } from "../hooks/useFilters";
import "../styles/global.css";
import "../styles/category-hub.css";
import "../styles/FilterBar.css";

const CATEGORY_CONFIG = {
  anime: { label: "Anime", accent: "#A855F7", icon: "🎌" },
  gaming: { label: "Gaming", accent: "#22D3EE", icon: "🎮" },
  movies: { label: "Movies", accent: "#F59E0B", icon: "🎬" },
  tvshows: { label: "TV Shows", accent: "#FB7185", icon: "📺" },
  kpop: { label: "K-pop", accent: "#EC4899", icon: "🎤" },
  comics: { label: "Comics", accent: "#EF4444", icon: "🦸" },
  manga: { label: "Manga", accent: "#E5E5E5", icon: "📖" },
};

const CONTENT_TYPES = [
  { value: "all", label: "All Content" },
  { value: "articles", label: "Articles" },
  { value: "videos", label: "Videos" },
  { value: "characters", label: "Characters" },
  { value: "polls", label: "Polls" },
  { value: "events", label: "Events" },
  { value: "merchandise", label: "Merchandise" },
  { value: "guides", label: "Quick Guides" },
  { value: "topicHubs", label: "Topic Hubs" },
  { value: "series", label: "Series" },
];

const SORT_OPTIONS = [
  { value: "recent", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
  { value: "alphabetical", label: "A–Z" },
  { value: "oldest", label: "Oldest First" },
];

export default function CategoryHub() {
  const { category } = useParams();
  const config = CATEGORY_CONFIG[category];
  const { bookmarks, has: hasBookmark, toggle: toggleBookmark } = useBookmarks();

  if (!config) {
    return (
      <div className="category-hub not-found">
        <h1>Category Not Found</h1>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  const [activeContentType, setActiveContentType] = useState("all");
  const [activeSort, setActiveSort] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter data by category
  const categoryArticles = useMemo(
    () => articles.filter((a) => a.category === category),
    [category]
  );

  const categoryCharacters = useMemo(
    () => characters.filter((c) => c.category === category),
    [category]
  );

  const categoryPolls = useMemo(
    () => polls.filter((p) => p.category === category),
    [category]
  );

  const categoryVideos = useMemo(
    () => videos.filter((v) => v.category === category),
    [category]
  );

  const categoryEvents = useMemo(
    () => events.filter((e) => e.category === category),
    [category]
  );

  const categoryMerchandise = useMemo(
    () => merchandise.filter((m) => m.category === category),
    [category]
  );

  const categoryGuides = useMemo(
    () => quickGuides.filter((g) => g.category === category),
    [category]
  );

  const categoryTopicHubs = useMemo(
    () => topicHubs.filter((t) => t.category === category),
    [category]
  );

  // Flatten series from all categories that match the current category
  const categorySeries = useMemo(() => {
    const series = [];
    for (const cat of seriesData) {
      if (cat.slug === category || cat.id === category) {
        cat.featuredSeries.forEach(s => series.push({ ...s, category: cat.slug }));
      }
    }
    return series;
  }, [category]);

  // Combine all content for "all" view
  const allContent = useMemo(() => {
    const content = [];
    categoryArticles.forEach(a => content.push({ ...a, contentType: "articles" }));
    categoryCharacters.forEach(c => content.push({ ...c, contentType: "characters" }));
    categoryPolls.forEach(p => content.push({ ...p, contentType: "polls" }));
    categoryVideos.forEach(v => content.push({ ...v, contentType: "videos" }));
    categoryEvents.forEach(e => content.push({ ...e, contentType: "events" }));
    categoryMerchandise.forEach(m => content.push({ ...m, contentType: "merchandise" }));
    categoryGuides.forEach(g => content.push({ ...g, contentType: "guides" }));
    categoryTopicHubs.forEach(t => content.push({ ...t, contentType: "topicHubs" }));
    categorySeries.forEach(s => content.push({ ...s, contentType: "series" }));
    return content;
  }, [categoryArticles, categoryCharacters, categoryPolls, categoryVideos, categoryEvents, categoryMerchandise, categoryGuides, categoryTopicHubs, categorySeries]);

  // Get current content based on active type
  const getCurrentContent = () => {
    switch (activeContentType) {
      case "articles": return categoryArticles;
      case "characters": return categoryCharacters;
      case "polls": return categoryPolls;
      case "videos": return categoryVideos;
      case "events": return categoryEvents;
      case "merchandise": return categoryMerchandise;
      case "guides": return categoryGuides;
      case "topicHubs": return categoryTopicHubs;
      case "series": return categorySeries;
      default: return allContent;
    }
  };

  const currentContent = getCurrentContent();

  // Apply search filter
  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) return currentContent;
    const q = searchQuery.toLowerCase().trim();
    return currentContent.filter(item => 
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.question && item.question.toLowerCase().includes(q)) ||
      (item.franchise && item.franchise.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(q))) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  }, [currentContent, searchQuery]);

  // Apply sorting
  const sortedContent = useMemo(() => {
    const items = [...filteredContent];
    switch (activeSort) {
      case "recent":
        return items.sort((a, b) => {
          const dateA = a.publishedDate || a.date || a.releaseDate || 0;
          const dateB = b.publishedDate || b.date || b.releaseDate || 0;
          return new Date(dateB) - new Date(dateA);
        });
      case "oldest":
        return items.sort((a, b) => {
          const dateA = a.publishedDate || a.date || a.releaseDate || 0;
          const dateB = b.publishedDate || b.date || b.releaseDate || 0;
          return new Date(dateA) - new Date(dateB);
        });
      case "popular":
        return items.sort((a, b) => {
          const popA = a.totalVotes || a.views || a.popularity || 0;
          const popB = b.totalVotes || b.views || b.popularity || 0;
          return popB - popA;
        });
      case "alphabetical":
        return items.sort((a, b) => {
          const nameA = a.title || a.name || a.question || "";
          const nameB = b.title || b.name || b.question || "";
          return nameA.localeCompare(nameB);
        });
      default:
        return items;
    }
  }, [filteredContent, activeSort]);

  // Get content type counts
  const contentCounts = useMemo(() => ({
    articles: categoryArticles.length,
    characters: categoryCharacters.length,
    polls: categoryPolls.length,
    videos: categoryVideos.length,
    events: categoryEvents.length,
    merchandise: categoryMerchandise.length,
    guides: categoryGuides.length,
    topicHubs: categoryTopicHubs.length,
    series: categorySeries.length,
    all: allContent.length,
  }), [categoryArticles, categoryCharacters, categoryPolls, categoryVideos, categoryEvents, categoryMerchandise, categoryGuides, categoryTopicHubs, categorySeries]);

  const accentStyle = { "--accent": config.accent };

  // Reset filters when category changes
  useEffect(() => {
    setActiveContentType("all");
    setActiveSort("recent");
    setSearchQuery("");
  }, [category]);

  // Render content based on type
  const renderContent = () => {
    if (activeContentType === "characters") {
      return (
        <section className="category-section characters-section" aria-labelledby="characters-heading">
          <h2 id="characters-heading">Characters</h2>
          <div className="characters-grid">
            {sortedContent.slice(0, 24).map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                isBookmarked={hasBookmark(character.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
          {sortedContent.length > 24 && (
            <Link to="/characters" className="view-all" data-category={category}>
              View all {categoryCharacters.length} {config.label} characters
            </Link>
          )}
        </section>
      );
    }

    if (activeContentType === "articles") {
      return (
        <section className="category-section articles-section" aria-labelledby="articles-heading">
          <h2 id="articles-heading">Articles</h2>
          <div className="articles-grid">
            {sortedContent.slice(0, 12).map((article) => (
              <ArticleCard key={article.slug} article={article} isBookmarked={hasBookmark(article.slug)} onToggleBookmark={toggleBookmark} />
            ))}
          </div>
          {sortedContent.length > 12 && (
            <Link to={`/category/${category}/articles`} className="view-all">
              View all {sortedContent.length} articles
            </Link>
          )}
        </section>
      );
    }

    if (activeContentType === "polls") {
      return (
        <section className="category-section polls-section" aria-labelledby="polls-heading">
          <h2 id="polls-heading">Polls</h2>
          <div className="polls-grid">
            {sortedContent.map((poll) => (
              <PollCard key={poll.id} poll={poll} isBookmarked={hasBookmark(poll.id)} onToggleBookmark={toggleBookmark} />
            ))}
          </div>
        </section>
      );
    }

    if (activeContentType === "videos") {
      return (
        <section className="category-section videos-section" aria-labelledby="videos-heading">
          <h2 id="videos-heading">Videos</h2>
          <div className="videos-grid">
            {sortedContent.map((video) => (
              <VideoCard key={video.id} video={video} isBookmarked={hasBookmark(video.id)} onToggleBookmark={toggleBookmark} />
            ))}
          </div>
        </section>
      );
    }

    if (activeContentType === "events") {
      return (
        <section className="category-section events-section" aria-labelledby="events-heading">
          <h2 id="events-heading">Events</h2>
          <div className="events-grid">
            {sortedContent.map((event) => (
              <EventCard key={event.id} event={event} isBookmarked={hasBookmark(event.id)} onToggleBookmark={toggleBookmark} />
            ))}
          </div>
        </section>
      );
    }

    if (activeContentType === "merchandise") {
      return (
        <section className="category-section merch-section" aria-labelledby="merch-heading">
          <h2 id="merch-heading">Merchandise</h2>
          <div className="merch-grid">
            {sortedContent.map((item) => (
              <MerchCard key={item.id} item={item} isBookmarked={hasBookmark(item.id)} onToggleBookmark={toggleBookmark} />
            ))}
          </div>
        </section>
      );
    }

    if (activeContentType === "guides") {
      return (
        <section className="category-section guides-section" aria-labelledby="guides-heading">
          <h2 id="guides-heading">Quick Guides</h2>
          <div className="guides-grid">
            {sortedContent.map((guide) => (
              <GuideCard key={guide.id} guide={guide} isBookmarked={hasBookmark(guide.id)} onToggleBookmark={toggleBookmark} />
            ))}
          </div>
        </section>
      );
    }

    if (activeContentType === "topicHubs") {
      return (
        <section className="category-section topic-hubs-section" aria-labelledby="topic-hubs-heading">
          <h2 id="topic-hubs-heading">Topic Hubs</h2>
          <div className="topic-hubs-grid">
            {sortedContent.map((hub) => (
              <TopicHubCard key={hub.id} hub={hub} isBookmarked={hasBookmark(hub.id)} onToggleBookmark={toggleBookmark} />
            ))}
          </div>
        </section>
      );
    }

    if (activeContentType === "series") {
      return (
        <section className="category-section series-section" aria-labelledby="series-heading">
          <h2 id="series-heading">Series</h2>
          <div className="series-grid">
            {sortedContent.map((seriesItem) => (
              <SeriesCard key={seriesItem.id} series={seriesItem} isBookmarked={hasBookmark(seriesItem.id)} onToggleBookmark={toggleBookmark} />
            ))}
          </div>
        </section>
      );
    }

    // "All Content" view - grouped by type
    return (
      <>
        {categoryArticles.length > 0 && (
          <section className="category-section articles-section" aria-labelledby="articles-heading">
            <h2 id="articles-heading">Articles</h2>
            <div className="articles-grid">
              {categoryArticles.filter(a => filteredContent.some(f => f.id === a.slug || f.id === a.id)).slice(0, 6).map((article) => (
                <ArticleCard key={article.slug} article={article} isBookmarked={hasBookmark(article.slug)} onToggleBookmark={toggleBookmark} />
              ))}
            </div>
          </section>
        )}
        {categoryCharacters.length > 0 && (
          <section className="category-section characters-section" aria-labelledby="characters-heading">
            <h2 id="characters-heading">Characters</h2>
            <div className="characters-grid">
              {categoryCharacters.filter(c => filteredContent.some(f => f.id === c.id)).slice(0, 8).map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  isBookmarked={hasBookmark(character.id)}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          </section>
        )}
        {categoryPolls.length > 0 && (
          <section className="category-section polls-section" aria-labelledby="polls-heading">
            <h2 id="polls-heading">Polls</h2>
            <div className="polls-grid">
              {categoryPolls.filter(p => filteredContent.some(f => f.id === p.id)).map((poll) => (
                <PollCard key={poll.id} poll={poll} isBookmarked={hasBookmark(poll.id)} onToggleBookmark={toggleBookmark} />
              ))}
            </div>
          </section>
        )}
        {categoryVideos.length > 0 && (
          <section className="category-section videos-section" aria-labelledby="videos-heading">
            <h2 id="videos-heading">Videos</h2>
            <div className="videos-grid">
              {categoryVideos.filter(v => filteredContent.some(f => f.id === v.id)).map((video) => (
                <VideoCard key={video.id} video={video} isBookmarked={hasBookmark(video.id)} onToggleBookmark={toggleBookmark} />
              ))}
            </div>
          </section>
        )}
        {categoryEvents.length > 0 && (
          <section className="category-section events-section" aria-labelledby="events-heading">
            <h2 id="events-heading">Events</h2>
            <div className="events-grid">
              {categoryEvents.filter(e => filteredContent.some(f => f.id === e.id)).map((event) => (
                <EventCard key={event.id} event={event} isBookmarked={hasBookmark(event.id)} onToggleBookmark={toggleBookmark} />
              ))}
            </div>
          </section>
        )}
        {categoryMerchandise.length > 0 && (
          <section className="category-section merch-section" aria-labelledby="merch-heading">
            <h2 id="merch-heading">Merchandise</h2>
            <div className="merch-grid">
              {categoryMerchandise.filter(m => filteredContent.some(f => f.id === m.id)).map((item) => (
                <MerchCard key={item.id} item={item} isBookmarked={hasBookmark(item.id)} onToggleBookmark={toggleBookmark} />
              ))}
            </div>
          </section>
        )}
        {categoryGuides.length > 0 && (
          <section className="category-section guides-section" aria-labelledby="guides-heading">
            <h2 id="guides-heading">Quick Guides</h2>
            <div className="guides-grid">
              {categoryGuides.filter(g => filteredContent.some(f => f.id === g.id)).map((guide) => (
                <GuideCard key={guide.id} guide={guide} isBookmarked={hasBookmark(guide.id)} onToggleBookmark={toggleBookmark} />
              ))}
            </div>
          </section>
        )}
        {categoryTopicHubs.length > 0 && (
          <section className="category-section topic-hubs-section" aria-labelledby="topic-hubs-heading">
            <h2 id="topic-hubs-heading">Topic Hubs</h2>
            <div className="topic-hubs-grid">
              {categoryTopicHubs.filter(t => filteredContent.some(f => f.id === t.id)).map((hub) => (
                <TopicHubCard key={hub.id} hub={hub} isBookmarked={hasBookmark(hub.id)} onToggleBookmark={toggleBookmark} />
              ))}
            </div>
          </section>
        )}
        {categorySeries.length > 0 && (
          <section className="category-section series-section" aria-labelledby="series-heading">
            <h2 id="series-heading">Series</h2>
            <div className="series-grid">
              {categorySeries.filter(s => filteredContent.some(f => f.id === s.id)).map((seriesItem) => (
                <SeriesCard key={seriesItem.id} series={seriesItem} isBookmarked={hasBookmark(seriesItem.id)} onToggleBookmark={toggleBookmark} />
              ))}
            </div>
          </section>
        )}
      </>
    );
  };

  return (
    <div className="category-hub" style={accentStyle} data-category={category}>
      <header className="category-hub-header">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="crumb-sep" aria-hidden="true">/</span>
          <span aria-current="page">{config.icon} {config.label}</span>
        </nav>
        <h1>{config.icon} {config.label}</h1>
        <p className="category-hub-tagline">
          {contentCounts.all} items &bull; {contentCounts.articles} articles &bull; {contentCounts.characters} characters &bull; {contentCounts.videos} videos &bull; {contentCounts.polls} polls &bull; {contentCounts.series} series
        </p>
      </header>

      {/* Toolbar */}
      <div className="category-toolbar">
        <div className="toolbar-left">
          <div className="content-type-filter" role="tablist" aria-label="Filter by content type">
            {CONTENT_TYPES.map((type) => (
              <button
                key={type.value}
                role="tab"
                aria-selected={activeContentType === type.value}
                className={`content-type-btn ${activeContentType === type.value ? "active" : ""}`}
                onClick={() => setActiveContentType(type.value)}
              >
                {type.label} <span className="count-badge">({contentCounts[type.value] || 0})</span>
              </button>
            ))}
          </div>
        </div>
        <div className="toolbar-right">
          <div className="sort-dropdown">
            <label htmlFor="sort-select" className="visually-hidden">Sort by</label>
            <select
              id="sort-select"
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              className="sort-select"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search within {config.label}..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search content"
            />
          </div>
        </div>
      </div>

      <div className="category-content">
        {renderContent()}
        {sortedContent.length === 0 && (
          <div className="no-results">
            <p>No content found matching your criteria.</p>
            <button onClick={() => { setSearchQuery(""); setActiveContentType("all"); setActiveSort("recent"); }}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PollCard({ poll, isBookmarked, onToggleBookmark }) {
  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleBookmark?.(poll.id);
  };

  return (
    <article className="poll-card" data-category={poll.category}>
      <button
        className={`poll-bookmark ${isBookmarked ? "active" : ""}`}
        onClick={handleBookmarkClick}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        aria-pressed={isBookmarked}
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
        {poll.options.map((opt) => (
          <li key={opt.id} className="poll-option">
            <span className="poll-option-label">{opt.label}</span>
            <div className="poll-bar">
              <div
                className="poll-bar-fill"
                style={{ width: `${(opt.votes / poll.totalVotes) * 100}%` }}
              />
            </div>
            <span className="poll-option-votes">
              {opt.votes.toLocaleString()} ({(opt.votes / poll.totalVotes * 100).toFixed(1)}%)
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function VideoCard({ video, isBookmarked, onToggleBookmark }) {
  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleBookmark?.(video.id);
  };

  return (
    <article className="video-card" data-category={video.category}>
      <button
        className={`video-bookmark ${isBookmarked ? "active" : ""}`}
        onClick={handleBookmarkClick}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        aria-pressed={isBookmarked}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>
      <div className="video-thumbnail">
        <a href={video.embedUrl} target="_blank" rel="noopener noreferrer">
          {video.thumbnail ? (
            <img src={video.thumbnail} alt={video.title} loading="lazy" />
          ) : (
            <div className="video-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          )}
          <span className="video-duration">{video.duration}</span>
          <span className="video-type">{video.type}</span>
        </a>
      </div>
      <div className="video-info">
        <span className="video-franchise">{video.franchise}</span>
        <h3 className="video-title">{video.title}</h3>
        <p className="video-meta">
          {new Date(video.publishedDate).toLocaleDateString()} &middot; {video.tags.join(", ")}
        </p>
      </div>
    </article>
  );
}

function EventCard({ event, isBookmarked, onToggleBookmark }) {
  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleBookmark?.(event.id);
  };

  return (
    <article className="event-card" data-category={event.category}>
      <button
        className={`event-bookmark ${isBookmarked ? "active" : ""}`}
        onClick={handleBookmarkClick}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        aria-pressed={isBookmarked}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>
      <div className="event-image">
        <img src={event.image} alt={event.title} loading="lazy" />
        <span className="event-status">{event.status === "upcoming" ? "Upcoming" : "Recent"}</span>
      </div>
      <div className="event-info">
        <span className="event-category">{event.category}</span>
        <h3 className="event-title">{event.title}</h3>
        <p className="event-date">
          {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          {event.endDate && event.endDate !== event.date && (
            <> &ndash; {new Date(event.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</>
          )}
        </p>
        <p className="event-location">{event.location}</p>
      </div>
    </article>
  );
}

function MerchCard({ item, isBookmarked, onToggleBookmark }) {
  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleBookmark?.(item.id);
  };

  return (
    <Link to={item.shopUrl} className="merch-card-link">
      <article className="merch-card" data-category={item.category}>
        <button
          className={`merch-bookmark ${isBookmarked ? "active" : ""}`}
          onClick={handleBookmarkClick}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          aria-pressed={isBookmarked}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
        <div className="merch-image">
          <img src={item.imageUrl} alt={item.title} loading="lazy" />
          {!item.inStock && <span className="out-of-stock">Out of Stock</span>}
        </div>
        <div className="merch-info">
          <span className="merch-category">{item.category}</span>
          <h3 className="merch-title">{item.title}</h3>
          <p className="merch-price">{item.price}</p>
        </div>
      </article>
    </Link>
  );
}

function GuideCard({ guide, isBookmarked, onToggleBookmark }) {
  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleBookmark?.(guide.id);
  };

  return (
    <Link to={guide.ctaUrl} className="guide-card-link">
      <article className="guide-card" data-category={guide.category}>
        <button
          className={`guide-bookmark ${isBookmarked ? "active" : ""}`}
          onClick={handleBookmarkClick}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          aria-pressed={isBookmarked}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
        <div className="guide-info">
          <span className="guide-category">{guide.category}</span>
          <h3 className="guide-title">{guide.title}</h3>
          <p className="guide-meta">{guide.readTime} &middot; {guide.tags.join(", ")}</p>
          <p className="guide-summary">{guide.summary}</p>
        </div>
      </article>
    </Link>
  );
}

function TopicHubCard({ hub, isBookmarked, onToggleBookmark }) {
  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleBookmark?.(hub.id);
  };

  return (
    <Link to={`/topic/${hub.id}`} className="topic-hub-card-link">
      <article className="topic-hub-card" data-category={hub.category}>
        <button
          className={`topic-hub-bookmark ${isBookmarked ? "active" : ""}`}
          onClick={handleBookmarkClick}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          aria-pressed={isBookmarked}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
        <div className="topic-hub-image">
          <img src={hub.bannerImage} alt={hub.category} loading="lazy" />
        </div>
        <div className="topic-hub-info">
          <span className="topic-hub-category">{hub.category}</span>
          <h3 className="topic-hub-title">{hub.title}</h3>
          <p className="topic-hub-overview">{hub.overview}</p>
        </div>
      </article>
    </Link>
  );
}