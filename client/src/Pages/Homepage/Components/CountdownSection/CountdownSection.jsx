import { useEffect, useRef, useState } from "react";
import "./CountdownSection.css";
import lightFlare from "../../../../assets/home-1-light.png";

// Thiran 2027 fires up on this date — every unit below counts down to it.
const EVENT_DATE = new Date("2027-02-04T00:00:00");

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
];

function getTimeLeft() {
  const diff = EVENT_DATE.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, done: false };
}

// A single split-flap style digit tile. Re-plays its flip animation
// whenever the value it's showing actually changes.
function FlapUnit({ value, label, index }) {
  const padded = String(value).padStart(2, "0");
  const prevValue = useRef(padded);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (prevValue.current !== padded) {
      prevValue.current = padded;
      setFlip(true);
      const t = setTimeout(() => setFlip(false), 460);
      return () => clearTimeout(t);
    }
  }, [padded]);

  return (
    <div
      className="flap-unit"
      style={{ "--i": index }}
      role="group"
      aria-label={`${value} ${label}`}
    >
      <div className={`flap-unit__face ${flip ? "flap-unit__face--flip" : ""}`}>
        <span className="flap-unit__value" aria-hidden="true">
          {padded}
        </span>
      </div>
      <span className="flap-unit__label">{label}</span>
    </div>
  );
}

export default function CountdownSection() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="countdown" id="countdown">
      {/* Decorative light flare — same signature glow used in About */}
      <div className="countdown__flare" aria-hidden="true">
        <img src={lightFlare} alt="" />
      </div>

      <div className="container countdown__inner">
        <span className="countdown__eyebrow">Ignition Sequence</span>
        <h2 className="countdown__heading">
          The Countdown to
          <span className="countdown__heading-accent">Thiran 2027</span>
        </h2>
        <p className="countdown__date">
          <span className="countdown__date-dot" aria-hidden="true" />
          4<sup>th</sup>&nbsp;February&nbsp;2027 &middot; Sri&nbsp;Eshwar&nbsp;College&nbsp;of&nbsp;Engineering
        </p>

        {/* Live timer, or a launch banner once the countdown hits zero */}
        {time.done ? (
          <p className="countdown__live" role="status">
            Thiran 2027 is live right now — see you on campus!
          </p>
        ) : (
          <div
            className="countdown__timer"
            role="timer"
            aria-live="polite"
            aria-atomic="true"
          >
            {UNITS.map((u, i) => (
              <div className="countdown__unit-wrap" key={u.key}>
                <FlapUnit value={time[u.key]} label={u.label} index={i} />
                {i < UNITS.length - 1 && (
                  <span className="countdown__colon" aria-hidden="true">
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}