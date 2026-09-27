export const STAT_CARDS_DATA = [
    {
        id: 'total-events',
        title: 'Total Events',
        value: '0',
        change: 'No events yet',
        changeType: 'neutral',
        iconName: 'Calendar',
        glowColor: 'pink'
    },
    {
        id: 'total-registrations',
        title: 'Total Registrations',
        value: '0',
        change: 'No signups yet',
        changeType: 'neutral',
        iconName: 'Users',
        glowColor: 'indigo'
    },
    {
        id: 'upcoming-events',
        title: 'Upcoming Events',
        value: '0',
        change: 'None scheduled',
        changeType: 'neutral',
        iconName: 'Flame',
        glowColor: 'pink'
    },
    {
        id: 'total-speakers',
        title: 'Total Speakers',
        value: '0',
        change: 'No speakers added',
        changeType: 'neutral',
        iconName: 'Mic',
        glowColor: 'indigo'
    }
];

export const QUICK_ACTIONS_DATA = [
    {
        id: 'action-add-event',
        label: 'Add Event',
        description: 'Create a new technical or cultural event',
        iconName: 'PlusCircle',
        path: '/dashboard/events',
        primary: true
    },
    {
        id: 'action-add-announcement',
        label: 'Add Announcement',
        description: 'Publish live news or updates',
        iconName: 'Megaphone',
        path: '/dashboard/announcements',
        primary: false
    },
    {
        id: 'action-add-speaker',
        label: 'Add Speaker',
        description: 'Register guest or keynote speakers',
        iconName: 'UserPlus',
        path: '/dashboard/speakers',
        primary: false
    },
    {
        id: 'action-view-registrations',
        label: 'View Registrations',
        description: 'Manage registered participants',
        iconName: 'ClipboardList',
        path: '/dashboard/registrations',
        primary: false
    }
];

export const UPCOMING_EVENTS_DATA = [];

export const RECENT_REGISTRATIONS_DATA = [];

export const THIRAN_CATEGORY_HIERARCHY = [
    {
        id: 'cat-home',
        name: 'HOME',
        path: '/dashboard/homepage',
        subcategories: []
    },
    {
        id: 'cat-hackathons',
        name: 'HACKATHONS',
        path: '/dashboard/hackathons',
        description: 'Multi-track coding hackathons & build fests',
        subcategories: [
            { id: 'sub-24h-hackathon', name: '24 Hours Hackathon' },
            { id: 'sub-ai-hackathon', name: 'AI Hackathon' },
            { id: 'sub-web3-hackathon', name: 'Web3 Hackathon' },
            { id: 'sub-cyber-hackathon', name: 'Cyber Hackathon' }
        ],
        allowUnlimitedSubcategories: true
    },
    {
        id: 'cat-tech-fest',
        name: 'TECH FEST',
        path: '/dashboard/tech-fest',
        description: 'Technical competitions, quizzes & project expos',
        subcategories: [
            { id: 'sub-tech-quiz', name: 'Tech Quiz' },
            { id: 'sub-project-expo', name: 'Project Expo' }
        ],
        allowUnlimitedSubcategories: true
    },
    {
        id: 'cat-spotlight-events',
        name: 'SPOTLIGHT EVENTS',
        path: '/dashboard/spotlight-events',
        description: 'Flagship & featured spotlight events',
        subcategories: [
            { id: 'sub-event-1', name: 'Event 1' },
            { id: 'sub-event-2', name: 'Event 2' }
        ],
        allowUnlimitedSubcategories: true
    },
    {
        id: 'cat-events',
        name: 'EVENTS',
        path: '/dashboard/events',
        description: 'General festival events & competitions',
        subcategories: [
            { id: 'sub-event-a', name: 'Event A' },
            { id: 'sub-event-b', name: 'Event B' }
        ],
        allowUnlimitedSubcategories: true
    },
    {
        id: 'cat-cultural-contests',
        name: 'CULTURAL CONTESTS',
        path: '/dashboard/cultural-contests',
        description: 'Music, dance, drama & art competitions',
        subcategories: [],
        allowUnlimitedSubcategories: true
    },
    {
        id: 'cat-guest-lounge',
        name: 'GUEST LOUNGE',
        path: '/dashboard/guest-lounge',
        description: 'VIP guests, keynote speakers, and lounge schedules',
        subcategories: [],
        allowUnlimitedSubcategories: true
    },
    {
        id: 'cat-celebrity-shows',
        name: 'CELEBRITY SHOWS',
        path: '/dashboard/celebrity-shows',
        description: 'Star performances & pro nights',
        subcategories: [],
        allowUnlimitedSubcategories: true
    }
];

export const SIDEBAR_NAV_CATEGORIES = [
    {
        category: null, // Top level
        items: [{ id: 'dashboard', label: 'Dashboard', path: '/dashboard', iconName: 'LayoutDashboard' }]
    },
    {
        category: 'EVENT SECTIONS',
        items: [
            { id: 'homepage', label: 'HOME', path: '/dashboard/homepage', iconName: 'Home' },
            { id: 'hackathons', label: 'HACKATHONS', path: '/dashboard/hackathons', iconName: 'Terminal' },
            { id: 'tech-fest', label: 'TECH FEST', path: '/dashboard/tech-fest', iconName: 'Cpu' },
            { id: 'spotlight-events', label: 'SPOTLIGHT EVENTS', path: '/dashboard/spotlight-events', iconName: 'Sparkles' },
            { id: 'events', label: 'EVENTS', path: '/dashboard/events', iconName: 'Calendar' },
            { id: 'cultural-contests', label: 'CULTURAL CONTESTS', path: '/dashboard/cultural-contests', iconName: 'Music' },
            { id: 'guest-lounge', label: 'GUEST LOUNGE', path: '/dashboard/guest-lounge', iconName: 'UserCheck' },
            { id: 'celebrity-shows', label: 'CELEBRITY SHOWS', path: '/dashboard/celebrity-shows', iconName: 'Crown' }
        ]
    },
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
