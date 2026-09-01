import { useMemo, useState } from 'react';
import './Faqsection.css';

/**
 * Full FAQ set for Thiran 2026. Edit freely — everything below (categories,
 * order, copy) drives the tabs, the numbering, and the search index.
 */
export const FAQ_DATA = [
  // --- Registration & Eligibility ---
  {
    category: 'Registration',
    q: 'Who can participate in the event?',
    a: 'Students from any recognized college or university across India can participate. A few spotlight sessions have their own eligibility notes (year of study, team size, etc.) listed on that event\'s page.',
  },
  {
    category: 'Registration',
    q: 'How do I register for the events?',
    a: 'Register online at thiran.sece.ac.in — pick your event(s), complete payment where applicable, and you\'ll get a confirmation email. Carry that confirmation (digital or printed) to the registration desk on campus to collect your participant ID.',
  },
  {
    category: 'Registration',
    q: 'Is there a registration fee?',
    a: 'It depends on the event. Several sessions are free to attend, while spotlight events (like Startup Stories or the Pitch Fest) run on a one-day pass of Rs.350, lunch included, which unlocks every session that day. Fee details are listed on each event\'s page.',
  },
  {
    category: 'Registration',
    q: 'Can one student participate in multiple events?',
    a: 'Yes — as long as the timings don\'t clash. Each additional event may need its own registration, and its own fee where one applies.',
  },
  {
    category: 'Registration',
    q: 'What is the procedure to get a refund, in case of cancellation?',
    a: 'Registration fees are generally non-refundable once confirmed. If an event is cancelled by the organizers, refunds are initiated to the original payment method within the timeline announced at cancellation — reach out to the help desk for anything specific to your booking.',
  },

  // --- Events & Format ---
  {
    category: 'Events & Format',
    q: 'What categories of events are offered?',
    a: 'Four broad tracks: technical (paper presentations, hackathons, project expo), cultural (dance, music, fashion), sports, and spotlight sessions — talks and fireside chats with industry speakers.',
  },
  {
    category: 'Events & Format',
    q: 'Are both solo and team events available?',
    a: 'Yes. Each event page states its mode — solo, team, or either — along with the minimum and maximum team size where relevant.',
  },
  {
    category: 'Events & Format',
    q: 'Is there a dress code?',
    a: 'Formal or smart casual college wear for talks, competitions, and the inaugural. Costume-based cultural events allow themed outfits appropriate to the act — check your specific event\'s rulebook.',
  },
  {
    category: 'Events & Format',
    q: 'Are props or musical instruments provided?',
    a: 'Basic infrastructure — sound system, mic, and projector — is provided at every venue. Instruments, costumes, and event-specific props are the participant\'s responsibility unless an event explicitly states otherwise.',
  },
  {
    category: 'Events & Format',
    q: 'Can participants change events after registration?',
    a: 'Changes are allowed up to 48 hours before the event, subject to seat availability and any fee difference. Reach out through the registration portal or the help desk to make the switch.',
  },
  {
    category: 'Events & Format',
    q: 'What if there is a schedule clash between two events?',
    a: 'Flag it with the organizers as early as possible — we\'ll try to adjust a slot where we can. Slot changes aren\'t guaranteed, though, so plan for the possibility that you\'ll need to pick one.',
  },

  // --- On Campus ---
  {
    category: 'On Campus',
    q: 'Will accommodation be provided for outstation participants?',
    a: 'Limited dormitory-style accommodation is available for outstation participants on prior request, for a nominal charge. The help desk can also point you to nearby budget stays.',
  },
  {
    category: 'On Campus',
    q: 'Is transportation arranged for participating colleges?',
    a: 'Not by default, but a shuttle between the campus and the nearest bus stand or railway station can be arranged if requested in advance through your faculty coordinator.',
  },
  {
    category: 'On Campus',
    q: 'Will food be provided?',
    a: 'Meals are included where an event\'s pass says so (for example, the Rs.350 spotlight-day pass includes lunch). Beyond that, the campus food court is open to all participants and visitors at regular pricing.',
  },
  {
    category: 'On Campus',
    q: 'Can photography and videography be done?',
    a: 'Personal photos and social sharing are welcome. Official photographers cover the main stage and spotlight sessions; commercial shoots or professional filming need prior permission from the organizing committee.',
  },
  {
    category: 'On Campus',
    q: 'Is parking available on campus?',
    a: 'Yes, free parking for two- and four-wheelers is available on campus with security on duty.',
  },
  {
    category: 'On Campus',
    q: 'Will medical assistance be available?',
    a: 'An on-site first-aid desk is staffed throughout the fest, with a tie-up hospital on call for anything that needs more than first aid.',
  },

  // --- Support & Safety ---
  {
    category: 'Support & Safety',
    q: 'What documents should I bring?',
    a: 'Your college ID, your registration confirmation (digital or printed), one passport-size photo, and — for team events — a participation form signed by your faculty coordinator.',
  },
  {
    category: 'Support & Safety',
    q: 'Will certificates or prizes be awarded?',
    a: 'Every participant receives a certificate. Winners and runners-up in competitive events take home cash prizes or trophies, and spotlight sessions issue participation certificates as well.',
  },
  {
    category: 'Support & Safety',
    q: 'Can faculty accompany the student teams?',
    a: 'Yes, and it\'s encouraged — faculty coordinators get a complimentary pass and access to a dedicated faculty lounge on campus.',
  },
  {
    category: 'Support & Safety',
    q: 'How can we contact the event organizers?',
    a: 'Through the contact details listed on thiran.sece.ac.in, at the info desk on campus during the fest, or via your event\'s faculty coordinator, whose number is on that event\'s page.',
  },
  {
    category: 'Support & Safety',
    q: 'Are there any safety or disciplinary rules?',
    a: 'Standard code of conduct applies — no ragging or harassment, participant IDs worn at all times, and a disciplinary committee handling any violations. The campus is under CCTV coverage throughout the fest.',
  },
  {
    category: 'Support & Safety',
    q: 'What happens if an event gets delayed or cancelled?',
    a: 'We\'ll notify registered participants through the official site and social channels as soon as a change is confirmed, along with the rescheduled slot or refund details where applicable.',
  },
  {
    category: 'Support & Safety',
    q: 'Can outsiders or audience attend the event?',
    a: 'Cultural evenings and the mega shows are open to the public with an entry pass. Competition venues are kept to registered participants, faculty, and volunteers to keep things running smoothly.',
  },
  {
    category: 'Support & Safety',
    q: 'How early should participants arrive?',
    a: 'Plan to be at your venue at least 30–45 minutes before your reporting time, so there\'s room for ID verification and a quick briefing.',
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(FAQ_DATA.map((f) => f.category)))];

