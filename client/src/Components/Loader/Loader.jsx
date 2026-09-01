import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import "./Loader.css";

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Disable body scroll while loader is active
    document.body.style.overflow = "hidden";

    // Progress counter animation
    const startTime = Date.now();
    const duration = 3000; // 2.5s duration

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(progressPercent);

      if (progressPercent >= 100) {
        clearInterval(interval);
        // Start exit transition
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            setLoading(false);
            document.body.style.overflow = "";
          }, 600); // Wait for fade-out transition to complete
        }, 200);
      }
    }, 25);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  if (!loading) return null;

  return (
    <div className={`thiran-loader-overlay ${isExiting ? "thiran-loader--exiting" : ""}`}>
      {/* Background ambient glow orbs */}
      <div className="thiran-loader-glow-orb thiran-loader-glow-orb--pink" />
      <div className="thiran-loader-glow-orb thiran-loader-glow-orb--indigo" />
      <div className="thiran-loader-grid-lines" />

      <div className="thiran-loader-content">
        {/* Brand Logo with pulse effect */}
        <div className="thiran-loader-brand">
          <div className="thiran-loader-logo-wrapper">
            <img src={logo} alt="Thiran 2027" className="thiran-loader-logo" />
            <div className="thiran-loader-logo-glow" />
          </div>
          <span className="thiran-loader-subtitle">Sri Eshwar College of Engineering</span>
        </div>

        {/* Big 10 Animated Equalizer Bars */}
        <div className="thiran-loader-equalizer" aria-label="Loading animation">
          <div className="thiran-loader-bar bar1" />
          <div className="thiran-loader-bar bar2" />
          <div className="thiran-loader-bar bar3" />
          <div className="thiran-loader-bar bar4" />
          <div className="thiran-loader-bar bar5" />
          <div className="thiran-loader-bar bar6" />
          <div className="thiran-loader-bar bar7" />
          <div className="thiran-loader-bar bar8" />
          <div className="thiran-loader-bar bar9" />
          <div className="thiran-loader-bar bar10" />
        </div>

        {/* Progress & Status */}
        <div className="thiran-loader-info">
          <span className="thiran-loader-status">
            <span className="thiran-loader-dot" />
            IGNITING INNOVATION
          </span>
          <span className="thiran-loader-percent">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
