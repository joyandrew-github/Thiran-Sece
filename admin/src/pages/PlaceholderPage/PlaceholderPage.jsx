import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, Sparkles, Plus, Layers } from 'lucide-react';
import './PlaceholderPage.css';

const PAGE_DETAILS = {
    '/dashboard/homepage': {
        title: 'Homepage Content Management',
        sub: 'Manage hero sections, banner announcements, and home page dynamic text',
        subcategories: []
    },
    '/dashboard/hackathons': {
        title: 'HACKATHONS',
        sub: 'Multi-track coding hackathons & build fests',
        subcategories: ['24 Hours Hackathon', 'AI Hackathon', 'Web3 Hackathon', 'Cyber Hackathon'],
        unlimited: true
    },
    '/dashboard/tech-fest': {
        title: 'TECH FEST',
        sub: 'Technical competitions, quizzes & project expos',
        subcategories: ['Tech Quiz', 'Project Expo'],
        unlimited: true
    },
    '/dashboard/spotlight-events': {
        title: 'SPOTLIGHT EVENTS',
        sub: 'Flagship & featured spotlight events',
        subcategories: ['Event 1', 'Event 2'],
        unlimited: true
    },
    '/dashboard/events': {
        title: 'EVENTS',
        sub: 'General festival events & competitions',
        subcategories: ['Event A', 'Event B'],
        unlimited: true
    },
    '/dashboard/cultural-contests': {
        title: 'CULTURAL CONTESTS',
        sub: 'Music, dance, drama & art competitions',
        subcategories: ['Solo Singing', 'Group Dance', 'Battle of Bands', 'Street Play'],
        unlimited: true
    },
    '/dashboard/guest-lounge': {
        title: 'GUEST LOUNGE',
        sub: 'VIP guests, keynote speakers, and lounge schedules',
        subcategories: ['Keynote Speakers', 'Dignitaries', 'VIP Pass Control'],
        unlimited: true
    },
    '/dashboard/celebrity-shows': {
        title: 'CELEBRITY SHOWS',
        sub: 'Star performances & pro nights',
        subcategories: ['Music Pro Night', 'DJ Night', 'Standup Comedy'],
        unlimited: true
    },
    '/dashboard/event-categories': {
        title: 'Event Categories',
        sub: 'Configure category taxonomy and parent-child event trees',
        subcategories: ['Hackathons', 'Tech Fest', 'Spotlight Events', 'Events', 'Cultural Contests', 'Guest Lounge', 'Celebrity Shows'],
        unlimited: true
    },
    '/dashboard/speakers': {
        title: 'Speakers Management',
        sub: 'Manage keynote speakers, guests, and bio details',
        subcategories: []
    },
    '/dashboard/schedules': {
        title: 'Schedules Management',
        sub: 'Timeline, event session slots, and agenda management',
        subcategories: []
    },
    '/dashboard/announcements': {
        title: 'Announcements',
        sub: 'Publish live alerts, push notifications, and festival news',
        subcategories: []
    },
    '/dashboard/faq': {
        title: 'FAQ Management',
        sub: 'Manage frequently asked questions, answers, and categories',
        subcategories: []
    },
    '/dashboard/gallery': {
        title: 'Gallery Management',
        sub: 'Upload and organize fest media and photos',
        subcategories: []
    },
    '/dashboard/sponsors': {
        title: 'Sponsors Management',
        sub: 'Configure sponsor logos, tiers, and partner links',
        subcategories: []
    },
    '/dashboard/registrations': {
        title: 'Participant Registrations',
        sub: 'View, filter, export, and manage student registrations',
        subcategories: []
    },
    '/dashboard/site-settings': {
        title: 'Site Settings',
        sub: 'Configure global metadata, festival dates, and feature flags',
        subcategories: []
    },
    '/dashboard/contact-info': {
        title: 'Contact Information',
        sub: 'Update helpdesk contact details, email addresses, and location maps',
        subcategories: []
    }
};

export default function PlaceholderPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const info = PAGE_DETAILS[location.pathname] || {
        title: 'Admin Module',
        sub: 'Administrative module under configuration',
        subcategories: []
    };

    return (
        <div className="admin-placeholder-container">
            <div className="admin-placeholder-card">
                <div className="admin-placeholder-icon">
                    <Sparkles size={28} />
                </div>
                <div className="admin-placeholder-tag">Thiran Event Section</div>
                <h2 className="admin-placeholder-title">{info.title}</h2>
                <p className="admin-placeholder-sub">{info.sub}</p>

                {/* Subcategories tree view */}
                {info.subcategories && info.subcategories.length > 0 && (
                    <div className="admin-subcat-box">
                        <div className="admin-subcat-header">
                            <Layers size={14} />
                            <span>Configured Sub-Events & Categories:</span>
                        </div>
                        <div className="admin-subcat-list">
                            {info.subcategories.map((sub, idx) => (
                                <span
                                    key={idx}
                                    className="admin-subcat-chip">
                                    {sub}
                                </span>
                            ))}
                            {info.unlimited && (
                                <span className="admin-subcat-chip admin-subcat-chip--add">
                                    <Plus size={12} /> Add Unlimited...
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <div className="admin-placeholder-banner">
                    <Wrench size={16} />
                    <span>Module Ready for Integration with Node.js & PostgreSQL Backend</span>
                </div>

                <button
                    type="button"
                    className="admin-placeholder-back-btn"
                    onClick={() => navigate('/dashboard')}>
                    <ArrowLeft size={16} />
                    <span>Return to Dashboard Overview</span>
                </button>
            </div>
        </div>
    );
}
