import React from 'react';
import './Marqueesection.css';

/* --------------------------------------------------------------------
   Marquee Items — signature event highlights with rich flame
   gradient styling matching the reference design.
-------------------------------------------------------------------- */
const DEFAULT_ITEMS = [
  'Techno-Cultural Battles',
  'Star Performances',
  '48-Hour Hackathon',
  'Live Concerts',
  'Robo Wars',
  'Prize Pool ₹15,00,000+',
  'Masterclasses & Workshops',
  'Pan-India Fest',
];

/**
 * Bold, chunky 8-pointed hollow asterisk / star polygon with gradient outline.
 */
function AsteriskIcon({ className, gradientId = "url(#marquee-star-grad)" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        points="
          47,19.5 47,28.5 36.5,29.2
          43.4,37.1 37.1,43.4 29.2,36.5
          28.5,47 19.5,47 18.8,36.5
          10.9,43.4 4.6,37.1 11.5,29.2
          1,28.5 1,19.5 11.5,18.8
          4.6,10.9 10.9,4.6 18.8,11.5
          19.5,1 28.5,1 29.2,11.5
          37.1,4.6 43.4,10.9 36.5,18.8
        "
        fill="none"
        stroke={gradientId}
        strokeWidth="1.6"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export default function MarqueeSection({
  items = DEFAULT_ITEMS,
  speed = 55,
  pauseOnHover = true,
}) {
  const renderTrack = (ariaHidden) => (
    <div
      className="marquee-section__group"
      aria-hidden={ariaHidden || undefined}
    >
      {items.map((word, i) => (
        <span className="marquee-section__item" key={`${word}-${i}`}>
          <span
            className={
              'marquee-section__text ' +
              (i % 2 === 0
                ? 'marquee-section__text--flame-1'
                : 'marquee-section__text--flame-2')
            }
          >
            {word}
          </span>
          <AsteriskIcon
            className="marquee-section__divider"
            gradientId={i % 2 === 0 ? "url(#marquee-star-grad-1)" : "url(#marquee-star-grad-2)"}
          />
        </span>
      ))}
    </div>
  );

  return (
    <section
      className={
        'marquee-section' +
        (pauseOnHover ? ' marquee-section--pause-on-hover' : '')
      }
      aria-label={items.join(', ')}
    >
      {/* SVG linear gradient definitions used by the rotating stars */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="marquee-star-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E91A83" />
            <stop offset="60%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="marquee-star-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#E91A83" />
          </linearGradient>
        </defs>
      </svg>

      <div className="marquee-section__viewport">
        <div
          className="marquee-section__track"
          style={{ '--marquee-duration': `${speed}s` }}
        >
          {/* Two identical groups placed side-by-side create a seamless infinite loop */}
          {renderTrack(false)}
          {renderTrack(true)}
        </div>
      </div>
    </section>
  );
}