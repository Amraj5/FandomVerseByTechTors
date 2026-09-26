import "./card.css";
import { Link } from "react-router-dom";
import data from "../featuredmerch/data/fandomverse-dataset.json";

const Card = () => {
  const articles = data.carousel.slice(0, 8);

  return (
    <section className="featured-articles">
      <div className="articles-header">
        <div className="articles-header-text" >
          <p className="section-label">FROM THE VERSE</p>
          <h2 className="cardHeader">Featured Articles</h2>
        </div>
        <Link to="/articles" className="view-all-link">View all →</Link>
      </div>

      <div className="art-container">
        {articles.map((item) => (
          <Link to={item.ctaUrl} className={`card ${item.category.toLowerCase().replace(/\s+/g, "-")}`} key={item.id}>
            <div className="card-image">
              <img src={item.imageUrl[0]} alt={item.title} loading="lazy" />
            </div>
            <div className="card-content">
              <p className="card-category">{item.category}</p>
              <h3>{item.title}</h3>
              <span className="read-more">
                {item.ctaText || "Read story"} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Card;