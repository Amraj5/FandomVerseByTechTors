import HeroCarousel from "./components/Homepage/HeroCarousel/heroCarousel";
import Explore from "./components/Homepage/Explore/explore";
import MerchCard from "./components/Homepage/featuredmerch/MerchCard";
import Card from "./components/Homepage/card/card";
import EventsSection from "./components/Homepage/EventsSection/EventsSection";
import QuickGuidesSection from "./components/Homepage/QuickGuidesSection/QuickGuidesSection";

function Home() {
  return (
    <main>
      <HeroCarousel />
      <Explore />
      <MerchCard />
      <Card />
      <EventsSection />
      <QuickGuidesSection />
    </main>
  );
}

export default Home;
