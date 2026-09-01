import { NavLink } from "react-router-dom";
import { MapPin, ArrowUpRight } from "lucide-react";
import logo from "../../assets/logo.png";
import "./Footer.css";

const quickLinks = [
  { label: "Hackathons", path: "/hackathons" },
  { label: "Tech Fest", path: "/tech-fest" },
  { label: "Spotlight Events", path: "/spotlight-events" },
  { label: "Cultural Contests", path: "/cultural-contests" },
  { label: "Celebrity Shows", path: "/celebrity-shows" },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "X", href: "https://x.com" },
];

const registrationContacts = [
  { name: "Dr. P. Kalpana", role: "AP/IT", phone: "+919600983981" },
  { name: "Dr. S. Sampath Kumar", role: "ASP/CSE", phone: "+918838294783" },
];

const accommodationContacts = [
  { name: "Dr. S. Ramkumar", role: "ASP/ECE", phone: "+919894815528" },
  { name: "Mr. S. Gokul", role: "AP/Mech", phone: "+917502931447" },
  { name: "Ms. Chithra", role: "", phone: "+919943028357" },
];

const stallContacts = [
  { name: "Ms. Girija Selvaraj", role: "", phone: "+919994340054" },
  { name: "Ms. S. Saranya Devi", role: "", phone: "+918531008587" },
];

export default function Footer() {
  return (
    <footer className="footer">
      {/* Map banner */}
      <div className="footer__map-section">
        <div className="footer__map-wrap">
          <iframe
            title="Sri Eshwar College of Engineering Campus Map"
            src="https://www.google.com/maps?q=Sri+Eshwar+College+of+Engineering,+Coimbatore&output=embed"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            className="footer__map-badge"
            href="https://maps.app.goo.gl/bSpLuPZaHAeWHSTN8"
            target="_blank"
            rel="noreferrer"
          >
            <span className="footer__map-badge-icon">
              <MapPin size={18} strokeWidth={2.2} />
            </span>
            <span className="footer__map-badge-text">
              <strong>
                Get Directions to Thiran
                <ArrowUpRight size={15} className="footer__map-badge-arrow" />
              </strong>
              <span>Sri Eshwar College of Engineering, Coimbatore</span>
            </span>
          </a>
        </div>
      </div>

      <div className="container footer__grid">
        <div className="footer__brand">
          <NavLink to="/" className="footer__logo">
            <img src={logo} alt="Thiran 2027" className="footer__logo-img" />
          </NavLink>
          <p className="footer__desc">
            A national-level inter-college techno-cultural-sports fest hosted by Sri
            Eshwar College of Engineering, Coimbatore — three days of hackathons,
            workshops, contests and celebrity shows.
          </p>
          <p className="footer__dates">Feb 4, 5 &amp; 6, 2027 · Coimbatore, Tamil Nadu</p>
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <ul>
            {quickLinks.map((l) => (
              <li key={l.label}>
                <NavLink to={l.path}>{l.label}</NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Registration &amp; Stay</h4>

          <div className="footer__contact-group">
            <h5>Registration Queries</h5>
            {registrationContacts.map((c) => (
              <div className="footer__contact-person" key={c.name}>
                <span className="footer__contact-name">{c.name}</span>
                <span className="footer__contact-role">{c.role}</span>
                <a className="footer__contact-phone" href={`tel:${c.phone}`}>
                  {c.phone.replace("+91", "+91 ")}
                </a>
              </div>
            ))}
          </div>

          <div className="footer__contact-group">
            <h5>Accommodation Assistance</h5>
            {accommodationContacts.map((c) => (
              <div className="footer__contact-person" key={c.name}>
                <span className="footer__contact-name">{c.name}</span>
                {c.role && <span className="footer__contact-role">{c.role}</span>}
                <a className="footer__contact-phone" href={`tel:${c.phone}`}>
                  {c.phone.replace("+91", "+91 ")}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <h4>Stalls &amp; Venue</h4>

          <div className="footer__contact-group">
            <h5>Stall Related Queries</h5>
            {stallContacts.map((c) => (
              <div className="footer__contact-person" key={c.name}>
                <span className="footer__contact-name">{c.name}</span>
                <a className="footer__contact-phone" href={`tel:${c.phone}`}>
                  {c.phone.replace("+91", "+91 ")}
                </a>
              </div>
            ))}
          </div>

          <div className="footer__contact-group">
            <h5>Venue</h5>
            <p className="footer__address">
              Sri Eshwar College of Engineering Campus, Coimbatore, Tamil Nadu
            </p>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-row">
          <p>© 2027 Sri Eshwar College of Engineering. All rights reserved.</p>
          <div className="footer__socials">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}