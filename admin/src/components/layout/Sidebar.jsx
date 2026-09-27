import { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
    LayoutDashboard,
    Home,
    Calendar,
    Layers,
    Mic,
    Clock,
    Megaphone,
    HelpCircle,
    Image,
    Award,
    Users,
    Sliders,
    Mail,
    LogOut,
    X,
    Flame,
    Terminal,
    Cpu,
    Sparkles,
    Music,
    UserCheck,
    Crown
} from 'lucide-react';
import thiranLogo from '../../assets/thiranlogo.png';
import './Sidebar.css';

const ICON_MAP = {
    LayoutDashboard,
    Home,
    Calendar,
    Layers,
    Mic,
    Clock,
    Megaphone,
    HelpCircle,
    Image,
    Award,
    Users,
    Sliders,
    Mail,
    Terminal,
    Cpu,
    Sparkles,
    Music,
    UserCheck,
    Crown
};

const DEFAULT_EVENT_ICONS = {
    home: 'Home',
    hackathons: 'Terminal',
    'tech fest': 'Cpu',
    'spotlight events': 'Sparkles',
    events: 'Calendar',
    'cultural contests': 'Music',
    'guest lounge': 'UserCheck',
    'celebrity shows': 'Crown'
};

const STATIC_BEFORE_CATEGORIES = [
    {
        category: null,
        items: [{ id: 'dashboard', label: 'Dashboard', path: '/dashboard', iconName: 'LayoutDashboard' }]
    }
];

const STATIC_AFTER_CATEGORIES = [
    {
        category: 'CONTENT MANAGEMENT',
        items: [
            { id: 'event-categories', label: 'Event Categories', path: '/dashboard/event-categories', iconName: 'Layers' },
            { id: 'speakers', label: 'Speakers', path: '/dashboard/speakers', iconName: 'Mic' },
            { id: 'schedules', label: 'Schedules', path: '/dashboard/schedules', iconName: 'Clock' },
            { id: 'announcements', label: 'Announcements', path: '/dashboard/announcements', iconName: 'Megaphone' },
            { id: 'faq', label: 'FAQ', path: '/dashboard/faq', iconName: 'HelpCircle' },
            { id: 'gallery', label: 'Gallery', path: '/dashboard/gallery', iconName: 'Image' },
            { id: 'sponsors', label: 'Sponsors', path: '/dashboard/sponsors', iconName: 'Award' }
        ]
    },
    {
        category: 'REGISTRATION',
        items: [{ id: 'registrations', label: 'Registrations', path: '/dashboard/registrations', iconName: 'Users' }]
    },
    {
        category: 'SETTINGS',
        items: [
            { id: 'site-settings', label: 'Site Settings', path: '/dashboard/site-settings', iconName: 'Sliders' },
            { id: 'contact-info', label: 'Contact Information', path: '/dashboard/contact-info', iconName: 'Mail' }
        ]
    }
];

export default function Sidebar({ isOpen, onCloseMobile }) {
    const navigate = useNavigate();
    const [eventSections, setEventSections] = useState([]);

    const fetchEventSections = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:5000/api/navigation/admin');
            const data = await res.json();
            if (data.success && Array.isArray(data.items)) {
                setEventSections(data.items);
            }
        } catch (err) {
            console.error('Error fetching dynamic sidebar navigation:', err);
        }
    }, []);

    useEffect(() => {
        fetchEventSections();

        const socket = io('http://localhost:5000', {
            transports: ['websocket', 'polling'],
            reconnection: true
        });

        socket.on('navigation:changed', () => {
            fetchEventSections();
        });

        socket.on('reconnect', () => {
            fetchEventSections();
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchEventSections]);

    const handleLogout = () => {
        localStorage.removeItem('thiran_admin_authenticated');
        localStorage.removeItem('thiran_admin_user');
        navigate('/login');
    };

    // Format dynamic event section items
    const dynamicEventItems = eventSections.map((sec) => {
        const lowerLabel = sec.label.toLowerCase().trim();
        const fallbackIcon = DEFAULT_EVENT_ICONS[lowerLabel] || 'Calendar';
        const iconName = sec.icon_name || fallbackIcon;

        let path = sec.slug;
        if (sec.is_home) {
            path = '/dashboard/homepage';
        } else if (!path.startsWith('/dashboard')) {
            path = `/dashboard${path.startsWith('/') ? path : '/' + path}`;
        }

        return {
            id: `sec-${sec.id}`,
            label: sec.label,
            path,
            iconName
        };
    });

    const categoriesList = [
        ...STATIC_BEFORE_CATEGORIES,
        {
            category: 'EVENT SECTIONS',
            items: dynamicEventItems
        },
        ...STATIC_AFTER_CATEGORIES
    ];

    return (
        <>
            {/* Mobile backdrop overlay */}
            {isOpen && (
                <div
                    className="admin-sidebar-backdrop"
                    onClick={onCloseMobile}
                    aria-hidden="true"
                />
            )}

            <aside className={`admin-sidebar ${isOpen ? 'admin-sidebar--open' : ''}`}>
                {/* Brand Header */}
                <div className="admin-sidebar-header">
                    <div className="admin-sidebar-brand">
                        <img
                            src={thiranLogo}
                            alt="Thiran Admin"
                            className="admin-sidebar-logo"
                        />
                        <span className="admin-sidebar-badge">
                            <Flame size={12} />
                            ADMIN
                        </span>
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        type="button"
                        className="admin-sidebar-close-btn"
                        onClick={onCloseMobile}
                        aria-label="Close sidebar">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="admin-sidebar-nav">
                    {categoriesList.map((cat, idx) => (
                        <div
                            key={cat.category || `cat-${idx}`}
                            className="admin-sidebar-group">
                            {cat.category && <div className="admin-sidebar-cat-title">{cat.category}</div>}

                            <ul className="admin-sidebar-menu">
                                {cat.items.map((item) => {
                                    const IconComponent = ICON_MAP[item.iconName] || LayoutDashboard;
                                    return (
                                        <li key={item.id}>
                                            <NavLink
                                                to={item.path}
                                                end={item.path === '/dashboard'}
                                                className={({ isActive }) => `admin-sidebar-link ${isActive ? 'admin-sidebar-link--active' : ''}`}
                                                onClick={onCloseMobile}>
                                                <IconComponent
                                                    size={18}
                                                    className="admin-sidebar-icon"
                                                />
                                                <span className="admin-sidebar-label">{item.label}</span>
                                            </NavLink>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Footer User & Logout */}
                <div className="admin-sidebar-footer">
                    <div className="admin-sidebar-user">
                        <div className="admin-avatar">A</div>
                        <div className="admin-user-info">
                            <div className="admin-user-name">Administrator</div>
                            <div className="admin-user-role">sece@thiran.ac.in</div>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="admin-sidebar-logout-btn"
                        onClick={handleLogout}
                        title="Logout from Admin">
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
