import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, ExternalLink, ShieldCheck, LogOut, ChevronRight } from 'lucide-react';
import './Header.css';

const PATH_TITLES = {
    '/dashboard': 'Dashboard',
    '/dashboard/homepage': 'Homepage Management',
    '/dashboard/hackathons': 'Hackathons',
    '/dashboard/tech-fest': 'Tech Fest',
    '/dashboard/spotlight-events': 'Spotlight Events',
    '/dashboard/events': 'Events Management',
    '/dashboard/cultural-contests': 'Cultural Contests',
    '/dashboard/guest-lounge': 'Guest Lounge',
    '/dashboard/celebrity-shows': 'Celebrity Shows',
    '/dashboard/event-categories': 'Event Categories',
    '/dashboard/speakers': 'Speakers Management',
    '/dashboard/schedules': 'Schedules',
    '/dashboard/announcements': 'Announcements',
    '/dashboard/faq': 'FAQ Management',
    '/dashboard/gallery': 'Gallery',
    '/dashboard/sponsors': 'Sponsors',
    '/dashboard/registrations': 'Participant Registrations',
    '/dashboard/site-settings': 'Site Settings',
    '/dashboard/contact-info': 'Contact Information'
};

export default function Header({ onToggleMobile }) {
    const location = useLocation();
    const navigate = useNavigate();

    const currentTitle = PATH_TITLES[location.pathname] || 'Dashboard';

    const handleLogout = () => {
        localStorage.removeItem('thiran_admin_authenticated');
        localStorage.removeItem('thiran_admin_user');
        navigate('/login');
    };

    return (
        <header className="admin-header">
            <div className="admin-header-left">
                {/* Mobile hamburger toggle */}
                <button
                    type="button"
                    className="admin-mobile-toggle"
                    onClick={onToggleMobile}
                    aria-label="Toggle navigation drawer">
                    <Menu size={22} />
                </button>

                {/* Breadcrumbs & Page Title */}
                <div className="admin-header-title-wrapper">
                    <div className="admin-breadcrumb">
                        <span>Admin</span>
                        <ChevronRight size={13} />
                        <span className="admin-breadcrumb-active">{currentTitle}</span>
                    </div>
                    <h1 className="admin-header-title">{currentTitle}</h1>
                </div>
            </div>

            <div className="admin-header-right">
                {/* Public Website Quick Link */}
                <a
                    href="http://localhost:5173"
                    target="_blank"
                    rel="noreferrer"
                    className="admin-header-link-btn"
                    title="Open public Thiran website in new tab">
                    <span>Public Site</span>
                    <ExternalLink size={14} />
                </a>

                {/* Account Status Pill */}
                <div className="admin-header-user-badge">
                    <ShieldCheck size={14} />
                    <span>SECE Admin</span>
                </div>

                {/* Header Logout */}
                <button
                    type="button"
                    className="admin-header-logout"
                    onClick={handleLogout}
                    title="Logout">
                    <LogOut size={16} />
                </button>
            </div>
        </header>
    );
}
