import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { characters } from "../data/characters.json";
import { articles } from "../data/articles.json";
import { polls } from "../data/polls.json";
import "../styles/global.css";
import "../styles/categories-page.css";

const CATEGORY_CONFIG = {
  anime: { label: "Anime", accent: "#A855F7", icon: "🎌", description: "Series, characters & seasonal polls" },
  gaming: { label: "Gaming", accent: "#22D3EE", icon: "🎮", description: "Games, protagonists & industry polls" },
  movies: { label: "Movies", accent: "#F59E0B", icon: "🎬", description: "Films, heroes & box office polls" },
  tvshows: { label: "TV Shows", accent: "#FB7185", icon: "📺", description: "Series, characters & finale polls" },
  kpop: { label: "K-pop", accent: "#EC4899", icon: "🎤", description: "Groups, idols & comeback polls" },
  comics: { label: "Comics", accent: "#EF4444", icon: "🦸", description: "Heroes, runs & event polls" },
  manga: { label: "Manga", accent: "#E5E5E5", icon: "📖", description: "Series, protagonists & magazine polls" },
};

const categoryOrder = ["anime", "gaming", "movies", "tvshows", "kpop", "comics", "manga"];

export default function CategoriesPage() {
  const stats = useMemo(() => {
    return categoryOrder.map((key) => {
      const config = CATEGORY_CONFIG[key];
      const charCount = characters.filter(c => c.category === key).length;
      const articleCount = articles.filter(a => a.category === key).length;
      const pollCount = polls.filter(p => p.category === key).length;
      const totalVotes = polls
        .filter(p => p.category === key)
        .reduce((sum, p) => sum + p.totalVotes, 0);
      return { key, ...config, charCount, articleCount, pollCount, totalVotes };
    });
  }, []);

  return (
    <div className="categories-page">
      <header className="categories-header">
        <h1>Categories</h1>
        <p className="categories-tagline">
          Explore {stats.reduce((s, c) => s + c.charCount, 0)} characters, 
          {stats.reduce((s, c) => s + c.articleCount, 0)} articles & 
          {stats.reduce((s, c) => s + c.pollCount, 0)} polls across {stats.length} fandoms
        </p>
      </header>

      <div className="categories-grid">
        {stats.map((cat) => (
          <Link key={cat.key} to={`/category/${cat.key}`} className="category-card" style={{ "--accent": cat.accent }}>
            <div className="category-card-icon" aria-hidden="true">{cat.icon}</div>
            <div className="category-card-content">
              <h2 className="category-card-title">{cat.label}</h2>
              <p className="category-card-desc">{cat.description}</p>
              <dl className="category-card-stats">
                <div><dt>Characters</dt><dd>{cat.charCount}</dd></div>
                <div><dt>Articles</dt><dd>{cat.articleCount}</dd></div>
                <div><dt>Polls</dt><dd>{cat.pollCount}</dd></div>
                <div><dt>Total Votes</dt><dd>{cat.totalVotes.toLocaleString()}</dd></div>
              </dl>
            </div>
            <span className="category-card-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}