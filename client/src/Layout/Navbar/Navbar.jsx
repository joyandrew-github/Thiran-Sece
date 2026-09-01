import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { navData } from "./navdata";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import "./Navbar.css";
import logo from "../../assets/logo.png";

const SPRING = { type: "spring", stiffness: 200, damping: 38 };

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef(null);

  // Framer-motion scroll tracker — same pattern as reference
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 60));

  // Disable shrink animation on mobile; track vw for proportional inset
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1280);
  const [vw, setVw] = useState(() => window.innerWidth);
  useEffect(() => {
    const handler = () => {
      setIsMobile(window.innerWidth < 1280);
      setVw(window.innerWidth);
    };
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);

  // 8% of viewport per side, minimum 24px — grows naturally with screen width
  const sideInset = (!isMobile && scrolled) ? Math.max(24, vw * 0.08) : 0;

  const handleEnter = (idx) => {
    clearTimeout(closeTimer.current);
    setOpenIndex(idx);
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpenIndex(null), 150);
  };

  return (
    <motion.header
      className="nav-shell"
      animate={{
        paddingLeft:  sideInset,
        paddingRight: sideInset,
        paddingTop:   (!isMobile && scrolled) ? 14 : 0,
      }}
      transition={SPRING}
      onKeyDown={(e) => {
        if (e.key === "Escape") { setOpenIndex(null); setMobileOpen(false); }
      }}
    >
      {/* ── DESKTOP ─────────────────────────────────────────── */}
      <motion.nav
        aria-label="Primary"
        className="navbar"
        animate={{
          borderRadius: (!isMobile && scrolled) ? "999px" : "0px",
          paddingTop:    scrolled ? 8  : 0,
          paddingBottom: scrolled ? 8  : 0,
          paddingLeft:   scrolled ? 20 : 32,
          paddingRight:  scrolled ? 20 : 32,
          gap:           scrolled ? 2  : 4,
          backdropFilter: scrolled ? "blur(18px)" : "blur(10px)",
          WebkitBackdropFilter: scrolled ? "blur(18px)" : "blur(10px)",
          backgroundColor: scrolled
            ? "rgba(26, 20, 40, 0.88)"
            : "rgba(15, 11, 26, 0.55)",
          boxShadow: scrolled
            ? "0 0 0 1px rgba(233,26,131,0.18), 0 12px 48px rgba(0,0,0,0.55), 0 0 32px rgba(233,26,131,0.08)"
            : "none",
        }}
        transition={SPRING}
      >
        {/* Logo */}
        <NavLink
          to="/"
          className="navbar__logo"
          onClick={() => setMobileOpen(false)}
        >
          <motion.img
            src={logo}
            alt="Thiran 2027"
            className="navbar__logo-img"
            animate={{ height: scrolled ? 36 : 44 }}
            transition={SPRING}
          />
        </NavLink>

        {/* Nav links */}
        <ul className="navbar__links">
          {navData.map((item, idx) => (
            <li
              key={item.label}
              className="navbar__item"
              style={{ zIndex: openIndex === idx ? 20 : 1 }}
              onMouseEnter={() => handleEnter(idx)}
              onMouseLeave={handleLeave}
            >
              <button
                type="button"
                className={`navbar__link ${openIndex === idx ? "is-open" : ""}`}
                aria-haspopup="true"
                aria-expanded={openIndex === idx}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                {item.label}
                {item.dropdown?.length > 0 && (
                  <motion.svg
                    className="navbar__chevron"
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    animate={{ rotate: openIndex === idx ? 180 : 0 }}
                    transition={SPRING}
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </button>

              <AnimatePresence>
                {item.dropdown?.length > 0 && openIndex === idx && (
                  <motion.div
                    className="navbar__dropdown navbar__dropdown--visible"
                    initial={{ opacity: 0, x: "-50%", y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: "-50%", y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <ul>
                      {item.dropdown.map((d) => (
                        <li key={d.label}>
                          <NavLink
                            to={d.path}
                            className="navbar__dropdown-link"
                            onClick={() => setOpenIndex(null)}
                          >
                            {d.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <motion.div
          animate={{ scale: scrolled ? 0.94 : 1 }}
          transition={SPRING}
          style={{ flexShrink: 0 }}
        >
          <NavLink to="/register" className="navbar__cta">
            Register
          </NavLink>
        </motion.div>

        {/* Burger */}
        <button
          className={`navbar__burger ${mobileOpen ? "is-active" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </motion.nav>

      {/* ── MOBILE DRAWER ───────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
          >
            <ul>
              {navData.map((item) => (
                <li key={item.label} className="navbar__mobile-item">
                  <details>
                    <summary>{item.label}</summary>
                    {item.dropdown?.length > 0 && (
                      <ul className="navbar__mobile-sub">
                        {item.dropdown.map((d) => (
                          <li key={d.label}>
                            <NavLink
                              to={d.path}
                              onClick={() => setMobileOpen(false)}
                            >
                              {d.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </details>
                </li>
              ))}
            </ul>
            <NavLink
              to="/register"
              className="navbar__cta navbar__cta--mobile"
              onClick={() => setMobileOpen(false)}
            >
              Register
            </NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

