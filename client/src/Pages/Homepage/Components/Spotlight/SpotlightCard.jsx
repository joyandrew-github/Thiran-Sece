import { useRef, useCallback } from 'react';
import './Spotlightcard.css';

/**
 * SpotlightCard
 * A card that rests flat on --surface. On hover (or keyboard focus, for
 * accessibility), a glow tracks the pointer and a pink → indigo gradient
 * ring draws itself around the border — matching the site's flame gradient.
 *
 * Usage:
 *   <SpotlightCard>
 *     <img src="..." alt="" />
 *     <h3>Leadership Talk</h3>
 *     <p>An inspiring session where iconic leaders share their story…</p>
 *     <a className="spotlight-btn" href="#">Register Now</a>
 *   </SpotlightCard>
 */
export default function SpotlightCard({
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}) {
  const cardRef = useRef(null);

  const handlePointerMove = useCallback((event) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }, []);

  return (
    <Tag
      ref={cardRef}
      className={`spotlight-card ${className}`.trim()}
      onMouseMove={handlePointerMove}
      {...rest}
    >
      <div className="spotlight-card__glow" aria-hidden="true" />
      <div className="spotlight-card__pattern" aria-hidden="true" />
      <div className="spotlight-card__content">{children}</div>
    </Tag>
  );
}