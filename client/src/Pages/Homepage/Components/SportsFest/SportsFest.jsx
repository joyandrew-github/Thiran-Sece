import React from 'react';
import './SportsFest.css';
import sportsBannerImg from '../../../../assets/SPORTS HERO BANNER.webp';

export default function SportsFest() {
  return (
    <section className="sports-fest-section" aria-label="Sports Fest">
      <div className="sports-fest-section__container">
        <div className="sports-fest-banner">
          <img
            src={sportsBannerImg}
            alt="Thiran 2027 Sports Fest Banner"
            className="sports-fest-banner__img"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