function FAQItem({ item, index, isOpen, onToggle }) {
  return (
    <div className={`faq-item${isOpen ? ' is-open' : ''}`}>
      <button
        type="button"
        className="faq-item__trigger"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className="faq-item__index">{String(index + 1).padStart(2, '0')}</span>
        <span className="faq-item__question">{item.q}</span>
        <span className="faq-item__icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      <div className="faq-item__answer">
        <div>
          <p>{item.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection({ faqs = FAQ_DATA }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [openIds, setOpenIds] = useState(() => new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return faqs
      .map((item, i) => ({ ...item, _id: i }))
      .filter((item) => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesQuery =
          q.length === 0 ||
          item.q.toLowerCase().includes(q) ||
          item.a.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      });
  }, [faqs, activeCategory, query]);

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className="faq-section">
      <div className="container faq-section__inner">
        <div className="faq-header">
          <span className="eyebrow">Need to know</span>
          <h2>
            Frequently Asked <span>Questions</span>
          </h2>
          <p>Everything about registering, competing, and getting around campus during Thiran 2026.</p>
        </div>

        <div className="faq-controls">
          <div className="faq-search">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search a question…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search FAQs"
            />
          </div>

          <div className="faq-tabs" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                className={`faq-tab${activeCategory === cat ? ' is-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="faq-list">
          {filtered.length === 0 && (
            <p className="faq-empty">No questions match "{query}". Try a different search or category.</p>
          )}

          {filtered.map((item) => (
            <FAQItem
              key={item._id}
              item={item}
              index={item._id}
              isOpen={openIds.has(item._id)}
              onToggle={() => toggle(item._id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}