import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import {
    Layers,
    Plus,
    Edit3,
    Trash2,
    CheckCircle2,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    PlusCircle,
    X,
    GripVertical,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import './NavigationManager.css';

const API_BASE = 'http://localhost:5000/api/navigation';

export default function NavigationManager() {
    const [navData, setNavData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Reordering drag state
    const [draggedIndex, setDraggedIndex] = useState(null);

    // Modal state for adding/editing parent page
    const [showParentModal, setShowParentModal] = useState(false);
    const [editingParent, setEditingParent] = useState(null);
    const [parentLabel, setParentLabel] = useState('');
    const [parentSlug, setParentSlug] = useState('');
    const [parentIcon, setParentIcon] = useState('Calendar');
    const [parentActive, setParentActive] = useState(true);

    // Modal state for adding/editing child item
    const [showChildModal, setShowChildModal] = useState(false);
    const [activeParentForChild, setActiveParentForChild] = useState(null);
    const [editingChild, setEditingChild] = useState(null);
    const [childLabel, setChildLabel] = useState('');
    const [childSlug, setChildSlug] = useState('');

    // Expanded parent rows
    const [expandedPages, setExpandedPages] = useState({});

    const fetchNavigation = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/admin`);
            const data = await res.json();
            if (data.success) {
                setNavData(data);
                setExpandedPages((prev) => {
                    const exp = { ...prev };
                    data.items.forEach((item) => {
                        if (exp[item.id] === undefined) {
                            exp[item.id] = true;
                        }
                    });
                    return exp;
                });
            } else {
                setError(data.error || 'Failed to load navigation data');
            }
        } catch (err) {
            setError('Backend server not reachable on port 5000: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load + Real-time Socket.IO connection
    useEffect(() => {
        fetchNavigation();

        const socket = io('http://localhost:5000', {
            transports: ['websocket', 'polling'],
            reconnection: true
        });

        socket.on('connect', () => {
            console.log('⚡ Admin Socket connected for real-time management');
        });

        socket.on('navigation:changed', (payload) => {
            console.log('📡 Real-time update received in Admin UI:', payload);
            fetchNavigation();
        });

        socket.on('reconnect', () => {
            console.log('🔄 Admin socket reconnected. Syncing state...');
            fetchNavigation();
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchNavigation]);

    const toggleExpand = (id) => {
        setExpandedPages((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Trigger feedback message
    const notifySuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    // ── Reorder Handlers ──────────────────────────────────────────
    const persistReorder = async (reorderedItems) => {
        const payload = {
            items: reorderedItems.map((item, idx) => ({
                id: item.id,
                display_order: idx + 1
            }))
        };

        // Optimistically set local state
        setNavData((prev) => ({
            ...prev,
            items: reorderedItems.map((item, idx) => ({
                ...item,
                display_order: idx + 1
            }))
        }));

        try {
            const res = await fetch(`${API_BASE}/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                notifySuccess('Navigation order updated!');
            } else {
                setError(data.error || 'Failed to update order');
                fetchNavigation();
            }
        } catch (err) {
            setError('Reorder Error: ' + err.message);
            fetchNavigation();
        }
    };

    const movePage = (index, direction) => {
        if (!navData || !navData.items) return;
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= navData.items.length) return;

        const updated = [...navData.items];
        const [moved] = updated.splice(index, 1);
        updated.splice(targetIndex, 0, moved);

        persistReorder(updated);
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const updated = [...navData.items];
        const [draggedItem] = updated.splice(draggedIndex, 1);
        updated.splice(dropIndex, 0, draggedItem);

        setDraggedIndex(null);
        persistReorder(updated);
    };

    // ── Parent Page Handlers ─────────────────────────────────────
    const openAddParentModal = () => {
        if (navData && navData.topLevelCount >= 8) {
            setError('Top-level navigation limit of 8 pages reached. You cannot add a 9th page.');
            return;
        }
        setEditingParent(null);
        setParentLabel('');
        setParentSlug('');
        setParentIcon('Calendar');
        setParentActive(true);
        setShowParentModal(true);
    };

    const openEditParentModal = (page) => {
        setEditingParent(page);
        setParentLabel(page.label);
        setParentSlug(page.slug);
        setParentIcon(page.icon_name || 'Calendar');
        setParentActive(page.is_active);
        setShowParentModal(true);
    };

    const handleSaveParent = async (e) => {
        e.preventDefault();
        setError('');
        if (!parentLabel.trim()) {
            setError('Page label is required.');
            return;
        }

        try {
            const isEdit = Boolean(editingParent);
            const url = isEdit ? `${API_BASE}/${editingParent.id}` : API_BASE;
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    label: parentLabel,
                    slug: parentSlug,
                    icon_name: parentIcon,
                    is_active: parentActive
                })
            });

            const data = await res.json();
            if (data.success) {
                setShowParentModal(false);
                notifySuccess(isEdit ? 'Top-level page updated!' : 'New top-level page created!');
                fetchNavigation();
            } else {
                setError(data.error || 'Operation failed');
            }
        } catch (err) {
            setError('API Request Error: ' + err.message);
        }
    };

    const handleDeleteParent = async (page) => {
        if (page.is_home) {
            setError('Home section is permanent and cannot be deleted.');
            return;
        }
        if (!window.confirm(`Delete top-level page "${page.label}" and all its child items?`)) {
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/${page.id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                notifySuccess(`Deleted page "${page.label}".`);
                fetchNavigation();
            } else {
                setError(data.error || 'Failed to delete page');
            }
        } catch (err) {
            setError('Delete Request Error: ' + err.message);
        }
    };

    // ── Child Item Handlers ──────────────────────────────────────
    const openAddChildModal = (parentPage) => {
        setActiveParentForChild(parentPage);
        setEditingChild(null);
        setChildLabel('');
        setChildSlug('');
        setShowChildModal(true);
    };

    const openEditChildModal = (parentPage, child) => {
        setActiveParentForChild(parentPage);
        setEditingChild(child);
        setChildLabel(child.label);
        setChildSlug(child.slug);
        setShowChildModal(true);
    };

    const handleSaveChild = async (e) => {
        e.preventDefault();
        setError('');
        if (!childLabel.trim()) {
            setError('Child item label is required.');
            return;
        }

        try {
            const isEdit = Boolean(editingChild);
            const url = isEdit
                ? `${API_BASE}/${activeParentForChild.id}/children/${editingChild.id}`
                : `${API_BASE}/${activeParentForChild.id}/children`;
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    label: childLabel,
                    slug: childSlug
                })
            });

            const data = await res.json();
            if (data.success) {
                setShowChildModal(false);
                notifySuccess(isEdit ? 'Child item updated!' : 'Child item added under ' + activeParentForChild.label);
                fetchNavigation();
            } else {
                setError(data.error || 'Operation failed');
            }
        } catch (err) {
            setError('API Request Error: ' + err.message);
        }
    };

    const handleDeleteChild = async (parentPage, child) => {
        if (!window.confirm(`Delete child item "${child.label}"?`)) {
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/${parentPage.id}/children/${child.id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                notifySuccess(`Deleted child item "${child.label}".`);
                fetchNavigation();
            } else {
                setError(data.error || 'Failed to delete child item');
            }
        } catch (err) {
            setError('Delete Request Error: ' + err.message);
        }
    };

    return (
        <div className="admin-nav-manager">
            {/* Header & Metrics */}
            <div className="admin-nav-header">
                <div>
                    <h2 className="admin-nav-title">Navigation Management</h2>
                    <p className="admin-nav-sub">Manage top-level navbar pages (Max 8) and child event categories (Unlimited)</p>
                </div>

                <div className="admin-nav-header-actions">
                    {/* Limit Metric Badge */}
                    <div className="admin-nav-limit-pill">
                        <Layers size={15} />
                        <span>
                            Top-Level Pages: <strong>{navData ? navData.topLevelCount : 0} / 8</strong>
                        </span>
                    </div>

                    <button
                        type="button"
                        className="admin-nav-add-btn"
                        disabled={navData && navData.topLevelCount >= 8}
                        onClick={openAddParentModal}
                        title={navData && navData.topLevelCount >= 8 ? 'Limit reached (8/8 max)' : 'Add Page'}>
                        <Plus size={16} />
                        <span>Add Page</span>
                    </button>

                    <button
                        type="button"
                        className="admin-nav-refresh-btn"
                        onClick={fetchNavigation}
                        title="Refresh database data">
                        <RefreshCw
                            size={16}
                            className={loading ? 'spin' : ''}
                        />
                    </button>
                </div>
            </div>

            {/* Notifications */}
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

            {/* Limit Reached Banner Warning */}
            {navData && navData.topLevelCount >= 8 && (
                <div className="admin-nav-warning-banner">
                    <AlertCircle size={16} />
                    <span>
                        <strong>Top-level page limit reached (8/8).</strong> Enforced: Cannot add a 9th page. Delete or edit existing pages to modify
                        top-level structure. Children under pages remain <strong>unlimited</strong>.
                    </span>
                </div>
            )}

            {/* Tree View Structure List */}
            <div className="admin-nav-tree-container">
                {loading && !navData ? (
                    <div className="admin-nav-loading">Connecting to PostgreSQL database...</div>
                ) : !navData || navData.items.length === 0 ? (
                    <div className="admin-nav-empty">No navigation items found in database.</div>
                ) : (
                    <div className="admin-nav-tree">
                        {navData.items.map((page, index) => (
                            <div
                                key={page.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                className={`admin-nav-card ${!page.is_active ? 'admin-nav-card--inactive' : ''} ${
                                    draggedIndex === index ? 'admin-nav-card--dragging' : ''
                                }`}>
                                {/* Parent Page Row Header */}
                                <div className="admin-nav-parent-row">
                                    <div
                                        className="admin-nav-drag-handle"
                                        title="Drag to reorder section">
                                        <GripVertical size={16} />
                                    </div>

                                    <div className="admin-nav-move-btns">
                                        <button
                                            type="button"
                                            className="admin-nav-move-btn"
                                            disabled={index === 0}
                                            onClick={() => movePage(index, -1)}
                                            title="Move Up">
                                            <ArrowUp size={12} />
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-nav-move-btn"
                                            disabled={index === navData.items.length - 1}
                                            onClick={() => movePage(index, 1)}
                                            title="Move Down">
                                            <ArrowDown size={12} />
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        className="admin-nav-expand-btn"
                                        onClick={() => toggleExpand(page.id)}>
                                        {expandedPages[page.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>

                                    <div className="admin-nav-parent-info">
                                        <span className="admin-nav-order">#{index + 1}</span>
                                        <span className="admin-nav-parent-label">{page.label}</span>
                                        <code className="admin-nav-slug">{page.slug}</code>

                                        {page.is_home && <span className="admin-badge admin-badge--home">Home</span>}

                                        <span className={`admin-badge ${page.is_active ? 'admin-badge--active' : 'admin-badge--inactive'}`}>
                                            {page.is_active ? 'Active' : 'Hidden'}
                                        </span>

                                        <span className="admin-nav-child-count">
                                            {page.childrenCount} {page.childrenCount === 1 ? 'child' : 'children'} (unlimited)
                                        </span>
                                    </div>

                                    <div className="admin-nav-parent-actions">
                                        <button
                                            type="button"
                                            className="admin-action-btn admin-action-btn--add-child"
                                            onClick={() => openAddChildModal(page)}
                                            title="Add child sub-event item (Unlimited)">
                                            <PlusCircle size={14} />
                                            <span>Add Child</span>
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-action-btn"
                                            onClick={() => openEditParentModal(page)}
                                            title="Edit top-level page">
                                            <Edit3 size={14} />
                                        </button>

                                        {!page.is_home && (
                                            <button
                                                type="button"
                                                className="admin-action-btn admin-action-btn--danger"
                                                onClick={() => handleDeleteParent(page)}
                                                title="Delete top-level page">
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Nested Child Items List */}
                                {expandedPages[page.id] && (
                                    <div className="admin-nav-children-wrapper">
                                        {page.children.length === 0 ? (
                                            <div className="admin-nav-no-children">
                                                <span>No child items under "{page.label}" yet.</span>
                                                <button
                                                    type="button"
                                                    className="admin-text-link"
                                                    onClick={() => openAddChildModal(page)}>
                                                    + Add Child Item (Unlimited)
                                                </button>
                                            </div>
                                        ) : (
                                            <ul className="admin-nav-children-list">
                                                {page.children.map((child) => (
                                                    <li
                                                        key={child.id}
                                                        className="admin-nav-child-row">
                                                        <div className="admin-nav-child-info">
                                                            <span className="admin-nav-child-label">{child.label}</span>
                                                            <code className="admin-nav-slug">{child.slug}</code>
                                                        </div>

                                                        <div className="admin-nav-child-actions">
                                                            <button
                                                                type="button"
                                                                className="admin-action-btn"
                                                                onClick={() => openEditChildModal(page, child)}
                                                                title="Edit child item">
                                                                <Edit3 size={13} />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="admin-action-btn admin-action-btn--danger"
                                                                onClick={() => handleDeleteChild(page, child)}
                                                                title="Delete child item">
                                                                <Trash2 size={13} />
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── PARENT PAGE MODAL ────────────────────────────────────── */}
            {showParentModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h3>{editingParent ? 'Edit Top-Level Page' : 'Add Top-Level Page (Max 8)'}</h3>
                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={() => setShowParentModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveParent}>
                            <div className="admin-modal-body">
                                <div className="admin-form-group">
                                    <label>Page Title / Label *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Hackathons"
                                        value={parentLabel}
                                        onChange={(e) => setParentLabel(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label>URL Slug (auto-generated if empty)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. /hackathons"
                                        value={parentSlug}
                                        onChange={(e) => setParentSlug(e.target.value)}
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label>Status</label>
                                    <select
                                        value={parentActive ? 'true' : 'false'}
                                        onChange={(e) => setParentActive(e.target.value === 'true')}>
                                        <option value="true">Active (Visible on Client)</option>
                                        <option value="false">Hidden (Inactive)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn-secondary"
                                    onClick={() => setShowParentModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn-primary">
                                    {editingParent ? 'Save Changes' : 'Create Page'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── CHILD ITEM MODAL ────────────────────────────────────── */}
            {showChildModal && activeParentForChild && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h3>{editingChild ? 'Edit Child Item' : `Add Child Item under "${activeParentForChild.label}"`}</h3>
                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={() => setShowChildModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveChild}>
                            <div className="admin-modal-body">
                                <div className="admin-form-group">
                                    <label>Child Event / Item Name *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 24 Hours Hackathon"
                                        value={childLabel}
                                        onChange={(e) => setChildLabel(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label>URL Slug (auto-generated if empty)</label>
                                    <input
                                        type="text"
                                        placeholder={`e.g. ${activeParentForChild.slug}/24-hours`}
                                        value={childSlug}
                                        onChange={(e) => setChildSlug(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn-secondary"
                                    onClick={() => setShowChildModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn-primary">
                                    {editingChild ? 'Save Changes' : 'Add Child Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
