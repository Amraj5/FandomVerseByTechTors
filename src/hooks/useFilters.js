import { useState, useMemo, useCallback, useEffect } from "react";

const STORAGE_KEY = "fandomverse_bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...bookmarks]));
    } catch {}
  }, [bookmarks]);

  const toggle = useCallback((id) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const has = useCallback((id) => bookmarks.has(id), [bookmarks]);

  return { bookmarks, toggle, has };
}

const FILTER_DEFAULTS = {
  category: "All",
  sortBy: "recent",
  search: "",
  timeRange: "all",
  status: "all",
  bookmarkedOnly: false,
};

export function useFilters(items, config = {}) {
  const {
    categoryKey = "category",
    dateKey = "publishedDate",
    popularityKey = "totalVotes",
    searchKeys = ["name", "title", "franchise", "question"],
    initialFilters = {},
    idKey = "id",
    bookmarks,
  } = config;

  const [filters, setFilters] = useState(() => ({
    ...FILTER_DEFAULTS,
    ...initialFilters,
  }));

  const categories = useMemo(() => {
    const cats = new Set(items.map((item) => item[categoryKey]).filter(Boolean));
    return ["All", ...Array.from(cats).sort()];
  }, [items, categoryKey]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter((item) =>
        searchKeys.some((key) => {
          const val = item[key];
          return val && String(val).toLowerCase().includes(q);
        })
      );
    }

    if (filters.category !== "All") {
      result = result.filter((item) => item[categoryKey] === filters.category);
    }

    if (filters.bookmarkedOnly && bookmarks) {
      result = result.filter((item) => bookmarks.has(item[idKey] || item.slug));
    }

    if (filters.timeRange !== "all" && dateKey) {
      const now = new Date();
      const cutoff = new Date(now);
      switch (filters.timeRange) {
        case "day":
          cutoff.setDate(now.getDate() - 1);
          break;
        case "week":
          cutoff.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoff.setMonth(now.getMonth() - 1);
          break;
        case "year":
          cutoff.setFullYear(now.getFullYear() - 1);
          break;
      }
      result = result.filter((item) => {
        const d = item[dateKey] ? new Date(item[dateKey]) : null;
        return d && d >= cutoff;
      });
    }

    if (filters.status !== "all") {
      result = result.filter((item) => item.status === filters.status);
    }

    switch (filters.sortBy) {
      case "recent":
        if (dateKey) {
          result.sort((a, b) => new Date(b[dateKey] || 0) - new Date(a[dateKey] || 0));
        }
        break;
      case "popular":
        if (popularityKey) {
          result.sort((a, b) => (b[popularityKey] || 0) - (a[popularityKey] || 0));
        }
        break;
      case "alphabetical":
        result.sort((a, b) => {
          const an = a.name || a.title || "";
          const bn = b.name || b.title || "";
          return an.localeCompare(bn);
        });
        break;
      case "oldest":
        if (dateKey) {
          result.sort((a, b) => new Date(a[dateKey] || 0) - new Date(b[dateKey] || 0));
        }
        break;
    }

    return result;
  }, [items, filters, categoryKey, dateKey, popularityKey, searchKeys, bookmarks, idKey]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(FILTER_DEFAULTS);
  }, []);

  const setCategory = useCallback((cat) => updateFilter("category", cat), [updateFilter]);
  const setSortBy = useCallback((sort) => updateFilter("sortBy", sort), [updateFilter]);
  const setSearch = useCallback((q) => updateFilter("search", q), [updateFilter]);
  const setTimeRange = useCallback((range) => updateFilter("timeRange", range), [updateFilter]);
  const setStatus = useCallback((status) => updateFilter("status", status), [updateFilter]);
  const setBookmarkedOnly = useCallback((val) => updateFilter("bookmarkedOnly", val), [updateFilter]);

  return {
    filters,
    filteredItems,
    categories,
    updateFilter,
    resetFilters,
    setCategory,
    setSortBy,
    setSearch,
    setTimeRange,
    setStatus,
    setBookmarkedOnly,
  };
}

export const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Popular" },
  { value: "alphabetical", label: "A–Z" },
  { value: "oldest", label: "Oldest First" },
];

export const TIME_RANGE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "day", label: "Last 24h" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
  { value: "year", label: "Last Year" },
];

export const CATEGORY_DISPLAY_MAP = {
  anime: "Anime",
  gaming: "Gaming",
  movies: "Movies",
  tvshows: "TV Shows",
  kpop: "K-pop",
  comics: "Comics",
  manga: "Manga",
};