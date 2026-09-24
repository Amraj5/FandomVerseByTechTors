import './explore.css'

function Explore(){
     const categories = [
        {
            name: "Anime",
            image: "https://wallpapercave.com/wp/wp8553732.jpg",
            className: "anime"
        },
        {
            name: "K-Pop",
            image: "https://wallpapercave.com/wp/wp15161197.webp",
            className: "kpop"
        },
        {
            name: "Gaming",
            image: "https://wallpapercave.com/wp/wp8049271.jpg",
            className: "gaming"
        },
        {
            name: "Movies",
            image: "https://wallpapercave.com/wp/wp14175568.jpg",
            className: "movies"
        },
        {
            name: "TV Shows",
            image: "https://wallpapercave.com/wp/wp13986521.jpg",
            className: "tv"
        },
        {
            name: "Manga",
            image: "https://wallpapercave.com/wp/wp5277659.jpg",
            className: "manga"
        }
    ]

    return(
        <>
                <section className='explore-verse'>

                    <div className="explore-header">
                <p>EXPLORE THE VERSE</p>
                <h2>Find your next fandom.</h2>
            </div>
            <div className="explore-map">

                {categories.map((category) => (
                    <div
                        className={`explore-category ${category.className}`}
                        key={category.name}
                    >
                        <img
                            src={category.image}
                            alt={category.name}
                        />

                        <span>{category.name}</span>
                    </div>
                ))}

                <div className="explore-center">
                    <span>✦</span>
                    <h2>FandomVerse</h2>
                </div>

            </div>
                </section>
        </>
    )
}

export default Explore;