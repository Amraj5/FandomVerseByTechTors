import './heroCarousel.css'
import { useState, useEffect, useRef } from 'react'
import TrendData from './data/trending.json'
import HeroData from './data/carousel.json'
import { FaStar } from "react-icons/fa";
import { IoChevronUp, IoChevronDown } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";

function HeroCarousel() {
  const trendListRef = useRef(null);

const scrollTrending = (direction) => {
  const el = trendListRef.current;

  if (!el) return;

  console.log("scrollWidth:", el.scrollWidth);
  console.log("clientWidth:", el.clientWidth);
  console.log("scrollLeft before:", el.scrollLeft);

  el.scrollLeft += direction === "left" ? -320 : 320;

  console.log("scrollLeft after:", el.scrollLeft);
};
    const [currentIndex, setCurrentIndex] = useState(0)
    const currentSlide = HeroData[currentIndex];

   const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
        if (prevIndex === HeroData.length - 1) {
            return 0;
        }

        return prevIndex + 1;
    });
};

useEffect(() => {
    const timer = setInterval(() => {
        nextSlide();
    }, 5000);

    return () => clearInterval(timer);
}, []);
     const previousSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return HeroData.length - 1;
      }

      return prevIndex - 1;
    });
  };
                    // For the trend section of the hero carousel
        const [trendingItems] = useState(() => {
  const shuffled = [...TrendData].sort(
    () => Math.random() - 0.5
  );

  return shuffled;
});
  
    return(

        <>
        <section className="hero-container">

                 <div className="hero-carousel">

                   <div
  className="hero-slide"
  style={{
    backgroundImage: `url("${currentSlide.image}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "550px",
    position:`relative`
  }}
>
    </div>

                    <div className="hero-info" key={currentSlide.id}>
                        <p className='hero-badge'>{currentSlide.badge}</p>
                        <h2>{currentSlide.title}</h2>
                        <p className='hero-summary'>{currentSlide.summary}</p>
                        <button className="hero-button button1">watch trailer</button>
                        <button className="hero-button button2">Add to list</button>
                    </div>
                            <div className="hero-navigation">

        <span className="hero-counter">
          {String(currentIndex + 1).padStart(2, "0")}
          {" / "}
          {String(HeroData.length).padStart(2, "0")}
        </span>

        <div className="hero-nav-buttons">

          <button onClick={previousSlide}>
          <IoChevronUp/>
          </button>

          <button onClick={nextSlide}>
          <IoChevronDown/>
          </button>

        </div>

      </div>
                        </div>
               
              {/* Trends Card Section */}
<div className="hero-trends">
  <div className="trends-header">
    <h2>Trending</h2>

    <button>
      View All
    </button>
  </div>

  <div className="trend-carousel">

    <button
      className="trend-arrow trend-arrow-left"
      onClick={() => scrollTrending("left")}
      aria-label="Previous trending items"
    >
      ←
    </button>

    <div className="trend-list" ref={trendListRef}>
      {trendingItems.map((item) => (
        <div className="trend-card" key={item.id}>

          <img
            src={item.image}
            alt={item.title}
            className="trend-image"
          />

          <div className="trend-info">

            <span
              className="trend-label"
              style={{ color: item.color }}
            >
              <GoDotFill />
              {item.categoryLabel}
            </span>

            <h3>{item.title}</h3>

            <p>
              <FaStar />
              {item.rating}
            </p>

          </div>

        </div>
      ))}
    </div>

    <button
      className="trend-arrow trend-arrow-right"
      onClick={() => scrollTrending("right")}
      aria-label="Next trending items"
    >
      →
    </button>

  </div>
</div>


           </section>    
        </>
    )
}

export default HeroCarousel;