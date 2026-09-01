import "./InfoComponent.css";

export default function InfoComponent() {
  return (
    <section className="info-panel" aria-labelledby="info-panel-heading">
      <div className="info-panel__border">
        <div className="info-panel__body">
          <div className="info-panel__scanline" aria-hidden="true" />

          <div className="info-panel__status">
            <span className="status-dot" aria-hidden="true" />
            <span className="status-text">Enrollment window — closing soon</span>
          </div>

          <div className="info-panel__grid">
            <div className="info-panel__date-block">
              <p className="info-panel__eyebrow">Registration deadline</p>
              <h2 id="info-panel-heading" className="info-panel__date">
                <span className="date-num">25</span>
                <span className="date-meta">
                  <span>JAN</span>
                  <span>2027</span>
                </span>
              </h2>
            </div>

            <ul className="info-panel__clearances">
              <li>
                <span className="tag-mark" aria-hidden="true" />
                Pre-registration only
              </li>
              <li>
                <span className="tag-mark" aria-hidden="true" />
                No on-spot entries
              </li>
              <li>
                <span className="tag-mark" aria-hidden="true" />
                Engineering students only
              </li>
            </ul>

            <div className="info-panel__action">
              <a href="#register" className="cta-button">
                <span>Register now</span>
                <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                  <path
                    d="M4 10h11M10 5l5 5-5 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <p className="info-panel__note">
                Seats are confirmed only through pre-registration — entries close at the gate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}