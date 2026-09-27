const db = require('../config/db');
const { emitNavigationChange } = require('../config/socket');

const MAX_TOP_LEVEL_PAGES = 8;

/**
 * Utility helper to generate URL slug from label if not provided
 */
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

/**
 * GET /api/navigation
 * Public endpoint for Client navbar. Returns active top-level pages and their active children.
 */
async function getPublicNavigation(req, res) {
    try {
        const result = await db.pool.query(`
            SELECT id, parent_id, label, slug, icon_name, display_order, is_home
            FROM navigation_items
            WHERE is_active = true
            ORDER BY display_order ASC, id ASC
        `);

        const rows = result.rows;
        const parents = rows.filter((r) => r.parent_id === null);

        const tree = parents.map((parent) => {
            const children = rows
                .filter((r) => r.parent_id === parent.id)
                .map((c) => ({
                    id: c.id,
                    label: c.label,
                    slug: c.slug,
                    display_order: c.display_order
                }));

            return {
                id: parent.id,
                label: parent.label,
                slug: parent.slug,
                icon_name: parent.icon_name,
                is_home: parent.is_home,
                display_order: parent.display_order,
                children
            };
        });

        res.status(200).json({
            success: true,
            count: tree.length,
            items: tree
        });
    } catch (err) {
        console.error('Error fetching public navigation:', err);
        res.status(500).json({ success: false, error: 'Database error fetching navigation' });
    }
}

/**
 * GET /api/navigation/admin
 * Admin endpoint. Returns all top-level pages (active & inactive), children, and top-level count / limit metrics.
 */
async function getAdminNavigation(req, res) {
    try {
        const result = await db.pool.query(`
            SELECT id, parent_id, label, slug, icon_name, display_order, is_active, is_home, created_at, updated_at
            FROM navigation_items
            ORDER BY display_order ASC, id ASC
        `);

        const rows = result.rows;
        const parents = rows.filter((r) => r.parent_id === null);

        const tree = parents.map((parent) => {
            const children = rows
                .filter((r) => r.parent_id === parent.id)
                .map((c) => ({
                    id: c.id,
                    parent_id: c.parent_id,
                    label: c.label,
                    slug: c.slug,
                    display_order: c.display_order,
                    is_active: c.is_active
                }));

            return {
                id: parent.id,
                label: parent.label,
                slug: parent.slug,
                icon_name: parent.icon_name,
                is_home: parent.is_home,
                display_order: parent.display_order,
                is_active: parent.is_active,
                childrenCount: children.length,
                children
            };
        });

        res.status(200).json({
            success: true,
            topLevelCount: parents.length,
            maxLimit: MAX_TOP_LEVEL_PAGES,
            isLimitReached: parents.length >= MAX_TOP_LEVEL_PAGES,
            items: tree
        });
    } catch (err) {
        console.error('Error fetching admin navigation:', err);
        res.status(500).json({ success: false, error: 'Database error fetching admin navigation' });
    }
}

/**
 * POST /api/navigation
 * Creates a top-level navigation page (Max 8 pages limit).
 */
