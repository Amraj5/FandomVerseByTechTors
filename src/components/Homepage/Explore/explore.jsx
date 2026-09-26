import "./explore.css";
import { Link } from "react-router-dom";

function Explore() {
  const categories = [
    {
      name: "Anime",
      image: "https://wallpapercave.com/wp/wp8553732.jpg",
      className: "anime",
      link: "/anime",
    },
    {
      name: "K-Pop",
      image: "https://wallpapercave.com/wp/wp15161197.webp",
      className: "kpop",
      link: "/kpop",
    },
    {
      name: "Gaming",
      image: "https://wallpapercave.com/wp/wp8049271.jpg",
      className: "gaming",
      link: "/gaming",
    },
    {
      name: "Movies",
      image: "https://wallpapercave.com/wp/wp14175568.jpg",
      className: "movies",
      link: "/movies",
    },
    {
      name: "TV Shows",
      image: "https://wallpapercave.com/wp/wp13986521.jpg",
      className: "tvshows",
      link: "/tv-shows",
    },
    {
      name: "Manga",
      image: "https://wallpapercave.com/wp/wp5277659.jpg",
      className: "manga",
      link: "/manga",
    },
  ];

  return (
    <section className="explore-verse">
      <video className="explore-video" autoPlay muted loop playsInline>
        <source src="src\assets\explore-bg.mp4" type="video/mp4" />
      </video>

      <div className="explore-overlay"></div>

      <div className="explore-content">
        <div className="explore-header">
          <p>EXPLORE THE VERSE</p>
          <h2>Find your next fandom.</h2>
        </div>

        <div className="explore-orbits">
          {categories.map((category) => (
            <Link
              to={category.link}
              className={`explore-orbit ${category.className}`}
              key={category.name}
            >
              <div className="orbit-image">
                <img src={category.image} alt={category.name} />
              </div>

              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Explore;
