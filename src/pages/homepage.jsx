import Navbar from "../components/Navbar/Navbar";
import HeroCarousel from "../components/Homepage/HeroCarousel/heroCarousel";
import Explore from "../components/Homepage/Explore/explore"
import Footer from "../components/Footer/Footer"
import MerchCard from "../components/Homepage/featuredmerch/merchcard";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroCarousel />
        <Explore />
        <MerchCard/>
      </main>
      <Footer/>
    </>
  );
}

export default Home;