async function createTopLevelPage(req, res) {
    try {
        // Count existing top-level pages
        const countRes = await db.pool.query(`SELECT COUNT(*) FROM navigation_items WHERE parent_id IS NULL`);
        const currentCount = parseInt(countRes.rows[0].count, 10);

        if (currentCount >= MAX_TOP_LEVEL_PAGES) {
            return res.status(400).json({
                success: false,
                error: `Top-level navigation limit reached (${MAX_TOP_LEVEL_PAGES} pages max). You cannot add a 9th top-level page.`
            });
        }

        const { label, slug, icon_name, display_order, is_home } = req.body;

        if (!label || !label.trim()) {
            return res.status(400).json({ success: false, error: 'Page label is required' });
        }

        const cleanLabel = label.trim();
        const rawSlug = slug && slug.trim() ? slug.trim() : `/${slugify(cleanLabel)}`;
        const cleanSlug = rawSlug.startsWith('/') ? rawSlug : `/${rawSlug}`;
        const order = display_order !== undefined ? Number(display_order) : currentCount + 1;

        const insertRes = await db.pool.query(
            `INSERT INTO navigation_items (parent_id, label, slug, icon_name, display_order, is_home)
             VALUES (NULL, $1, $2, $3, $4, $5)
             RETURNING *`,
            [cleanLabel, cleanSlug, icon_name || null, order, !!is_home]
        );

        const newItem = insertRes.rows[0];

        // Emit Socket.IO real-time event AFTER DB commit
        emitNavigationChange({ action: 'create', type: 'page', item: newItem });

        res.status(201).json({
            success: true,
            message: 'Top-level page created successfully',
            item: newItem
        });
    } catch (err) {
        console.error('Error creating top-level page:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    }
}

/**
 * PUT /api/navigation/reorder
 * Reorders navigation items in an atomic transaction.
 * Expects { items: [{ id: number, display_order: number }] }
 */
async function reorderNavigationPages(req, res) {
    const client = await db.pool.connect();
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, error: 'Invalid items array for reordering' });
        }

        await client.query('BEGIN');
        for (const item of items) {
            await client.query(`UPDATE navigation_items SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [
                Number(item.display_order),
                Number(item.id)
            ]);
        }
        await client.query('COMMIT');

        // Emit Socket.IO real-time event
        emitNavigationChange({ action: 'reorder', type: 'pages' });

        res.status(200).json({
            success: true,
            message: 'Navigation reordered successfully'
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error reordering navigation pages:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error reordering navigation' });
    } finally {
        client.release();
    }
}

/**
 * PUT /api/navigation/:id
 * Updates an existing top-level navigation page.
 */
async function updateTopLevelPage(req, res) {
    try {
        const pageId = Number(req.params.id);
        const { label, slug, icon_name, display_order, is_active } = req.body;

        const existingRes = await db.pool.query(`SELECT * FROM navigation_items WHERE id = $1 AND parent_id IS NULL`, [pageId]);
        if (existingRes.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Top-level page not found' });
        }

        const current = existingRes.rows[0];
        const newLabel = label !== undefined ? label.trim() : current.label;
        let newSlug = slug !== undefined ? slug.trim() : current.slug;
        if (newSlug && !newSlug.startsWith('/')) {
            newSlug = `/${newSlug}`;
        }
        const newIcon = icon_name !== undefined ? icon_name : current.icon_name;
        const newOrder = display_order !== undefined ? Number(display_order) : current.display_order;
        const newActive = is_active !== undefined ? Boolean(is_active) : current.is_active;

        const updateRes = await db.pool.query(
            `UPDATE navigation_items
             SET label = $1, slug = $2, icon_name = $3, display_order = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
             WHERE id = $6 RETURNING *`,
            [newLabel, newSlug, newIcon, newOrder, newActive, pageId]
        );

        const updatedItem = updateRes.rows[0];

        // Emit Socket.IO real-time event AFTER DB commit
        emitNavigationChange({ action: 'update', type: 'page', item: updatedItem });

        res.status(200).json({
            success: true,
            message: 'Top-level page updated successfully',
            item: updatedItem
        });
    } catch (err) {
        console.error('Error updating top-level page:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    }
}

/**
 * DELETE /api/navigation/:id
 * Deletes a top-level navigation page (cascades to all child items).
 * Permanent Home page cannot be deleted.
 */
async function deleteTopLevelPage(req, res) {
    try {
        const pageId = Number(req.params.id);

        const checkHome = await db.pool.query(`SELECT is_home FROM navigation_items WHERE id = $1 AND parent_id IS NULL`, [pageId]);
        if (checkHome.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Top-level page not found' });
        }
        if (checkHome.rows[0].is_home) {
            return res.status(400).json({ success: false, error: 'Home section is permanent and cannot be deleted.' });
        }

        const deleteRes = await db.pool.query(`DELETE FROM navigation_items WHERE id = $1 AND parent_id IS NULL RETURNING *`, [pageId]);

        // Emit Socket.IO real-time event AFTER DB commit
        emitNavigationChange({ action: 'delete', type: 'page', deletedId: pageId });

        res.status(200).json({
            success: true,
            message: 'Top-level page and associated child items deleted successfully',
            deletedId: pageId
        });
    } catch (err) {
        console.error('Error deleting top-level page:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    }
}

/**
 * POST /api/navigation/:pageId/children
 * Adds a child item under a top-level page (Unlimited items allowed).
 */
async function createChildItem(req, res) {
    try {
        const pageId = Number(req.params.pageId);
        const { label, slug, display_order } = req.body;

        // Verify parent exists
        const parentRes = await db.pool.query(`SELECT * FROM navigation_items WHERE id = $1 AND parent_id IS NULL`, [pageId]);
        if (parentRes.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Parent page not found' });
        }

        if (!label || !label.trim()) {
            return res.status(400).json({ success: false, error: 'Child label is required' });
        }

        const parent = parentRes.rows[0];
        const cleanLabel = label.trim();
        const defaultSlug = `${parent.slug.replace(/\/$/, '')}/${slugify(cleanLabel)}`;
        const cleanSlug = slug && slug.trim() ? slug.trim() : defaultSlug;

        // Count existing children for ordering
        const countRes = await db.pool.query(`SELECT COUNT(*) FROM navigation_items WHERE parent_id = $1`, [pageId]);
        const childCount = parseInt(countRes.rows[0].count, 10);
        const order = display_order !== undefined ? Number(display_order) : childCount + 1;

        const insertRes = await db.pool.query(
            `INSERT INTO navigation_items (parent_id, label, slug, display_order)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [pageId, cleanLabel, cleanSlug, order]
        );

        const newChild = insertRes.rows[0];

        // Emit Socket.IO real-time event AFTER DB commit
        emitNavigationChange({ action: 'create', type: 'child', item: newChild, parentId: pageId });

        res.status(201).json({
            success: true,
            message: 'Child item created successfully',
            item: newChild
        });
    } catch (err) {
        console.error('Error creating child item:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    }
}

/**
 * PUT /api/navigation/:pageId/children/:childId
 * Updates an existing child item under a top-level page.
 */
async function updateChildItem(req, res) {
    try {
        const pageId = Number(req.params.pageId);
        const childId = Number(req.params.childId);
        const { label, slug, display_order, is_active } = req.body;

        const existingRes = await db.pool.query(`SELECT * FROM navigation_items WHERE id = $1 AND parent_id = $2`, [childId, pageId]);
        if (existingRes.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Child item not found under specified parent page' });
        }

        const current = existingRes.rows[0];
        const newLabel = label !== undefined ? label.trim() : current.label;
        const newSlug = slug !== undefined ? slug.trim() : current.slug;
        const newOrder = display_order !== undefined ? Number(display_order) : current.display_order;
        const newActive = is_active !== undefined ? Boolean(is_active) : current.is_active;

        const updateRes = await db.pool.query(
            `UPDATE navigation_items
             SET label = $1, slug = $2, display_order = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP
             WHERE id = $5 AND parent_id = $6 RETURNING *`,
            [newLabel, newSlug, newOrder, newActive, childId, pageId]
        );

        const updatedChild = updateRes.rows[0];

        // Emit Socket.IO real-time event AFTER DB commit
        emitNavigationChange({ action: 'update', type: 'child', item: updatedChild, parentId: pageId });

        res.status(200).json({
            success: true,
            message: 'Child item updated successfully',
            item: updatedChild
        });
    } catch (err) {
        console.error('Error updating child item:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    }
}

/**
 * DELETE /api/navigation/:pageId/children/:childId
 * Deletes a child item under a top-level page.
 */
async function deleteChildItem(req, res) {
    try {
        const pageId = Number(req.params.pageId);
        const childId = Number(req.params.childId);

        const deleteRes = await db.pool.query(`DELETE FROM navigation_items WHERE id = $1 AND parent_id = $2 RETURNING *`, [childId, pageId]);

        if (deleteRes.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Child item not found' });
        }

        // Emit Socket.IO real-time event AFTER DB commit
        emitNavigationChange({ action: 'delete', type: 'child', deletedId: childId, parentId: pageId });

        res.status(200).json({
            success: true,
            message: 'Child item deleted successfully',
            deletedId: childId
        });
    } catch (err) {
        console.error('Error deleting child item:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    }
}

module.exports = {
    getPublicNavigation,
    getAdminNavigation,
    createTopLevelPage,
    reorderNavigationPages,
    updateTopLevelPage,
    deleteTopLevelPage,
    createChildItem,
    updateChildItem,
    deleteChildItem
};
