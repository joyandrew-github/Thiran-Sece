import "./EventsGrid.css";
import bgImage from "../../../../assets/events-grid-bg.png";
import hackathonImg from "../../../../assets/hackathons.jpg";
import workshopImg from "../../../../assets/workshops.jpg";
import masterclassImg from "../../../../assets/masterclass.jpg";
import projectExpoImg from "../../../../assets/Project-expo.jpg";
import paperPresentationImg from "../../../../assets/paper-presentation.jpg";
import techEventsImg from "../../../../assets/tech.jpg";
import nonTechEventsImg from "../../../../assets/non-tech.jpg";
import culturalContestsImg from "../../../../assets/culturalcontest.jpg";

const events = [
  { label: "Hackathons", image: hackathonImg },
  { label: "Workshops", image: workshopImg },
  { label: "Master Class", image: masterclassImg },
  { label: "Project Expo", image: projectExpoImg },
  { label: "Paper Presentation", image: paperPresentationImg },
  { label: "Tech Events", image: techEventsImg },
  { label: "Non Tech Events", image: nonTechEventsImg },
  { label: "Cultural Contests", image: culturalContestsImg },
];

export default function EventsGrid() {
  return (
    <section
      className="events-grid"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Reusable rounded-triangle clip path, referenced by CSS below */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <clipPath id="event-triangle-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.04 C0.56,0.04 0.6,0.08 0.63,0.14 L0.87,0.78 C0.91,0.87 0.89,0.94 0.79,0.94 L0.21,0.94 C0.11,0.94 0.09,0.87 0.13,0.78 L0.37,0.14 C0.4,0.08 0.44,0.04 0.5,0.04 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="events-grid__overlay" aria-hidden="true" />

      <div className="container events-grid__wrap">
        <div className="events-grid__list">
          {events.map((e) => (
            <div className="event-card" key={e.label}>
              <div className="event-card__circle-wrap">
                <span
                  className="event-card__backdrop event-card__backdrop--one"
                  aria-hidden="true"
                />
                <span
                  className="event-card__backdrop event-card__backdrop--two"
                  aria-hidden="true"
                />
                <div className="event-card__circle">
                  <img src={e.image} alt={e.label} loading="lazy" />
                </div>
              </div>
              <span className="event-card__label">{e.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}