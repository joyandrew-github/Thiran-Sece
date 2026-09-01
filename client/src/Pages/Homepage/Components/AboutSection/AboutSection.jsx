import "./AboutSection.css";
import WaveBackground from "../WaveBackground/WaveBackground"; // adjust path to match your project structure

// Stats that carry a number get rendered as bold metric cards;
// stats that are category labels (no count) get rendered as tag chips —
// the distinction itself communicates which figures are the headline facts.
const metricStats = [
  { value: "180+", label: "Events" },
  { value: "20L", label: "Worth Prizes" },
  { value: "08", label: "Hackathons" },
  { value: "35", label: "Workshops & Masterclasses" },
  { value: "80+", label: "Tech & Non-Tech Events" },
  { value: "10+", label: "Sports Events" },
];

const tagStats = ["Spotlight Events", "Cultural Events & Contests", "Celebrity Shows"];

export default function AboutSection() {
  return (
    <section className="about" id="about">
      {/* Animated wave background — sits behind everything else in this section */}
      <WaveBackground />

      <div className="container about__grid">
        {/* Stats */}
        <div className="about__stats" aria-label="Event highlights">
          <div className="about__metric-grid">
            {metricStats.map((s) => (
              <div className="metric-card" key={s.label}>
                <span className="metric-card__value">{s.value}</span>
                <span className="metric-card__label">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="about__tags">
            {tagStats.map((t) => (
              <span className="about__tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Copy */}
        <div className="about__copy">
          <span className="about__eyebrow">About Event</span>
          <h2 className="about__heading">
            Thiran 2027
            <span className="about__heading-accent">is here!</span>
          </h2>
          <p className="about__text">
            Sri Eshwar's mega inter-college techno-cultural-sports fest is on its
            way! Students from all across the nation will be coming in to
            showcase their skills in every aspect — a confluence of talents in
            the truest sense! Participate in hackathons, attend workshops or
            masterclasses, or test your skills in exciting tech and non-tech
            challenges. It's going to be non-stop tech-frenzy! At the end of
            each day, vibe with your friends as you enjoy mega celebrity
            performances. It's going to be awesome!
          </p>
          <a
            className="about__link"
            href="https://thiran.sece.ac.in/about-thiran/"
            target="_blank"
            rel="noreferrer"
          >
            Read More
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3.5 12.5L12.5 3.5M12.5 3.5H5.5M12.5 3.5V10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}