import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Calendar, Building2, User, UserCheck, ArrowLeft } from 'lucide-react';
import './DynamicEventDetailPage.css';

const CATEGORY_NAV = [
    { label: 'Home', path: '/' },
    { label: 'Hackathons', path: '/hackathons' },
    { label: 'Tech Fest', path: '/tech-fest' },
    { label: 'Spotlight Events', path: '/spotlight-events' },
    { label: 'Cultural Contests', path: '/cultural-contests' },
    { label: 'Guest Lounge', path: '/guest-lounge' },
    { label: 'Celebrity Shows', path: '/celebrity-shows' }
];

export default function DynamicEventDetailPage() {
    const { eventSlug, sectionSlug } = useParams();
    const slug = eventSlug || sectionSlug;

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEventDetail = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`http://localhost:5000/api/pages/events/detail/${slug}`);
            const data = await res.json();
            if (data.success) {
                setEvent(data.event);
            } else {
                setError(data.error || 'Sub-event not found');
            }
        } catch (err) {
            setError('Unable to fetch event details: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchEventDetail();

        const socket = io('http://localhost:5000', {
            transports: ['websocket', 'polling'],
            reconnection: true
        });

        socket.on('navigation:changed', () => {
            fetchEventDetail();
        });

        socket.on('reconnect', () => {
            fetchEventDetail();
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchEventDetail]);

    if (loading && !event) {
        return <div className="dsp-loading">Loading event details from Thiran database...</div>;
    }

    if (error && !event) {
        return (
            <div className="container dedp-wrapper">
                <div className="dsp-empty">
                    <h2>Sub-Event Not Found</h2>
                    <p>{error}</p>
                    <br />
                    <Link
                        to="/hackathons"
                        className="dsp-btn-details"
                        style={{ display: 'inline-flex', width: 'auto' }}>
                        <ArrowLeft size={16} /> Return to Hackathons
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container dedp-wrapper">
            {/* Particular Sub-Event Detail Layout (Exact Image 1 Match) */}
            <div className="dedp-detail-grid">
                {/* Left: Square Poster Box */}
                <div className="dedp-poster-box">
                    <img
                        src={
                            event.event_image ||
                            event.banner_image ||
                            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={event.event_name}
                        className="dedp-poster-img"
                    />
                </div>

                {/* Right: Glassmorphism Schedule & Details Card (Image 1 Match) */}
                <div className="dedp-schedule-card">
                    <h2 className="dedp-schedule-title">Schedule</h2>

                    <Link
                        to={event.registration_url || '/register'}
                        className="dedp-register-btn">
                        Register Now
                    </Link>

                    <div className="dedp-info-list">
                        {/* Item 1: Date & Time */}
                        <div className="dedp-info-item">
                            <div className="dedp-icon-circle">
                                <Calendar size={20} />
                            </div>
                            <div className="dedp-info-text">
                                <span className="dedp-info-detail--bold">{event.event_date || '04, 05 February, 2026'}</span>
                                <span className="dedp-info-detail">
                                    {event.start_time || '11.00 am'} {event.end_time ? `- ${event.end_time}` : ''}
                                </span>
                            </div>
                        </div>

                        {/* Item 2: Organized by */}
                        <div className="dedp-info-item">
                            <div className="dedp-icon-circle">
                                <Building2 size={20} />
                            </div>
                            <div className="dedp-info-text">
                                <span className="dedp-info-heading">Organized by</span>
                                <span className="dedp-info-detail">{event.organized_by || 'CCE'}</span>
                            </div>
                        </div>

                        {/* Item 3: Faculty Coordinator */}
                        <div className="dedp-info-item">
                            <div className="dedp-icon-circle">
                                <User size={20} />
                            </div>
                            <div className="dedp-info-text">
                                <span className="dedp-info-heading">Faculty Coordinator</span>
                                <span className="dedp-info-detail">{event.faculty_coordinator_name || 'Ms. R. Megala'}</span>
                                {event.faculty_coordinator_phone && <span className="dedp-info-detail">{event.faculty_coordinator_phone}</span>}
                            </div>
                        </div>

                        {/* Item 4: Student Coordinator */}
                        <div className="dedp-info-item">
                            <div className="dedp-icon-circle">
                                <UserCheck size={20} />
                            </div>
                            <div className="dedp-info-text">
                                <span className="dedp-info-heading">Student Coordinator</span>
                                <span className="dedp-info-detail">{event.student_coordinator_name || 'Mr. Prassanna Murthy'}</span>
                                {event.student_coordinator_phone && <span className="dedp-info-detail">{event.student_coordinator_phone}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
