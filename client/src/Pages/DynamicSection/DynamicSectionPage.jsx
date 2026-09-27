import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Search } from 'lucide-react';
import './DynamicSectionPage.css';

const DEFAULT_TAGS = [
    '4 FEB',
    '5 FEB',
    '6 FEB',
    'AI-DS',
    'AI-ML',
    'CCE',
    'CFL',
    'CIR',
    'CREATIVEWORKSHOPS',
    'CSBS',
    'CSE',
    'CULTURAL CONTESTS',
    'ECE',
    'EDC CELL',
    'EEE',
    'HR',
    'HR & SLC',
    'IT',
    'LEADERSHIP-TALK',
    'MATHS',
    'MECH',
    'PITCHFEST',
    'PLACEMENT CELL',
    'S&H',
    'SLC'
];

const CATEGORY_NAV = [
    { label: 'Home', path: '/' },
    { label: 'Hackathons', path: '/hackathons' },
    { label: 'Tech Fest', path: '/tech-fest' },
    { label: 'Spotlight Events', path: '/spotlight-events' },
    { label: 'Cultural Contests', path: '/cultural-contests' },
    { label: 'Guest Lounge', path: '/guest-lounge' },
    { label: 'Celebrity Shows', path: '/celebrity-shows' }
];

export default function DynamicSectionPage({ sectionSlug: propSlug }) {
    const { sectionSlug: routeSlug } = useParams();
    const navigate = useNavigate();
    const slug = propSlug || routeSlug || 'hackathons';

    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);

    const fetchPageContent = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`http://localhost:5000/api/pages/${slug}`);
            const data = await res.json();
            if (data.success) {
                setPageData(data);
            } else {
                setError(data.error || 'Failed to load page content');
            }
        } catch (err) {
            setError('Unable to connect to backend server: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchPageContent();

        // Connect Socket.IO client for real-time updates WITHOUT browser refresh
        const socket = io('http://localhost:5000', {
            transports: ['websocket', 'polling'],
            reconnection: true
        });

        socket.on('navigation:changed', () => {
            fetchPageContent();
        });

        socket.on('reconnect', () => {
            fetchPageContent();
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchPageContent]);

    const handleTagClick = (tag) => {
        if (selectedTag === tag) {
            setSelectedTag(null); // Toggle off
        } else {
            setSelectedTag(tag);
        }
    };

    if (loading && !pageData) {
        return <div className="dsp-loading">Loading events from Thiran database...</div>;
    }

    const events = (pageData?.events || []).filter((e) => e.is_published);

    // Filter events by Search Query & Tag
    const filteredEvents = events.filter((ev) => {
        const matchesSearch =
            !searchQuery ||
            ev.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (ev.short_description && ev.short_description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (ev.tags && ev.tags.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesTag =
            !selectedTag ||
            (ev.tags && ev.tags.toLowerCase().includes(selectedTag.toLowerCase())) ||
            ev.event_name.toLowerCase().includes(selectedTag.toLowerCase());

        return matchesSearch && matchesTag;
    });

    return (
        <div className="container dsp-wrapper">
            {/* Main 2-Column Content Layout (Image 2 Match) */}
            <div className="dsp-main-grid">
                {/* Left: Poster Cards Grid */}
                <div>
                    {filteredEvents.length === 0 ? (
                        <div className="dsp-empty">No events matching filter criteria.</div>
                    ) : (
                        <div className="dsp-posters-grid">
                            {filteredEvents.map((ev) => {
                                const detailPath = ev.slug.startsWith('/') ? ev.slug : `/hackathons/${ev.slug}`;
                                return (
                                    <div
                                        key={ev.id}
                                        className="dsp-poster-card"
                                        onClick={() => navigate(detailPath)}>
                                        <img
                                            src={
                                                ev.event_image ||
                                                'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80'
                                            }
                                            alt={ev.event_name}
                                            className="dsp-poster-img"
                                        />
                                        <div className="dsp-poster-overlay">
                                            <div className="dsp-poster-title">{ev.event_name}</div>
                                            {ev.event_date && <div className="dsp-poster-date">📅 {ev.event_date}</div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right: Search & Tags Sidebar (Exact Image 2 Match) */}
                <div className="dsp-sidebar">
                    {/* Search Bar */}
                    <div className="dsp-search-box">
                        <input
                            type="text"
                            className="dsp-search-input"
                            placeholder="Search...."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="button"
                            className="dsp-search-btn"
                            title="Search">
                            <Search size={18} />
                        </button>
                    </div>

                    {/* Tags Card */}
                    <div className="dsp-tags-card">
                        <h3 className="dsp-tags-title">Tags</h3>
                        <div className="dsp-tags-list">
                            {DEFAULT_TAGS.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    className={`dsp-tag-pill ${selectedTag === tag ? 'dsp-tag-pill--active' : ''}`}
                                    onClick={() => handleTagClick(tag)}>
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
