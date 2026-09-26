import React from "react";
import { useParams, Link } from "react-router-dom";
import { articles } from "../data/articles.json";
import "../styles/article.css";

export default function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return (
      <div className="article-page article-not-found">
        <h2>404 - Article Not Found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  const accentStyle = { "--accent": article.accent };

  return (
    <article
      className="article-page"
      style={accentStyle}
      data-category={article.category}
    >
      <header className="article-header">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          {article.breadcrumbs?.map((crumb, i) => (
            <React.Fragment key={i}>
              {crumb.href && <Link to={crumb.href}>{crumb.label}</Link>}
              {!crumb.href && <span aria-current="page">{crumb.label}</span>}
              {i < article.breadcrumbs.length - 1 && (
                <span className="crumb-sep" aria-hidden="true">
                  /
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>

        <Link to="/" className="back-link">
          ← Back to feed
        </Link>
        <br/>

        <span className="article-category">{article.category}</span>
        <h1 className="article-title">{article.title}</h1>
        {article.subtitle && (
          <p className="article-subtitle">{article.subtitle}</p>
        )}

        <div className="article-meta">
          <div className="author">
            {article.author?.avatar && (
              <img
                src={article.author.avatar}
                alt=""
                className="author-avatar"
              />
            )}
            <span className="author-name">{article.author?.name}</span>
          </div>
          {article.publishedDate && (
            <time className="article-date" dateTime={article.publishedDate}>
              {new Date(article.publishedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          {article.readTime && (
            <span className="read-time">{article.readTime}</span>
          )}
        </div>
      </header>

      {(article.heroImage || article.imagePlaceholder) && (
        <figure className="article-hero">
          {article.heroImage ? (
            <img src={article.heroImage} alt={article.title} />
          ) : (
            <div
              className="hero-placeholder"
              style={{ background: article.imagePlaceholder?.bg }}
            >
              <span>{article.imagePlaceholder?.label}</span>
            </div>
          )}
        </figure>
      )}

      <div className="article-content editorial-body">
        {article.sections?.map((sec, idx) => {
          switch (sec.type) {
            case "paragraph":
              return <p key={idx}>{sec.content}</p>;
            case "heading":
              return <h2 key={idx}>{sec.content}</h2>;
            case "image":
              return (
                <figure key={idx} className="content-figure">
                  <img src={sec.url} alt={sec.caption || ""} />
                  {sec.caption && <figcaption>{sec.caption}</figcaption>}
                </figure>
              );
            case "quote":
              return (
                <blockquote key={idx} className="pull-quote">
                  <p>"{sec.quoteText}"</p>
                  {sec.author && <cite>— {sec.author}</cite>}
                </blockquote>
              );
            default:
              return null;
          }
        })}
      </div>

      <footer className="article-footer">
        <div className="article-tags">
          {article.tags?.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="article-share">
          <span>Share:</span>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
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
            href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(window.location.href)}`}
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
