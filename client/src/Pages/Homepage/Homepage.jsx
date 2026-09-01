import HeroSection from "./Components/HeroSection/HeroSection";
import AboutSection from "./Components/AboutSection/AboutSection";
import CountdownSection from "./Components/CountdownSection/CountdownSection";
import InfoComponent from "./Components/InfoComponent/InfoComponent";
import EventsGrid from "./Components/EventsGrid/EventsGrid";
import MarqueeSection from "./Components/Marqueesection/Marqueesection";
import SpotlightEventsPage from "./Components/Spotlight/Spotlightseventspage";
import SportsFest from "./Components/SportsFest/SportsFest";
import Glimpses from "./Components/Glimpses/Glimpses";
import FAQSection from "./Components/FaqSection/Faqsection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CountdownSection />
      <InfoComponent />
      <AboutSection />
      <EventsGrid />
      <MarqueeSection />
      <SpotlightEventsPage />
      <SportsFest />
      <Glimpses/>
      <FAQSection/>
    </>
  );
}