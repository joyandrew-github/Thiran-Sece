import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import {
    Terminal,
    Layers,
    Calendar,
    Plus,
    Edit3,
    Trash2,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    GripVertical,
    ArrowUp,
    ArrowDown,
    Upload,
    ExternalLink,
    X,
    Eye,
    EyeOff,
    Sparkles,
    FileText,
    HelpCircle,
    Award,
    Clock,
    ShieldAlert,
    MapPin,
    Users,
    Tag,
    UserCheck,
    Building2
} from 'lucide-react';
import './SectionPageManager.css';

const API_BASE = 'http://localhost:5000/api/pages';

export default function SectionPageManager({ sectionSlug = 'hackathons' }) {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [activeTab, setActiveTab] = useState('settings'); // 'settings', 'events', 'sections'

    // ── PAGE SETTINGS FORM STATE ──────────────────────────────────
    const [navLabel, setNavLabel] = useState('');
    const [pageTitle, setPageTitle] = useState('');
    const [pageSubtitle, setPageSubtitle] = useState('');
    const [pageDesc, setPageDesc] = useState('');
    const [heroImage, setHeroImage] = useState('');
    const [badgeLabel, setBadgeLabel] = useState('THIRAN EVENT SECTION');
    const [pageIcon, setPageIcon] = useState('Terminal');
    const [pageStatus, setPageStatus] = useState(true);
    const [displayOrder, setDisplayOrder] = useState(1);
    const [savingSettings, setSavingSettings] = useState(false);

    // ── SUB-EVENTS STATE & MODAL ──────────────────────────────────
    const [draggedEventIndex, setDraggedEventIndex] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    // Sub-event form fields
    const [eventName, setEventName] = useState('');
    const [eventNavLabel, setEventNavLabel] = useState('');
    const [eventSlug, setEventSlug] = useState('');
    const [eventShortDesc, setEventShortDesc] = useState('');
    const [eventFullDesc, setEventFullDesc] = useState('');
    const [eventImage, setEventImage] = useState('');
    const [eventBanner, setEventBanner] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [venue, setVenue] = useState('');
    const [organizedBy, setOrganizedBy] = useState('');
    const [facultyName, setFacultyName] = useState('');
    const [facultyPhone, setFacultyPhone] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentPhone, setStudentPhone] = useState('');
    const [tags, setTags] = useState('');
    const [regEnabled, setRegEnabled] = useState(true);
    const [regUrl, setRegUrl] = useState('');
    const [regDeadline, setRegDeadline] = useState('');
    const [maxParticipants, setMaxParticipants] = useState(0);
    const [eventStatus, setEventStatus] = useState('Upcoming');
    const [eventOrder, setEventOrder] = useState(1);
    const [showInDropdown, setShowInDropdown] = useState(true);
    const [isPublished, setIsPublished] = useState(true);
    const [eventRules, setEventRules] = useState('');
    const [eventPrizes, setEventPrizes] = useState('');

    // ── CONTENT SECTIONS STATE & MODAL ─────────────────────────────
    const [draggedSecIndex, setDraggedSecIndex] = useState(null);
    const [showSecModal, setShowSecModal] = useState(false);
    const [editingSec, setEditingSec] = useState(null);

    // Content section form fields
    const [secType, setSecType] = useState('about');
    const [secTitle, setSecTitle] = useState('');
    const [secSubtitle, setSecSubtitle] = useState('');
    const [secContent, setSecContent] = useState('');
    const [secMediaUrl, setSecMediaUrl] = useState('');
    const [secOrder, setSecOrder] = useState(1);
    const [secActive, setSecActive] = useState(true);

    // ── FETCH PAGE DATA ───────────────────────────────────────────
    const fetchPageData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/${sectionSlug}`);
            const data = await res.json();
            if (data.success) {
                setPageData(data);

                // Populate settings form
                const nav = data.navItem || {};
                const st = data.settings || {};
                setNavLabel(nav.label || 'Hackathons');
                setPageTitle(st.title || 'HACKATHONS');
                setPageSubtitle(st.subtitle || '');
                setPageDesc(st.description || '');
                setHeroImage(st.hero_image || '');
                setBadgeLabel(st.badge_label || 'THIRAN EVENT SECTION');
                setPageIcon(st.icon_name || nav.icon_name || 'Terminal');
                setPageStatus(st.status !== undefined ? st.status : nav.is_active);
                setDisplayOrder(nav.display_order || 1);
            } else {
                setError(data.error || 'Failed to fetch page content');
            }
        } catch (err) {
            setError('Backend server connection error: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, [sectionSlug]);

    // Initial load + Real-time Socket.IO synchronization
    useEffect(() => {
        fetchPageData();

        const socket = io('http://localhost:5000', {
            transports: ['websocket', 'polling'],
            reconnection: true
        });

        socket.on('navigation:changed', () => {
            fetchPageData();
        });

        socket.on('reconnect', () => {
            fetchPageData();
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchPageData]);

    const notifySuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    // ── FILE UPLOAD HELPER ───────────────────────────────────────
    const handleFileUpload = async (e, setter) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch('http://localhost:5000/api/pages/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setter(data.imageUrl);
                notifySuccess('Image uploaded successfully!');
            } else {
                setError(data.error || 'Failed to upload image');
            }
        } catch (err) {
            setError('Image upload failed: ' + err.message);
        }
    };

    // ── SAVE PAGE SETTINGS ───────────────────────────────────────
    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSavingSettings(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/${sectionSlug}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    navigation_label: navLabel,
                    title: pageTitle,
                    subtitle: pageSubtitle,
                    description: pageDesc,
                    hero_image: heroImage,
                    badge_label: badgeLabel,
                    icon_name: pageIcon,
                    status: pageStatus,
                    display_order: displayOrder
                })
            });

            const data = await res.json();
            if (data.success) {
                notifySuccess('Page settings updated and broadcast in real-time!');
                fetchPageData();
            } else {
                setError(data.error || 'Failed to update page settings');
            }
        } catch (err) {
            setError('Request Error: ' + err.message);
        } finally {
            setSavingSettings(false);
        }
    };

    // ── SUB-EVENTS HANDLERS ──────────────────────────────────────
    const openAddEventModal = () => {
        setEditingEvent(null);
        setEventName('');
        setEventNavLabel('');
        setEventSlug('');
        setEventShortDesc('');
        setEventFullDesc('');
        setEventImage('');
        setEventBanner('');
        setEventDate('');
        setStartTime('');
        setEndTime('');
        setVenue('');
        setOrganizedBy('');
        setFacultyName('');
        setFacultyPhone('');
        setStudentName('');
        setStudentPhone('');
        setTags('');
        setRegEnabled(true);
        setRegUrl('');
        setRegDeadline('');
        setMaxParticipants(0);
        setEventStatus('Upcoming');
        setEventOrder((pageData?.events?.length || 0) + 1);
        setShowInDropdown(true);
        setIsPublished(true);
        setEventRules('');
        setEventPrizes('');
        setShowEventModal(true);
    };

    const openEditEventModal = (ev) => {
        setEditingEvent(ev);
        setEventName(ev.event_name);
        setEventNavLabel(ev.navigation_label || ev.event_name);
        setEventSlug(ev.slug);
        setEventShortDesc(ev.short_description || '');
        setEventFullDesc(ev.full_description || '');
        setEventImage(ev.event_image || '');
        setEventBanner(ev.banner_image || '');
        setEventDate(ev.event_date || '');
        setStartTime(ev.start_time || '');
        setEndTime(ev.end_time || '');
        setVenue(ev.venue || '');
        setOrganizedBy(ev.organized_by || '');
        setFacultyName(ev.faculty_coordinator_name || '');
        setFacultyPhone(ev.faculty_coordinator_phone || '');
        setStudentName(ev.student_coordinator_name || '');
        setStudentPhone(ev.student_coordinator_phone || '');
        setTags(ev.tags || '');
        setRegEnabled(ev.registration_enabled);
        setRegUrl(ev.registration_url || '');
        setRegDeadline(ev.registration_deadline || '');
        setMaxParticipants(ev.max_participants || 0);
        setEventStatus(ev.event_status || 'Upcoming');
        setEventOrder(ev.display_order || 1);
        setShowInDropdown(ev.show_in_dropdown);
        setIsPublished(ev.is_published);
        setEventRules(ev.rules || '');
        setEventPrizes(ev.prizes || '');
        setShowEventModal(true);
    };

    const handleSaveEvent = async (e) => {
        e.preventDefault();
        setError('');
        if (!eventName.trim()) {
            setError('Event name is required.');
            return;
        }

        try {
            const isEdit = Boolean(editingEvent);
            const url = isEdit ? `${API_BASE}/${sectionSlug}/events/${editingEvent.id}` : `${API_BASE}/${sectionSlug}/events`;
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_name: eventName,
                    navigation_label: eventNavLabel,
                    slug: eventSlug,
                    short_description: eventShortDesc,
                    full_description: eventFullDesc,
                    event_image: eventImage,
                    banner_image: eventBanner,
                    event_date: eventDate,
                    start_time: startTime,
                    end_time: endTime,
                    venue,
                    organized_by: organizedBy,
                    faculty_coordinator_name: facultyName,
                    faculty_coordinator_phone: facultyPhone,
                    student_coordinator_name: studentName,
                    student_coordinator_phone: studentPhone,
                    tags,
                    registration_enabled: regEnabled,
                    registration_url: regUrl,
                    registration_deadline: regDeadline,
                    max_participants: maxParticipants,
                    event_status: eventStatus,
                    display_order: eventOrder,
                    show_in_dropdown: showInDropdown,
                    is_published: isPublished,
                    rules: eventRules,
                    prizes: eventPrizes
                })
            });

            const data = await res.json();
            if (data.success) {
                setShowEventModal(false);
                notifySuccess(isEdit ? 'Sub-event updated!' : 'New sub-event added!');
                fetchPageData();
            } else {
                setError(data.error || 'Operation failed');
            }
        } catch (err) {
            setError('API Request Error: ' + err.message);
        }
    };

    const handleDeleteEvent = async (ev) => {
        if (!window.confirm(`Delete sub-event "${ev.event_name}" permanently?`)) return;
        try {
            const res = await fetch(`${API_BASE}/${sectionSlug}/events/${ev.id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                notifySuccess(`Deleted sub-event "${ev.event_name}".`);
                fetchPageData();
            } else {
                setError(data.error || 'Failed to delete sub-event');
            }
        } catch (err) {
            setError('Delete Error: ' + err.message);
        }
    };

    const persistEventReorder = async (reordered) => {
        const payload = {
            items: reordered.map((item, idx) => ({ id: item.id, display_order: idx + 1 }))
        };
        setPageData((prev) => ({ ...prev, events: reordered }));

        try {
            const res = await fetch(`${API_BASE}/${sectionSlug}/events/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                notifySuccess('Sub-events order updated!');
            } else {
                setError(data.error || 'Reorder failed');
                fetchPageData();
            }
        } catch (err) {
            setError('Reorder Error: ' + err.message);
            fetchPageData();
        }
    };

    const moveEvent = (index, direction) => {
        const eventsList = pageData?.events || [];
        const target = index + direction;
        if (target < 0 || target >= eventsList.length) return;

        const updated = [...eventsList];
        const [moved] = updated.splice(index, 1);
        updated.splice(target, 0, moved);

        persistEventReorder(updated);
    };

    const handleEventDragStart = (e, idx) => {
        setDraggedEventIndex(idx);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleEventDrop = (e, dropIdx) => {
        e.preventDefault();
        if (draggedEventIndex === null || draggedEventIndex === dropIdx) return;
        const updated = [...(pageData?.events || [])];
        const [moved] = updated.splice(draggedEventIndex, 1);
        updated.splice(dropIdx, 0, moved);
        setDraggedEventIndex(null);
        persistEventReorder(updated);
    };

    // ── CONTENT SECTIONS HANDLERS ──────────────────────────────────
    const openAddSecModal = () => {
        setEditingSec(null);
        setSecType('about');
        setSecTitle('');
        setSecSubtitle('');
        setSecContent('');
        setSecMediaUrl('');
        setSecOrder((pageData?.contentSections?.length || 0) + 1);
        setSecActive(true);
        setShowSecModal(true);
    };

    const openEditSecModal = (sec) => {
        setEditingSec(sec);
        setSecType(sec.section_type || 'custom');
        setSecTitle(sec.title);
        setSecSubtitle(sec.subtitle || '');
        setSecContent(sec.content || '');
        setSecMediaUrl(sec.media_url || '');
        setSecOrder(sec.display_order || 1);
        setSecActive(sec.is_active);
        setShowSecModal(true);
    };

    const handleSaveSec = async (e) => {
        e.preventDefault();
        setError('');
        if (!secTitle.trim()) {
            setError('Section title is required.');
            return;
        }

        try {
            const isEdit = Boolean(editingSec);
            const url = isEdit ? `${API_BASE}/${sectionSlug}/sections/${editingSec.id}` : `${API_BASE}/${sectionSlug}/sections`;
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section_type: secType,
                    title: secTitle,
                    subtitle: secSubtitle,
                    content: secContent,
                    media_url: secMediaUrl,
                    display_order: secOrder,
                    is_active: secActive
                })
            });

            const data = await res.json();
            if (data.success) {
                setShowSecModal(false);
                notifySuccess(isEdit ? 'Content section updated!' : 'Content section added!');
                fetchPageData();
            } else {
                setError(data.error || 'Operation failed');
            }
        } catch (err) {
            setError('API Request Error: ' + err.message);
        }
    };

    const handleDeleteSec = async (sec) => {
        if (!window.confirm(`Delete section "${sec.title}"?`)) return;
        try {
            const res = await fetch(`${API_BASE}/${sectionSlug}/sections/${sec.id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                notifySuccess(`Deleted section "${sec.title}".`);
                fetchPageData();
            } else {
                setError(data.error || 'Failed to delete section');
            }
        } catch (err) {
            setError('Delete Error: ' + err.message);
        }
    };

    const persistSecReorder = async (reordered) => {
        const payload = {
            items: reordered.map((item, idx) => ({ id: item.id, display_order: idx + 1 }))
        };
        setPageData((prev) => ({ ...prev, contentSections: reordered }));

        try {
            const res = await fetch(`${API_BASE}/${sectionSlug}/sections/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                notifySuccess('Sections order updated!');
            } else {
                setError(data.error || 'Reorder failed');
                fetchPageData();
            }
        } catch (err) {
            setError('Reorder Error: ' + err.message);
            fetchPageData();
        }
    };

    const moveSec = (index, direction) => {
        const secList = pageData?.contentSections || [];
        const target = index + direction;
        if (target < 0 || target >= secList.length) return;

        const updated = [...secList];
        const [moved] = updated.splice(index, 1);
        updated.splice(target, 0, moved);

        persistSecReorder(updated);
    };

    const handleSecDragStart = (e, idx) => {
        setDraggedSecIndex(idx);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleSecDrop = (e, dropIdx) => {
        e.preventDefault();
        if (draggedSecIndex === null || draggedSecIndex === dropIdx) return;
        const updated = [...(pageData?.contentSections || [])];
        const [moved] = updated.splice(draggedSecIndex, 1);
        updated.splice(dropIdx, 0, moved);
        setDraggedSecIndex(null);
        persistSecReorder(updated);
    };

    return (
        <div className="spm-container">
            {/* Header / Banner */}
            <div className="spm-header">
                <div className="spm-header-left">
                    <span className="spm-badge">
                        <Terminal size={12} />
                        {badgeLabel || 'THIRAN EVENT SECTION'}
                    </span>
                    <h2 className="spm-title">{pageTitle || 'HACKATHONS'}</h2>
                    <p className="spm-subtitle">{pageSubtitle || 'Manage dynamic content, sub-events and sections'}</p>
                </div>

                <div className="spm-header-actions">
                    <a
                        href={`http://localhost:5173/${sectionSlug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="spm-btn-client"
                        title="View live Client page">
                        <ExternalLink size={15} />
                        <span>View Client Page</span>
                    </a>

                    <button
                        type="button"
                        className="admin-nav-refresh-btn"
                        onClick={fetchPageData}
                        title="Refresh data">
                        <RefreshCw
                            size={16}
                            className={loading ? 'spin' : ''}
                        />
                    </button>
                </div>
            </div>

            {/* Alert Feedback Notifications */}
            {error && (
                <div className="admin-alert admin-alert--error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {successMsg && (
                <div className="admin-alert admin-alert--success">
                    <CheckCircle2 size={18} />
                    <span>{successMsg}</span>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="spm-tabs">
                <button
                    type="button"
                    className={`spm-tab ${activeTab === 'settings' ? 'spm-tab--active' : ''}`}
                    onClick={() => setActiveTab('settings')}>
                    <Layers size={16} />
                    <span>Page Settings</span>
                </button>

                <button
                    type="button"
                    className={`spm-tab ${activeTab === 'events' ? 'spm-tab--active' : ''}`}
                    onClick={() => setActiveTab('events')}>
                    <Calendar size={16} />
                    <span>Sub-Events</span>
                    <span className="spm-tab-count">{pageData?.events?.length || 0}</span>
                </button>

                <button
                    type="button"
                    className={`spm-tab ${activeTab === 'sections' ? 'spm-tab--active' : ''}`}
                    onClick={() => setActiveTab('sections')}>
                    <FileText size={16} />
                    <span>Page Content Sections</span>
                    <span className="spm-tab-count">{pageData?.contentSections?.length || 0}</span>
                </button>
            </div>

            {/* ── TAB 1: PAGE SETTINGS ────────────────────────────────────── */}
            {activeTab === 'settings' && (
                <form
                    onSubmit={handleSaveSettings}
                    className="spm-panel">
                    <div className="spm-panel-header">
                        <div>
                            <h3 className="spm-panel-title">Page Metadata & Hero Settings</h3>
                            <p className="spm-panel-sub">Configure title, subtitle, descriptions and hero banner visible on public Client</p>
                        </div>
                    </div>

                    <div className="spm-form-grid">
                        <div className="spm-form-group">
                            <label className="spm-label">Navigation Label *</label>
                            <input
                                type="text"
                                className="spm-input"
                                value={navLabel}
                                onChange={(e) => setNavLabel(e.target.value)}
                                required
                            />
                        </div>

                        <div className="spm-form-group">
                            <label className="spm-label">Page Main Title *</label>
                            <input
                                type="text"
                                className="spm-input"
                                value={pageTitle}
                                onChange={(e) => setPageTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="spm-form-group">
                            <label className="spm-label">Section Badge Text</label>
                            <input
                                type="text"
                                className="spm-input"
                                value={badgeLabel}
                                onChange={(e) => setBadgeLabel(e.target.value)}
                            />
                        </div>

                        <div className="spm-form-group">
                            <label className="spm-label">Page Status</label>
                            <select
                                className="spm-select"
                                value={pageStatus ? 'true' : 'false'}
                                onChange={(e) => setPageStatus(e.target.value === 'true')}>
                                <option value="true">Active (Visible on Client)</option>
                                <option value="false">Hidden (Inactive)</option>
                            </select>
                        </div>

                        <div className="spm-form-group spm-form-group--full">
                            <label className="spm-label">Subtitle / Tagline</label>
                            <input
                                type="text"
                                className="spm-input"
                                value={pageSubtitle}
                                onChange={(e) => setPageSubtitle(e.target.value)}
                                placeholder="e.g. Multi-track coding hackathons & build fests"
                            />
                        </div>

                        <div className="spm-form-group spm-form-group--full">
                            <label className="spm-label">Full Page Description (Rich Content)</label>
                            <textarea
                                className="spm-textarea"
                                rows={4}
                                value={pageDesc}
                                onChange={(e) => setPageDesc(e.target.value)}
                                placeholder="Describe the hackathons section..."
                            />
                        </div>

                        {/* Hero Image Field */}
                        <div className="spm-form-group spm-form-group--full">
                            <label className="spm-label">Hero / Banner Image</label>
                            <div className="spm-image-field">
                                {heroImage && (
                                    <div className="spm-image-preview-wrapper">
                                        <img
                                            src={heroImage}
                                            alt="Hero Banner Preview"
                                            className="spm-image-preview"
                                        />
                                        <button
                                            type="button"
                                            className="spm-image-remove-btn"
                                            onClick={() => setHeroImage('')}
                                            title="Remove image">
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                                <div className="spm-image-inputs">
                                    <label className="spm-upload-btn">
                                        <Upload size={16} />
                                        <span>Upload File</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFileUpload(e, setHeroImage)}
                                        />
                                    </label>

                                    <input
                                        type="text"
                                        className="spm-input"
                                        style={{ flex: 1 }}
                                        placeholder="Or paste image URL (e.g. https://...)"
                                        value={heroImage}
                                        onChange={(e) => setHeroImage(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="spm-save-bar">
                        <button
                            type="submit"
                            className="spm-add-btn"
                            disabled={savingSettings}>
                            {savingSettings ? 'Saving Changes...' : 'Save Page Settings'}
                        </button>
                    </div>
                </form>
            )}

            {/* ── TAB 2: SUB-EVENTS MANAGEMENT ───────────────────────────── */}
            {activeTab === 'events' && (
                <div className="spm-panel">
                    <div className="spm-panel-header">
                        <div>
                            <h3 className="spm-panel-title">Sub-Events & Tracks (Unlimited)</h3>
                            <p className="spm-panel-sub">Manage sub-events listed on the Hackathons page and Client navbar dropdown</p>
                        </div>

                        <button
                            type="button"
                            className="spm-add-btn"
                            onClick={openAddEventModal}>
                            <Plus size={16} />
                            <span>+ Add Sub-Event</span>
                        </button>
                    </div>

                    <div className="spm-list">
                        {!pageData?.events || pageData.events.length === 0 ? (
                            <div className="admin-nav-empty">No sub-events found. Click "+ Add Sub-Event" to create one.</div>
                        ) : (
                            pageData.events.map((ev, idx) => (
                                <div
                                    key={ev.id}
                                    draggable
                                    onDragStart={(e) => handleEventDragStart(e, idx)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleEventDrop(e, idx)}
                                    className={`spm-card ${draggedEventIndex === idx ? 'spm-card--dragging' : ''}`}>
                                    <div className="spm-card-left">
                                        <div
                                            className="spm-drag-handle"
                                            title="Drag to reorder">
                                            <GripVertical size={16} />
                                        </div>

                                        <div className="spm-move-btns">
                                            <button
                                                type="button"
                                                className="spm-move-btn"
                                                disabled={idx === 0}
                                                onClick={() => moveEvent(idx, -1)}>
                                                <ArrowUp size={12} />
                                            </button>
                                            <button
                                                type="button"
                                                className="spm-move-btn"
                                                disabled={idx === pageData.events.length - 1}
                                                onClick={() => moveEvent(idx, 1)}>
                                                <ArrowDown size={12} />
                                            </button>
                                        </div>

                                        {ev.event_image && (
                                            <img
                                                src={ev.event_image}
                                                alt={ev.event_name}
                                                className="spm-card-thumb"
                                            />
                                        )}

                                        <div className="spm-card-info">
                                            <div className="spm-card-title">
                                                <span>
                                                    #{idx + 1} {ev.event_name}
                                                </span>
                                                <span className={`admin-badge ${ev.is_published ? 'admin-badge--active' : 'admin-badge--inactive'}`}>
                                                    {ev.is_published ? 'Published' : 'Draft'}
                                                </span>
                                            </div>

                                            <div className="spm-card-meta">
                                                <code>{ev.slug}</code>
                                                {ev.event_date && <span>📅 {ev.event_date}</span>}
                                                {ev.organized_by && <span>🏢 Org: {ev.organized_by}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="spm-card-actions">
                                        <button
                                            type="button"
                                            className="admin-action-btn"
                                            onClick={() => openEditEventModal(ev)}
                                            title="Edit sub-event">
                                            <Edit3 size={14} />
                                            <span>Edit</span>
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-action-btn admin-action-btn--danger"
                                            onClick={() => handleDeleteEvent(ev)}
                                            title="Delete sub-event">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* ── TAB 3: CONTENT SECTIONS MANAGEMENT ────────────────────── */}
            {activeTab === 'sections' && (
                <div className="spm-panel">
                    <div className="spm-panel-header">
                        <div>
                            <h3 className="spm-panel-title">Page Content Sections</h3>
                            <p className="spm-panel-sub">Manage content sections like About, Rules, Timeline, Prizes, FAQs on the Hackathons page</p>
                        </div>

                        <button
                            type="button"
                            className="spm-add-btn"
                            onClick={openAddSecModal}>
                            <Plus size={16} />
                            <span>+ Add Content Section</span>
                        </button>
                    </div>

                    <div className="spm-list">
                        {!pageData?.contentSections || pageData.contentSections.length === 0 ? (
                            <div className="admin-nav-empty">No content sections defined. Click "+ Add Content Section" to add one.</div>
                        ) : (
                            pageData.contentSections.map((sec, idx) => (
                                <div
                                    key={sec.id}
                                    draggable
                                    onDragStart={(e) => handleSecDragStart(e, idx)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleSecDrop(e, idx)}
                                    className={`spm-card ${draggedSecIndex === idx ? 'spm-card--dragging' : ''}`}>
                                    <div className="spm-card-left">
                                        <div
                                            className="spm-drag-handle"
                                            title="Drag to reorder">
                                            <GripVertical size={16} />
                                        </div>

                                        <div className="spm-move-btns">
                                            <button
                                                type="button"
                                                className="spm-move-btn"
                                                disabled={idx === 0}
                                                onClick={() => moveSec(idx, -1)}>
                                                <ArrowUp size={12} />
                                            </button>
                                            <button
                                                type="button"
                                                className="spm-move-btn"
                                                disabled={idx === pageData.contentSections.length - 1}
                                                onClick={() => moveSec(idx, 1)}>
                                                <ArrowDown size={12} />
                                            </button>
                                        </div>

                                        <div className="spm-card-info">
                                            <div className="spm-card-title">
                                                <span>
                                                    #{idx + 1} {sec.title}
                                                </span>
                                                <span className="admin-badge admin-badge--home">{sec.section_type?.toUpperCase()}</span>
                                                <span className={`admin-badge ${sec.is_active ? 'admin-badge--active' : 'admin-badge--inactive'}`}>
                                                    {sec.is_active ? 'Active' : 'Hidden'}
                                                </span>
                                            </div>

                                            {sec.subtitle && <div className="spm-card-meta">{sec.subtitle}</div>}
                                        </div>
                                    </div>

                                    <div className="spm-card-actions">
                                        <button
                                            type="button"
                                            className="admin-action-btn"
                                            onClick={() => openEditSecModal(sec)}
                                            title="Edit section">
                                            <Edit3 size={14} />
                                            <span>Edit</span>
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-action-btn admin-action-btn--danger"
                                            onClick={() => handleDeleteSec(sec)}
                                            title="Delete section">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* ── SUB-EVENT MODAL ─────────────────────────────────────────── */}
            {showEventModal && (
                <div className="admin-modal-overlay">
                    <div
                        className="admin-modal"
                        style={{ maxWidth: 720 }}>
                        <div className="admin-modal-header">
                            <h3>{editingEvent ? 'Edit Sub-Event' : 'Add Sub-Event'}</h3>
                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={() => setShowEventModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEvent}>
                            <div
                                className="admin-modal-body"
                                style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                                <div className="spm-form-grid">
                                    <div className="spm-form-group">
                                        <label className="spm-label">Event Name *</label>
                                        <input
                                            type="text"
                                            className="spm-input"
                                            placeholder="e.g. Codeathon"
                                            value={eventName}
                                            onChange={(e) => setEventName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="spm-form-group">
                                        <label className="spm-label">Navbar Label</label>
                                        <input
                                            type="text"
                                            className="spm-input"
                                            placeholder="e.g. 24 Hours Hackathon"
                                            value={eventNavLabel}
                                            onChange={(e) => setEventNavLabel(e.target.value)}
                                        />
                                    </div>

                                    <div className="spm-form-group">
                                        <label className="spm-label">URL Slug</label>
                                        <input
                                            type="text"
                                            className="spm-input"
                                            placeholder="e.g. /hackathons/24-hours"
                                            value={eventSlug}
                                            onChange={(e) => setEventSlug(e.target.value)}
                                        />
                                    </div>

                                    <div className="spm-form-group">
                                        <label className="spm-label">Organized By (Department)</label>
                                        <input
                                            type="text"
                                            className="spm-input"
                                            placeholder="e.g. CCE"
                                            value={organizedBy}
                                            onChange={(e) => setOrganizedBy(e.target.value)}
                                        />
                                    </div>

                                    <div className="spm-form-group">
                                        <label className="spm-label">Faculty Coordinator Name</label>
                                        <input
                                            type="text"
                                            className="spm-input"
                                            placeholder="e.g. Ms. R. Megala"
                                            value={facultyName}
                                            onChange={(e) => setFacultyName(e.target.value)}
                                        />
                                    </div>

                                    <div className="spm-form-group">
                                        <label className="spm-label">Faculty Phone Number</label>
                                        <input
                                            type="text"
                                            className="spm-input"
                                            placeholder="e.g. 99526 15687"
                                            value={facultyPhone}
                                            onChange={(e) => setFacultyPhone(e.target.value)}
                                        />
                                    </div>

                                    <div className="spm-form-group">
                                        <label className="spm-label">Student Coordinator Name</label>
                                        <input
                                            type="text"
                                            className="spm-input"
                                            placeholder="e.g. Mr. Prassanna Murthy"
                                            value={studentName}
                                            onChange={(e) => setStudentName(e.target.value)}
                                        />
                                    </div>

                                    <div className="spm-form-group">
                                        <label className="spm-label">Student Phone Number</label>
                                        <input
                                            type="text"
                                            className="spm-input"
                                            placeholder="e.g. 94428 23677"
                                            value={studentPhone}
                                            onChange={(e) => setStudentPhone(e.target.value)}
                                        />
                                    </div>

                                    <div className="spm-form-group spm-form-group--full">
                                        <label className="spm-label">Filter Tags (Comma Separated)</label>
                                        <input
                                            type="text"
                                            className="spm-input"
                                            placeholder="e.g. 4 FEB, 5 FEB, CCE, CSE, AI-DS"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                        />
                                    </div>

                                    <div className="spm-form-group">
                                        <label className="spm-label">Event Date Display</label>
                                        <input
                                            type="text"
                                            className="spm-input"
                                            placeholder="e.g. 04, 05 February, 2026"
                                            value={eventDate}
                                            onChange={(e) => setEventDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="spm-form-group">
                                        <label className="spm-label">Start Time</label>
                                        <input
                                            type="text"
                                            className="spm-input"
                                            placeholder="e.g. 11.00 am"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                        />
                                    </div>

                                    <div className="spm-form-group">
                                        <label className="spm-label">End Time</label>
                                        <input
                                            type="text"
                                            className="spm-input"
                                            placeholder="e.g. 11.00am"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                        />
                                    </div>

                                    <div className="spm-form-group">
                                        <label className="spm-label">Venue / Location</label>
                                        <input
                                            type="text"
                                            className="spm-input"
                                            placeholder="e.g. Sri Eshwar Campus"
                                            value={venue}
                                            onChange={(e) => setVenue(e.target.value)}
                                        />
                                    </div>

                                    <div className="spm-form-group spm-form-group--full">
                                        <label className="spm-label">Short Description</label>
                                        <input
                                            type="text"
                                            className="spm-input"
                                            placeholder="Brief tagline / theme description"
                                            value={eventShortDesc}
                                            onChange={(e) => setEventShortDesc(e.target.value)}
                                        />
                                    </div>

                                    <div className="spm-form-group spm-form-group--full">
                                        <label className="spm-label">Full Description (Rich Text)</label>
                                        <textarea
                                            className="spm-textarea"
                                            rows={3}
                                            placeholder="Comprehensive description for event page"
                                            value={eventFullDesc}
                                            onChange={(e) => setEventFullDesc(e.target.value)}
                                        />
                                    </div>

                                    {/* Event Image */}
                                    <div className="spm-form-group spm-form-group--full">
                                        <label className="spm-label">Poster / Event Flyer Image</label>
                                        <div className="spm-image-field">
                                            {eventImage && (
                                                <div className="spm-image-preview-wrapper">
                                                    <img
                                                        src={eventImage}
                                                        alt="Event Poster Preview"
                                                        className="spm-image-preview"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="spm-image-remove-btn"
                                                        onClick={() => setEventImage('')}>
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            )}
                                            <div className="spm-image-inputs">
                                                <label className="spm-upload-btn">
                                                    <Upload size={16} />
                                                    <span>Upload Poster</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => handleFileUpload(e, setEventImage)}
                                                    />
                                                </label>
                                                <input
                                                    type="text"
                                                    className="spm-input"
                                                    style={{ flex: 1 }}
                                                    placeholder="Or paste Poster Image URL"
                                                    value={eventImage}
                                                    onChange={(e) => setEventImage(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="spm-form-group spm-form-group--full">
                                        <label className="spm-label">Rules & Guidelines</label>
                                        <textarea
                                            className="spm-textarea"
                                            rows={3}
                                            placeholder="Event rules..."
                                            value={eventRules}
                                            onChange={(e) => setEventRules(e.target.value)}
                                        />
                                    </div>

                                    <div className="spm-form-group spm-form-group--full">
                                        <label className="spm-label">Prizes & Awards</label>
                                        <textarea
                                            className="spm-textarea"
                                            rows={3}
                                            placeholder="Prize details..."
                                            value={eventPrizes}
                                            onChange={(e) => setEventPrizes(e.target.value)}
                                        />
                                    </div>

                                    <div className="spm-form-group">
                                        <label className="spm-label">Show in Navbar Dropdown?</label>
                                        <select
                                            className="spm-select"
                                            value={showInDropdown ? 'true' : 'false'}
                                            onChange={(e) => setShowInDropdown(e.target.value === 'true')}>
                                            <option value="true">Yes (Show in Navbar Dropdown)</option>
                                            <option value="false">No (Hide from Dropdown)</option>
                                        </select>
                                    </div>

                                    <div className="spm-form-group">
                                        <label className="spm-label">Publish Status</label>
                                        <select
                                            className="spm-select"
                                            value={isPublished ? 'true' : 'false'}
                                            onChange={(e) => setIsPublished(e.target.value === 'true')}>
                                            <option value="true">Published (Visible on Client)</option>
                                            <option value="false">Draft / Unpublished</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn-secondary"
                                    onClick={() => setShowEventModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn-primary">
                                    {editingEvent ? 'Save Changes' : 'Create Sub-Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── CONTENT SECTION MODAL ───────────────────────────────────── */}
            {showSecModal && (
                <div className="admin-modal-overlay">
                    <div
                        className="admin-modal"
                        style={{ maxWidth: 600 }}>
                        <div className="admin-modal-header">
                            <h3>{editingSec ? 'Edit Content Section' : 'Add Content Section'}</h3>
                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={() => setShowSecModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveSec}>
                            <div className="admin-modal-body">
                                <div className="spm-form-group">
                                    <label className="spm-label">Section Type</label>
                                    <select
                                        className="spm-select"
                                        value={secType}
                                        onChange={(e) => setSecType(e.target.value)}>
                                        <option value="about">About Section</option>
                                        <option value="rules">Rules & Guidelines</option>
                                        <option value="timeline">Timeline & Schedule</option>
                                        <option value="prizes">Prizes & Recognition</option>
                                        <option value="faq">Frequently Asked Questions</option>
                                        <option value="eligibility">Eligibility Criteria</option>
                                        <option value="sponsors">Sponsors / Partners</option>
                                        <option value="custom">Custom Section</option>
                                    </select>
                                </div>

                                <div className="spm-form-group">
                                    <label className="spm-label">Section Title *</label>
                                    <input
                                        type="text"
                                        className="spm-input"
                                        placeholder="e.g. Rules & Guidelines"
                                        value={secTitle}
                                        onChange={(e) => setSecTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="spm-form-group">
                                    <label className="spm-label">Subtitle / Description</label>
                                    <input
                                        type="text"
                                        className="spm-input"
                                        placeholder="e.g. Fair play and submission standards"
                                        value={secSubtitle}
                                        onChange={(e) => setSecSubtitle(e.target.value)}
                                    />
                                </div>

                                <div className="spm-form-group">
                                    <label className="spm-label">Section Content (Rich Text / Details)</label>
                                    <textarea
                                        className="spm-textarea"
                                        rows={4}
                                        placeholder="Write section text content..."
                                        value={secContent}
                                        onChange={(e) => setSecContent(e.target.value)}
                                    />
                                </div>

                                <div className="spm-form-group">
                                    <label className="spm-label">Status</label>
                                    <select
                                        className="spm-select"
                                        value={secActive ? 'true' : 'false'}
                                        onChange={(e) => setSecActive(e.target.value === 'true')}>
                                        <option value="true">Active (Visible on Client)</option>
                                        <option value="false">Hidden (Inactive)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn-secondary"
                                    onClick={() => setShowSecModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn-primary">
                                    {editingSec ? 'Save Changes' : 'Create Section'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
