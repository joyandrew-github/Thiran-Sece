import heroBanner from "./hero-banner.jpg";
import "./HeroSection.css";

// The poster already contains every piece of hero copy (logo, dates, prize
// value, event list) — this component's only job is to present it cleanly,
// full-bleed, with no text layered on top.
export default function HeroSection() {
  return (
    <section className="hero" aria-label="Thiran 2027 event poster">
      <img
        src={heroBanner}
        alt="Sri Eshwar Thiran 2027 — Confluence of Talents. A national level inter-college techno cultural sports fest, Feb 4, 5 & 6, 2027. ₹15 Lakh worth of prizes."
        className="hero__image"
      />
    </section>
  );
}