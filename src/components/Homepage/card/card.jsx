import "./card.css";
import data from "../featuredmerch/data/fandomverse-dataset.json";

const Card = () => {
  return (
    <section className="featured-articles">
      <div className="articles-header">
        <div>
          <p className="section-label">FROM THE VERSE</p>
          <h2 className="cardHeader">Featured Articles</h2>
        </div>
      </div>

      <div className="art-container">
        {data.topicHubs.map((item) => (
        <article
    className={`card ${item.category
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    key={item.id}
>
            <div className="card-image">
              <img src={item.bannerImage} alt={item.category} />
            </div>

            <div className="card-content">
              <p className="card-category">{item.category}</p>

              <h3>{item.overview}</h3>

              <span className="read-more">
                Read story →
              </span>
            </div>

          </article>
        ))}
      </div>
    </section>
  );
};

export default Card;