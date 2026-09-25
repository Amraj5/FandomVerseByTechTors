import Navbar from "../components/Navbar/Navbar";
import HeroCarousel from "../components/Homepage/HeroCarousel/heroCarousel";
import Explore from "../components/Homepage/Explore/explore"
import Footer from "../components/Footer/Footer"
import MerchCard from "../components/Homepage/featuredmerch/MerchCard";
import Card from "../components/Homepage/card/card"

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroCarousel />
        <Explore />
        <MerchCard/>
        <Card/>
      </main>
      <Footer/>
    </>
  );
}

export default Home;