import React from "react";
import { useParams, Link } from "react-router-dom";
import { characters } from "../data/characters.json";
import "../styles/global.css";
import "../styles/character.css";

export default function CharacterPage() {
  const { slug } = useParams();
  console.log("CharacterPage slug:", slug);
  console.log("Characters loaded:", characters.length);
  const character = characters.find((item) => item.slug === slug);
  console.log("Found character:", character);

  if (!character) {
    return (
      <div className="character-page character-not-found">
        <h2>404 - Character Not Found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  const accentStyle = { "--accent": character.accent };

  return (
    <div
      className="character-page"
      style={accentStyle}
      data-category={character.category}
    > 

      <header className="character-header">
        <figure className="character-portrait">
          {character.image ? (
            <img src={character.image} alt={character.name} />
          ) : (
            <div
              className="portrait-placeholder"
              style={{ background: character.imagePlaceholder?.bg }}
            >
              <span>{character.imagePlaceholder?.label}</span>
            </div>
          )}
        </figure>

        <div className="character-meta">
          <span className="character-category">{character.category}</span>
          <span className="character-franchise">{character.franchise}</span>
          <h1 className="character-name">{character.name}</h1>
          <p className="character-role">{character.role}</p>
          {character.series !== character.franchise && (
            <p className="character-series">{character.series}</p>
          )}
        </div>
      </header>

      <div className="character-body">
        <section className="character-section biography-section">
          <h2>Biography</h2>
          <div className="editorial-body">
            <p>{character.biography}</p>
          </div>
        </section>

        <section className="character-section traits-section">
          <h2>Key Traits</h2>
          <ul className="traits-list">
            {character.traits?.map((trait, i) => (
              <li key={i} className="trait-chip">
                {trait}
              </li>
            ))}
          </ul>
        </section>

        {character.relatedCharacters?.length > 0 && (
          <section className="character-section related-section">
            <h2>Related Characters</h2>
            <div className="related-grid">
              {character.relatedCharacters.map((relatedId) => {
                const related = characters.find((c) => c.id === relatedId);
                if (!related) return null;
                return (
                  <Link
                    key={related.id}
                    to={related.href}
                    className="related-card"
                  >
                    <div
                      className="related-thumb"
                      style={{ background: related.imagePlaceholder?.bg }}
                    >
                      {related.image && (
                        <img src={related.image} alt={related.name} />
                      )}
                    </div>
                    <div className="related-info">
                      <span className="related-franchise">
                        {related.franchise}
                      </span>
                      <h3 className="related-name">{related.name}</h3>
                      <p className="related-role">{related.role}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {character.gallery?.length > 0 && (
          <section className="character-section gallery-section">
            <h2>Gallery</h2>
            <div className="gallery-grid">
              {character.gallery.map((img, i) => (
                <figure key={i} className="gallery-item">
                  <img src={img.url} alt={img.caption || character.name} />
                  {img.caption && <figcaption>{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}

        {character.mediaFilter && (
          <section className="character-section media-section">
            <h2>Media</h2>
            <div className="media-notice">
              <p>
                Media filtering by category:{" "}
                {character.mediaFilter.filter?.category}
              </p>
              <p>Franchise: {character.mediaFilter.filter?.franchise}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
