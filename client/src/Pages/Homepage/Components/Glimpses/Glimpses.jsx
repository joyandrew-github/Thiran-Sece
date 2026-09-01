import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Glimpses.css';

import big1Img from '../../../../assets/Glimpses/bigimag.webp';
import square1Img from '../../../../assets/Glimpses/admin-ajax.webp';
import square2Img from '../../../../assets/Glimpses/admin-ajax-1.webp';
import square3Img from '../../../../assets/Glimpses/admin-ajax-2.webp';
import square4Img from '../../../../assets/Glimpses/admin-ajax-3.webp';
import big2Img from '../../../../assets/Glimpses/bigimg2.webp';
import square5Img from '../../../../assets/Glimpses/admin-ajax-4.webp';
import square6Img from '../../../../assets/Glimpses/admin-ajax-5.webp';
import square7Img from '../../../../assets/Glimpses/admin-ajax-6.webp';
import square8Img from '../../../../assets/Glimpses/admin-ajax-7.webp';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * 10 curated bento glimpses: 2 big (2x2) and 8 square (1x1) tiles,
 * creating a mathematically balanced 16-cell (4x4) gapless bento grid.
 */
const DEFAULT_ITEMS = [
  { id: '1', img: big1Img, size: 'big', alt: 'Grand Arena Stage & Concerts', caption: 'Grand Arena Stage' },
  { id: '2', img: square1Img, size: 'square', alt: 'Crowd Energy', caption: 'Crowd Energy' },
  { id: '3', img: square2Img, size: 'square', alt: 'Star Performances', caption: 'Star Performances' },
  { id: '4', img: square3Img, size: 'square', alt: 'Cultural Highlights', caption: 'Cultural Highlights' },
  { id: '5', img: square4Img, size: 'square', alt: 'Live Band Battles', caption: 'Live Band Battles' },
  { id: '6', img: big2Img, size: 'big', alt: 'Electrifying Night Lights', caption: 'Electrifying Night Lights' },
  { id: '7', img: square5Img, size: 'square', alt: 'Unforgettable Moments', caption: 'Unforgettable Moments' },
  { id: '8', img: square6Img, size: 'square', alt: 'Spotlight Showdowns', caption: 'Spotlight Showdowns' },
  { id: '9', img: square7Img, size: 'square', alt: 'Vibrant Beats', caption: 'Vibrant Beats' },
  { id: '10', img: square8Img, size: 'square', alt: 'Festival Vibes', caption: 'Festival Vibes' },
];

const preloadImages = async (urls) => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

const Glimpses = ({
  items = DEFAULT_ITEMS,
  duration = 0.85,
  ease = 'power3.out',
}) => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [imagesReady, setImagesReady] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    preloadImages(items.map((i) => i.img)).then(() => setImagesReady(true));
  }, [items]);

  useLayoutEffect(() => {
    if (!imagesReady || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header scroll reveal
      gsap.fromTo(
        '.glimpses-header > *',
        { opacity: 0, y: 35, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.glimpses-header',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Bento tiles scroll reveal
      const tiles = containerRef.current.querySelectorAll('.glimpse-tile');
      gsap.fromTo(
        tiles,
        { opacity: 0, y: 55, scale: 0.92, filter: 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration,
          ease,
          stagger: {
            amount: 0.55,
            grid: [4, 4],
            from: 'start',
          },
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      // CTA Button scroll reveal
      gsap.fromTo(
        '.glimpses-cta',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.glimpses-cta',
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [imagesReady, duration, ease]);

  // Close the lightbox on Escape key
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === 'Escape' && setActive(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  const handleEnter = (e) => {
    const img = e.currentTarget.querySelector('.glimpse-tile__img');
    const glow = e.currentTarget.querySelector('.glimpse-tile__glow');
    if (img) gsap.to(img, { scale: 1.08, duration: 0.5, ease: 'power2.out' });
    if (glow) gsap.to(glow, { opacity: 1, duration: 0.35 });
  };

  const handleLeave = (e) => {
    const img = e.currentTarget.querySelector('.glimpse-tile__img');
    const glow = e.currentTarget.querySelector('.glimpse-tile__glow');
    if (img) gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out' });
    if (glow) gsap.to(glow, { opacity: 0, duration: 0.35 });
  };

  return (
    <section className="glimpses-section" ref={sectionRef} aria-label="Fest Glimpses">
      <div className="glimpses-container">
        <div className="glimpses-header">
          <span className="eyebrow">Thiran 2026 · Memories</span>
          <h2>
            Memories of <span>Thiran 2026</span>
          </h2>
          <p>
            A snapshot of the passion, the adrenaline, and the unforgettable moments from our flagship fest.
          </p>
        </div>

        <div className="glimpses" ref={containerRef}>
          {items.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`glimpse-tile glimpse-tile--${item.size}`}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              onClick={() => setActive(item)}
            >
              <img
                className="glimpse-tile__img"
                src={item.img}
                alt={item.alt ?? ''}
                loading="lazy"
                decoding="async"
              />
              <div className="glimpse-tile__glow" aria-hidden="true" />
              {item.caption && <span className="glimpse-tile__caption">{item.caption}</span>}
            </button>
          ))}
        </div>

        <div className="glimpses-cta">
          <a
            href="https://thiran.sece.ac.in"
            target="_blank"
            rel="noreferrer"
            className="glimpses-btn"
          >
            Know More
            <svg
              className="glimpses-btn__arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {active && (
        <div
          className="glimpse-lightbox"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <img
            src={active.img}
            alt={active.alt ?? ''}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="glimpse-lightbox__close"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
};

export default Glimpses;