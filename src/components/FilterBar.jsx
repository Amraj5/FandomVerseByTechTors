import React, { useState, useEffect } from "react";
import { SORT_OPTIONS, TIME_RANGE_OPTIONS } from "../hooks/useFilters";
import "../styles/FilterBar.css";

export function FilterBar({
  filters,
  categories,
  onSetCategory,
  onSetSortBy,
  onSetSearch,
  onSetTimeRange,
  onSetBookmarkedOnly,
  onReset,
  showCategory = true,
  showSort = true,
  showSearch = true,
  showTimeRange = false,
  showBookmarked = false,
  placeholder = "Search...",
  className = "",
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className={`filter-bar ${className}`}>
      {showSearch && (
        <div className="filter-bar-search">
          <input
            type="search"
            className="filter-input"
            placeholder={placeholder}
            value={filters.search}
            onChange={(e) => onSetSearch(e.target.value)}
            aria-label={placeholder}
          />
        </div>
      )}

      {showCategory && categories.length > 1 && (
        <div className="filter-bar-category" role="tablist" aria-label="Filter by category">
          {isMobile ? (
            <select
              className="filter-select filter-category-select"
              value={filters.category}
              onChange={(e) => onSetCategory(e.target.value)}
              aria-label="Filter by category"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          ) : (
            categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={filters.category === cat}
                className={`filter-chip ${filters.category === cat ? "active" : ""}`}
                onClick={() => onSetCategory(cat)}
              >
                {cat}
              </button>
            ))
          )}
        </div>
      )}

      {showSort && (
        <select
          className="filter-select"
          value={filters.sortBy}
          onChange={(e) => onSetSortBy(e.target.value)}
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {showTimeRange && (
        <select
          className="filter-select"
          value={filters.timeRange}
          onChange={(e) => onSetTimeRange(e.target.value)}
          aria-label="Time range"
        >
          {TIME_RANGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {showBookmarked && (
        <label className="filter-bookmark-toggle">
          <input
            type="checkbox"
            checked={filters.bookmarkedOnly}
            onChange={(e) => onSetBookmarkedOnly(e.target.checked)}
            aria-label="Show only bookmarked"
          />
          <span className="filter-bookmark-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            Bookmarked
          </span>
        </label>
      )}

      {Object.values(filters).some((v) => v !== "All" && v !== "recent" && v !== "" && v !== "all" && v !== false) && (
        <button className="filter-reset" onClick={onReset} type="button">
          Clear filters
        </button>
      )}
    </div>
  );
}

export function FilterChip({ label, active, onClick, className = "" }) {
  return (
    <button
      className={`filter-chip ${active ? "active" : ""} ${className}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}