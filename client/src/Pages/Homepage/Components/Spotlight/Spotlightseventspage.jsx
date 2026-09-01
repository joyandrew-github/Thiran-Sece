import React from 'react';
import SpotlightCard from './SpotlightCard';
import './eventpage.css';

import youthTalkImg from '../../../../assets/spot-light/YOUTH TALK copy.jpg';
import youthSummitImg from '../../../../assets/spot-light/YOUTH SUMMIT 06 copy.jpg';
import techTalkImg from '../../../../assets/spot-light/TECH TALK 02 copy.jpg';
import startupStories02Img from '../../../../assets/spot-light/Startup Stories 02 copy.jpg';
import startupStories01Img from '../../../../assets/spot-light/Startup Stories 01 copy 2.jpg';
import pitchFestImg from '../../../../assets/spot-light/PITCH FEST 02 copy.jpg';

/**
 * Content for the six Spotlight-tier events.
 */
const EVENTS = [
  {
    poster: youthTalkImg,
    badge: 'Gateway Event',
    meta: ['Registrations open'],
    title: 'Youth Talk',
    tagline: 'Own Your Mic!',
    description:
      'Your gateway to the Grand Youth Summit. Step up, speak your mind, and earn your spot on the big stage.',
    speakers: [],
    coordinator: 'Mr. L. D. Aloysius Jude · 88709 72995',
  },
  {
    poster: youthSummitImg,
    badge: 'Spotlight Event',
    meta: ['Day 03 · 06 Feb 2027', 'Rs.350 · lunch included'],
    title: 'Youth Summit',
    tagline: 'Gen Z+ vs Millennials',
    description:
      'Two generations, one stage. An electrifying face-off on how ambition, work, and outlook are changing across generations.',
    speakers: [
      { name: 'Arunkumar', role: 'Principal Firmware Engineer, Logitech' },
      { name: 'Aari Arjunan', role: 'Bigg Boss Winner & Film Actor' },
      { name: 'Aishwarya Ejoumale', role: 'Psychologist & Educator' },
    ],
    coordinator: 'Mr. L. D. Aloysius Jude · 88709 72995',
  },
  {
    poster: techTalkImg,
    badge: 'Spotlight Event',
    meta: ['05 Feb 2027 · 10 AM – 12 PM'],
    title: 'Tech Talk',
    tagline: 'Gearing Up for the AI World',
    description:
      "A candid conversation on what it actually takes to build and lead in an AI-first industry.",
    speakers: [{ name: 'Shayak Mazumder', role: 'CEO & CTO, Adya' }],
    coordinator: 'For registration — thiran.sece.ac.in',
  },
  {
    poster: startupStories02Img,
    badge: 'Spotlight Event',
    meta: ['Day 02 · 05 Feb 2027 · 10 AM – 12 PM', 'Rs.350 · lunch included'],
    title: 'Startup Stories',
    tagline: 'From Dorm Rooms to Boardroom',
    description:
      "The founder of FABP Foods on turning a hostel-room idea into a real business — the wins, the wrong turns, and what he'd do differently.",
    speakers: [{ name: 'Mr. Prabhu Gandhikumar', role: 'Founder, FABP Foods' }],
    coordinator: 'Dr. Sarfaraz Ahmed A · 98948 19871',
  },
  {
    poster: startupStories01Img,
    badge: 'Spotlight Event',
    meta: ['Day 02 · 05 Feb 2027 · 10 AM – 12 PM', 'Rs.350 · lunch included'],
    title: 'Startup Stories',
    tagline: 'From Dorm Rooms to Boardroom',
    description:
      'The founder & CEO of GUVI on building an ed-tech company from scratch, and what it takes to stay in the game past the first big win.',
    speakers: [{ name: 'Mr. ArunPrakash M', role: 'Founder & CEO, GUVI' }],
    coordinator: 'Dr. Sarfaraz Ahmed A · 98948 19871',
  },
  {
    poster: pitchFestImg,
    badge: 'Spotlight Event',
    meta: ['Day 03 · 06 Feb 2027 · 9 AM – 3 PM', 'Rs.350 · lunch included'],
    title: 'Start-Up Pitch Fest',
    tagline: 'Cash Prizes Worth ₹45,000',
    description:
      'A launchpad for student start-ups. Pitch your idea to a jury from StartupTN and EDII, and walk away with funding, feedback, or both. In association with StartupTN & EDII.',
    speakers: [{ name: 'Mr. Rajsekar Sivasamy', role: 'Jury · Project Associate, StartupTN' }],
    coordinator: 'Dr. Sarfaraz Ahmed A, AP/CSE · 98948 19871',
  },
];

function EventCard({ event }) {
  return (
    <SpotlightCard className="spotlight-event-card">
      <div className="spotlight-event-card__poster">
        <img src={event.poster} alt={`${event.title} poster`} />
      </div>
      <div className="spotlight-event-card__body">
        <div className="spotlight-event-card__meta">
          <span className="spotlight-pill spotlight-pill--accent">{event.badge}</span>
          {event.meta.map((m) => (
            <span className="spotlight-pill" key={m}>{m}</span>
          ))}
        </div>
        <div className="spotlight-event-card__title-group">
          <h3>{event.title}</h3>
          <div className="tagline">{event.tagline}</div>
        </div>
        <p className="spotlight-event-card__desc">{event.description}</p>
        {event.speakers.length > 0 && (
          <div className="spotlight-speaker-row">
            {event.speakers.map((s) => (
              <div className="spotlight-speaker-chip" key={s.name}>
                <strong>{s.name}</strong>
                <span>{s.role}</span>
              </div>
            ))}
          </div>
        )}
        <div className="spotlight-event-card__footer">
          <span className="spotlight-event-card__coordinator">{event.coordinator}</span>
          <a href="https://thiran.sece.ac.in" className="spotlight-btn" target="_blank" rel="noreferrer">
            Register Now
          </a>
        </div>
      </div>
    </SpotlightCard>
  );
}

export default function SpotlightEventsPage() {
  return (
    <section className="spotlight-events-page">
      <div className="container">
        <div className="spotlight-events-header">
          <span className="eyebrow">Thiran 2027 · Spotlight Line-up</span>
          <h1>
            Events under the <span>Spotlight</span>
          </h1>
          <p>
            Six sessions, six different rooms to be in — talks, summits, and a
            pitch fest, all built around the people shaping what comes next.
          </p>
        </div>

        <div className="spotlight-events-list">
          {EVENTS.map((event) => (
            <EventCard event={event} key={`${event.title}-${event.tagline}-${event.speakers[0]?.name ?? ''}`} />
          ))}
        </div>
      </div>
    </section>
  );
}