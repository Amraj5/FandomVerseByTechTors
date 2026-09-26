import React from "react";
import { polls } from "../data/polls.json";
import { useFilters } from "../hooks/useFilters";
import { FilterBar } from "../components/FilterBar";
import { useBookmarks } from "../hooks/useFilters";
import "../styles/global.css";
import "../styles/polls-hub.css";
import "../styles/FilterBar.css";

const categoryLabels = {
  anime: "Anime",
  gaming: "Gaming",
  movies: "Movies",
  tvshows: "TV Shows",
  kpop: "K-pop",
  comics: "Comics",
  manga: "Manga",
};

export default function PollsHub() {
  const { bookmarks, has: hasBookmark, toggle: toggleBookmark } = useBookmarks();

  const {
    filters,
    filteredItems: filteredPolls,
    categories,
    setCategory,
    setSortBy,
    setSearch,
    setBookmarkedOnly,
    resetFilters,
  } = useFilters(polls, {
    categoryKey: "category",
    popularityKey: "totalVotes",
    searchKeys: ["question"],
    initialFilters: { sortBy: "popular" },
    idKey: "id",
    bookmarks,
  });

  const totalVotes = polls.reduce((sum, p) => sum + p.totalVotes, 0);

  return (
    <div className="polls-hub">
      <header className="polls-hub-header">
        <h1>Polls</h1>
        <p className="polls-hub-count">{filteredPolls.length} polls · {totalVotes.toLocaleString()} total votes</p>
      </header>

      <FilterBar
        filters={filters}
        categories={["All", ...categories.slice(1).map(c => categoryLabels[c] || c)]}
        onSetCategory={(cat) => setCategory(cat === "All" ? "All" : Object.keys(categoryLabels).find(k => categoryLabels[k] === cat) || cat)}
        onSetSortBy={setSortBy}
        onSetSearch={setSearch}
        onSetBookmarkedOnly={setBookmarkedOnly}
        onReset={resetFilters}
        showTimeRange={false}
        showBookmarked={true}
        placeholder="Search polls..."
      />

      <div className="polls-grid" role="list">
        {filteredPolls.map((poll) => (
          <PollCard key={poll.id} poll={poll} isBookmarked={hasBookmark(poll.id)} onToggleBookmark={toggleBookmark} role="listitem" />
        ))}
      </div>

      {filteredPolls.length === 0 && (
        <div className="polls-empty">
          <p>No polls found matching your criteria.</p>
        </div>
      )}
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
        <span className="poll-category">{categoryLabels[poll.category] || poll.category}</span>
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
                <div
                  className="poll-bar-fill"
                  style={{ width: `${(opt.votes / poll.totalVotes) * 100}%` }}
                />
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