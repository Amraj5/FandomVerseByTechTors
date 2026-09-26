import React from "react";
import { Link } from "react-router-dom";
import { characters } from "../data/characters.json";
import { CharacterCard } from "../components/CharacterCard";
import { useFilters } from "../hooks/useFilters";
import { FilterBar } from "../components/FilterBar";
import { useBookmarks } from "../hooks/useFilters";
import "../styles/global.css";
import "../styles/character-hub.css";
import "../styles/FilterBar.css";

const categoryDisplayMap = {
  anime: "Anime",
  gaming: "Gaming",
  movies: "Movies",
  tvshows: "TV Shows",
  kpop: "K-pop",
  comics: "Comics",
  manga: "Manga",
};

export default function CharacterHub() {
  const { bookmarks, has: hasBookmark, toggle: toggleBookmark } = useBookmarks();

  const {
    filters,
    filteredItems: filteredCharacters,
    categories,
    setCategory,
    setSortBy,
    setSearch,
    setBookmarkedOnly,
    resetFilters,
  } = useFilters(characters, {
    categoryKey: "category",
    searchKeys: ["name", "franchise", "role"],
    initialFilters: { sortBy: "alphabetical" },
    idKey: "id",
    bookmarks,
  });

  // Map display names back to raw values for filter
  const handleSetCategory = (displayName) => {
    const raw = Object.keys(categoryDisplayMap).find(k => categoryDisplayMap[k] === displayName) || displayName;
    setCategory(raw);
  };

  return (
    <div className="character-hub">

      <FilterBar
        filters={filters}
        categories={categories.map(c => categoryDisplayMap[c] || c)}
        onSetCategory={handleSetCategory}
        onSetSortBy={setSortBy}
        onSetSearch={setSearch}
        onSetBookmarkedOnly={setBookmarkedOnly}
        onReset={resetFilters}
        showTimeRange={false}
        showBookmarked={true}
        placeholder="Search characters..."
      />

      <div className="character-hub-grid" role="list">
        {filteredCharacters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            role="listitem"
            isBookmarked={hasBookmark(character.id)}
            onToggleBookmark={toggleBookmark}
          />
        ))}
      </div>

      {filteredCharacters.length === 0 && (
        <div className="character-hub-empty">
          <p>No characters found.</p>
        </div>
      )}
    </div>
  );
}