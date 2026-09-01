import { useEffect, useRef } from "react";
import "./WaveBackground.css";

/**
 * WaveBackground
 * -----------------------------------------------------------------------
 * Ultra-smooth decorative canvas animation: flowing 3D wave ribbon
 * surface with glowing particles.
 * Fully optimized for zero scroll lag with Lenis:
 * - Isolated GPU compositing layer (`translate3d`, `contain: strict`).
 * - Early viewport waking (`rootMargin: "400px 0px"`) to prevent scroll hitch.
 * - Capped DPR and optimized sub-pixel step rendering.
 * - Zero Garbage Collection allocations during animation loop.
 */
export default function WaveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const parent = canvas.parentElement;
    if (!parent || !ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobileQuery = window.matchMedia("(max-width: 768px)");

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    let rafId = null;
    let time = 0;
    let destroyed = false;
    let isVisible = true;
    let isTabActive = !document.hidden;
    let isMobile = isMobileQuery.matches;

    // Theme color resolution from CSS tokens
    const styles = getComputedStyle(document.documentElement);
    const pink = (styles.getPropertyValue("--pink") || "#E91A83").trim();
    const indigo = (styles.getPropertyValue("--indigo") || "#4C24C1").trim();

    const hexToRgb = (hex) => {
      const clean = hex.replace("#", "");
      const bigint = parseInt(clean, 16);
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };
    const pinkRgb = hexToRgb(pink);
    const indigoRgb = hexToRgb(indigo);
    const lerp = (a, b, t) => a + (b - a) * t;
    const mixColor = (t, alpha) => {
      const r = (lerp(pinkRgb[0], indigoRgb[0], t) + 0.5) | 0;
      const g = (lerp(pinkRgb[1], indigoRgb[1], t) + 0.5) | 0;
      const b = (lerp(pinkRgb[2], indigoRgb[2], t) + 0.5) | 0;
      return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
    };

    const getConfig = () => {
      const small = width < 640;
      const medium = width < 1024;
      return {
        rows: small ? 26 : medium ? 38 : 48,
        step: small ? 18 : medium ? 14 : 12,
        particles: small ? 6 : 10,
      };
    };

    let config = getConfig();
    let rowsData = [];
    let particles = [];

    const envelope = (t) => Math.exp(-Math.pow((t - 0.5) * 2.3, 2));

    const rebuildRows = () => {
      rowsData = [];
      const { rows } = config;
      const maxAmp = Math.min(height * 0.16, 70);

      for (let r = 0; r < rows; r++) {
        const t = r / (rows - 1);
        const env = envelope(t);
        const alpha = 0.06 + env * 0.45;
        if (alpha < 0.02) continue;

        rowsData.push({
          baseY: height * 0.12 + t * height * 0.76,
          amp: maxAmp * env,
          phase: t * 5.2,
          color: mixColor(t, alpha),
          lineWidth: 0.8 + env * 0.7,
        });
      }
    };

    const makeParticles = () => {
      particles = Array.from({ length: config.particles }, () => {
        const t = Math.random();
        return {
          x: Math.random() * width,
          y: height * 0.15 + Math.random() * height * 0.7,
          r: 0.8 + Math.random() * 1.6,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.6,
          baseColor: mixColor(t, 1),
          t,
        };
      });
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      config = getConfig();
      rebuildRows();
      makeParticles();
    };

    const draw = () => {
      if (destroyed || width === 0 || height === 0) return;
      ctx.clearRect(0, 0, width, height);

      const step = config.step;
      const rowCount = rowsData.length;

      // Draw all wave rows with pre-cached colors and envelopes
      for (let i = 0; i < rowCount; i++) {
        const row = rowsData[i];
        const { baseY, amp, phase, color, lineWidth } = row;

        ctx.beginPath();
        for (let x = 0; x <= width + step; x += step) {
          const nx = x / width;
          const y =
            baseY +
            amp * Math.sin(nx * 8.168 + time * 0.35 + phase) +
            amp * 0.42 * Math.sin(nx * 13.823 - time * 0.22 + phase * 1.4);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      // Draw glowing particles
      const particleCount = particles.length;
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        const pulse = 0.5 + 0.5 * Math.sin(time * p.speed + p.phase);
        const radius = p.r * (1 + pulse * 0.6);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = p.baseColor.replace(", 1)", `, ${(0.14 + pulse * 0.18).toFixed(3)})`);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.baseColor.replace(", 1)", `, ${(0.5 + pulse * 0.4).toFixed(3)})`);
        ctx.fill();
      }
    };

    const startLoop = () => {
      if (rafId !== null || destroyed || prefersReducedMotion || isMobile) return;
      const tick = () => {
        if (!isVisible || !isTabActive || isMobile) {
          rafId = null;
          return;
        }
        time += 0.012;
        draw();
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const handleMobileChange = (e) => {
      isMobile = e.matches;
      if (isMobile) {
        stopLoop();
        if (ctx && width && height) {
          ctx.clearRect(0, 0, width, height);
        }
      } else {
        resize();
        if (isVisible && isTabActive) {
          startLoop();
        }
      }
    };
    isMobileQuery.addEventListener("change", handleMobileChange);

    resize();
    if (!isMobile) {
      draw();
      if (!prefersReducedMotion) {
        startLoop();
      }
    }

    // 1. ResizeObserver: recalculates grid only on container dimension changes
    const ro = new ResizeObserver(() => {
      isMobile = isMobileQuery.matches;
      if (!isMobile) {
        resize();
        draw();
      }
    });
    ro.observe(parent);

    // 2. IntersectionObserver with generous 400px margin: starts BEFORE entering view
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && isTabActive && !isMobile) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(parent);

    // 3. Tab visibility listener: pauses when user switches tabs
    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive && isVisible && !isMobile) {
        startLoop();
      } else {
        stopLoop();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      destroyed = true;
      stopLoop();
      ro.disconnect();
      io.disconnect();
      isMobileQuery.removeEventListener("change", handleMobileChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="wave-bg"
      aria-hidden="true"
    />
  );
}