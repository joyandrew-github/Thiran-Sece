const db = require('../config/db');
const { emitNavigationChange } = require('../config/socket');

/**
 * Utility helper to normalize slug strings
 */
function normalizeSlug(slug) {
    if (!slug) return '';
    const clean = slug.trim().toLowerCase();
    return clean.startsWith('/') ? clean : `/${clean}`;
}

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
 * GET /api/pages/:slug
 * Fetches complete page data: Navigation record, Page Settings, Sub-Events, Content Sections.
 */
async function getPageBySlug(req, res) {
    try {
        const rawSlug = req.params.slug;
        const searchSlug = normalizeSlug(rawSlug);

        // 1. Find navigation item
        const navRes = await db.pool.query(`SELECT * FROM navigation_items WHERE slug = $1 OR slug = $2 OR LOWER(label) = LOWER($3)`, [
            searchSlug,
            rawSlug,
            rawSlug
        ]);

        if (navRes.rows.length === 0) {
            return res.status(404).json({ success: false, error: `Page section "${rawSlug}" not found.` });
        }

        const navItem = navRes.rows[0];

        // 2. Fetch page settings
        let settingsRes = await db.pool.query(`SELECT * FROM page_settings WHERE nav_item_id = $1`, [navItem.id]);
        let settings = settingsRes.rows[0];

        // If settings don't exist yet, return defaults
        if (!settings) {
            settings = {
                title: navItem.label.toUpperCase(),
                subtitle: `Explore ${navItem.label} at Thiran`,
                description: `Manage dynamic content for ${navItem.label}.`,
                hero_image: '',
                badge_label: 'THIRAN EVENT SECTION',
                icon_name: navItem.icon_name || 'Terminal',
                status: navItem.is_active
            };
        }

        // 3. Fetch sub-events
        const eventsRes = await db.pool.query(`SELECT * FROM events WHERE nav_item_id = $1 ORDER BY display_order ASC, id ASC`, [navItem.id]);

        // 4. Fetch content sections
        const sectionsRes = await db.pool.query(`SELECT * FROM page_content_sections WHERE nav_item_id = $1 ORDER BY display_order ASC, id ASC`, [
            navItem.id
        ]);

        res.status(200).json({
            success: true,
            navItem,
            settings,
            events: eventsRes.rows,
            contentSections: sectionsRes.rows
        });
    } catch (err) {
        console.error('Error in getPageBySlug:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error fetching page' });
    }
}

/**
 * PUT /api/pages/:slug/settings
 * Updates Page Settings (Title, Subtitle, Description, Hero Image, Badge, Status, etc.)
 */
async function updatePageSettings(req, res) {
    try {
        const searchSlug = normalizeSlug(req.params.slug);
        const navRes = await db.pool.query(`SELECT * FROM navigation_items WHERE slug = $1 OR LOWER(label) = LOWER($2)`, [
            searchSlug,
            req.params.slug
        ]);

        if (navRes.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Page section not found' });
        }

        const navItem = navRes.rows[0];
        const { title, subtitle, description, hero_image, badge_label, icon_name, status, navigation_label, display_order } = req.body;

        // Upsert page_settings
        const settingsRes = await db.pool.query(
            `INSERT INTO page_settings (nav_item_id, title, subtitle, description, hero_image, badge_label, icon_name, status, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
             ON CONFLICT (nav_item_id)
             DO UPDATE SET
                 title = EXCLUDED.title,
                 subtitle = EXCLUDED.subtitle,
                 description = EXCLUDED.description,
                 hero_image = EXCLUDED.hero_image,
                 badge_label = EXCLUDED.badge_label,
                 icon_name = EXCLUDED.icon_name,
                 status = EXCLUDED.status,
                 updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [
                navItem.id,
                title || navItem.label.toUpperCase(),
                subtitle || '',
                description || '',
                hero_image || '',
                badge_label || 'THIRAN EVENT SECTION',
                icon_name || navItem.icon_name || 'Terminal',
                status !== undefined ? Boolean(status) : true
            ]
        );

        // Update navigation_items label/icon/order if provided
        if (navigation_label || icon_name || display_order !== undefined || status !== undefined) {
            await db.pool.query(
                `UPDATE navigation_items
                 SET label = COALESCE($1, label),
                     icon_name = COALESCE($2, icon_name),
                     display_order = COALESCE($3, display_order),
                     is_active = COALESCE($4, is_active),
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $5`,
                [
                    navigation_label ? navigation_label.trim() : null,
                    icon_name || null,
                    display_order !== undefined ? Number(display_order) : null,
                    status !== undefined ? Boolean(status) : null,
                    navItem.id
                ]
            );
        }

        emitNavigationChange({ action: 'update', type: 'page_settings', slug: navItem.slug });

        res.status(200).json({
            success: true,
            message: 'Page settings updated successfully',
            settings: settingsRes.rows[0]
        });
    } catch (err) {
        console.error('Error updating page settings:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    }
}

/**
 * POST /api/pages/:slug/events
 * Creates a new sub-event and syncs it with navigation_items for dropdown display.
 */
async function createSubEvent(req, res) {
    const client = await db.pool.connect();
    try {
        const searchSlug = normalizeSlug(req.params.slug);
        const navRes = await client.query(`SELECT * FROM navigation_items WHERE slug = $1 OR LOWER(label) = LOWER($2)`, [
            searchSlug,
            req.params.slug
        ]);

        if (navRes.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Parent page section not found' });
        }

        const parentNav = navRes.rows[0];
        const {
            event_name,
            navigation_label,
            slug,
            short_description,
            full_description,
            event_image,
            banner_image,
            event_date,
            start_time,
            end_time,
            venue,
            registration_enabled,
            registration_url,
            registration_deadline,
            max_participants,
            event_status,
            display_order,
            show_in_dropdown,
            is_published,
            rules,
            prizes,
            organized_by,
            faculty_coordinator_name,
            faculty_coordinator_phone,
            student_coordinator_name,
            student_coordinator_phone,
            tags
        } = req.body;

        if (!event_name || !event_name.trim()) {
            return res.status(400).json({ success: false, error: 'Event name is required' });
        }

        const cleanName = event_name.trim();
        const navLabel = navigation_label && navigation_label.trim() ? navigation_label.trim() : cleanName;
        const defaultSlug = `${parentNav.slug.replace(/\/$/, '')}/${slugify(cleanName)}`;
        const cleanSlug = normalizeSlug(slug && slug.trim() ? slug.trim() : defaultSlug);

        // Count existing sub-events for ordering
        const countRes = await client.query(`SELECT COUNT(*) FROM events WHERE nav_item_id = $1`, [parentNav.id]);
        const currentCount = parseInt(countRes.rows[0].count, 10);
        const order = display_order !== undefined ? Number(display_order) : currentCount + 1;

        await client.query('BEGIN');

        // Insert into events table
        const eventInsert = await client.query(
            `INSERT INTO events (
                nav_item_id, event_name, navigation_label, slug, short_description, full_description,
                event_image, banner_image, event_date, start_time, end_time, venue,
                registration_enabled, registration_url, registration_deadline, max_participants,
                event_status, display_order, show_in_dropdown, is_published, rules, prizes,
                organized_by, faculty_coordinator_name, faculty_coordinator_phone,
                student_coordinator_name, student_coordinator_phone, tags
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28
            ) RETURNING *`,
            [
                parentNav.id,
                cleanName,
                navLabel,
                cleanSlug,
                short_description || '',
                full_description || '',
                event_image || '',
                banner_image || '',
                event_date || '',
                start_time || '',
                end_time || '',
                venue || '',
                registration_enabled !== undefined ? Boolean(registration_enabled) : true,
                registration_url || '',
                registration_deadline || '',
                max_participants ? Number(max_participants) : 0,
                event_status || 'Upcoming',
                order,
                show_in_dropdown !== undefined ? Boolean(show_in_dropdown) : true,
                is_published !== undefined ? Boolean(is_published) : true,
                rules || '',
                prizes || '',
                organized_by || '',
                faculty_coordinator_name || '',
                faculty_coordinator_phone || '',
                student_coordinator_name || '',
                student_coordinator_phone || '',
                tags || ''
            ]
        );

        const newEvent = eventInsert.rows[0];

        // Also sync child item into navigation_items table for Client Navbar dropdown
        if (newEvent.show_in_dropdown && newEvent.is_published) {
            await client.query(
                `INSERT INTO navigation_items (parent_id, label, slug, display_order, is_active)
                 VALUES ($1, $2, $3, $4, true)`,
                [parentNav.id, navLabel, cleanSlug, order]
            );
        }

        await client.query('COMMIT');

        emitNavigationChange({ action: 'create', type: 'sub_event', item: newEvent });

        res.status(201).json({
            success: true,
            message: 'Sub-event created successfully',
            event: newEvent
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating sub-event:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    } finally {
        client.release();
    }
}

/**
 * PUT /api/pages/:slug/events/reorder
 * Reorders sub-events and updates display_order.
 */
async function reorderSubEvents(req, res) {
    const client = await db.pool.connect();
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, error: 'Invalid items array for reordering sub-events' });
        }

        await client.query('BEGIN');
        for (const item of items) {
            const newOrder = Number(item.display_order);
            const eventId = Number(item.id);

            // Update events table
            const updateRes = await client.query(
                `UPDATE events SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING nav_item_id, slug, navigation_label`,
                [newOrder, eventId]
            );

            if (updateRes.rows.length > 0) {
                const ev = updateRes.rows[0];
                // Sync display_order in navigation_items matching slug
                await client.query(`UPDATE navigation_items SET display_order = $1 WHERE parent_id = $2 AND slug = $3`, [
                    newOrder,
                    ev.nav_item_id,
                    ev.slug
                ]);
            }
        }
        await client.query('COMMIT');

        emitNavigationChange({ action: 'reorder', type: 'sub_events' });

        res.status(200).json({ success: true, message: 'Sub-events reordered successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error reordering sub-events:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    } finally {
        client.release();
    }
}

/**
 * PUT /api/pages/:slug/events/:eventId
 * Updates an existing sub-event and syncs navigation_items.
 */
async function updateSubEvent(req, res) {
    const client = await db.pool.connect();
    try {
        const eventId = Number(req.params.eventId);
        const existingRes = await client.query(`SELECT * FROM events WHERE id = $1`, [eventId]);

        if (existingRes.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Sub-event not found' });
        }

        const oldEvent = existingRes.rows[0];
        const {
            event_name,
            navigation_label,
            slug,
            short_description,
            full_description,
            event_image,
            banner_image,
            event_date,
            start_time,
            end_time,
            venue,
            registration_enabled,
            registration_url,
            registration_deadline,
            max_participants,
            event_status,
            display_order,
            show_in_dropdown,
            is_published,
            rules,
            prizes,
            organized_by,
            faculty_coordinator_name,
            faculty_coordinator_phone,
            student_coordinator_name,
            student_coordinator_phone,
            tags
        } = req.body;

        const newName = event_name !== undefined ? event_name.trim() : oldEvent.event_name;
        const newNavLabel = navigation_label !== undefined ? navigation_label.trim() : oldEvent.navigation_label;
        const newSlug = slug !== undefined ? normalizeSlug(slug.trim()) : oldEvent.slug;
        const newOrder = display_order !== undefined ? Number(display_order) : oldEvent.display_order;
        const newShowDropdown = show_in_dropdown !== undefined ? Boolean(show_in_dropdown) : oldEvent.show_in_dropdown;
        const newIsPublished = is_published !== undefined ? Boolean(is_published) : oldEvent.is_published;

        await client.query('BEGIN');

        const updateRes = await client.query(
            `UPDATE events
             SET event_name = $1, navigation_label = $2, slug = $3, short_description = $4, full_description = $5,
                 event_image = $6, banner_image = $7, event_date = $8, start_time = $9, end_time = $10, venue = $11,
                 registration_enabled = $12, registration_url = $13, registration_deadline = $14, max_participants = $15,
                 event_status = $16, display_order = $17, show_in_dropdown = $18, is_published = $19, rules = $20, prizes = $21,
                 organized_by = $22, faculty_coordinator_name = $23, faculty_coordinator_phone = $24,
                 student_coordinator_name = $25, student_coordinator_phone = $26, tags = $27,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $28 RETURNING *`,
            [
                newName,
                newNavLabel,
                newSlug,
                short_description !== undefined ? short_description : oldEvent.short_description,
                full_description !== undefined ? full_description : oldEvent.full_description,
                event_image !== undefined ? event_image : oldEvent.event_image,
                banner_image !== undefined ? banner_image : oldEvent.banner_image,
                event_date !== undefined ? event_date : oldEvent.event_date,
                start_time !== undefined ? start_time : oldEvent.start_time,
                end_time !== undefined ? end_time : oldEvent.end_time,
                venue !== undefined ? venue : oldEvent.venue,
                registration_enabled !== undefined ? Boolean(registration_enabled) : oldEvent.registration_enabled,
                registration_url !== undefined ? registration_url : oldEvent.registration_url,
                registration_deadline !== undefined ? registration_deadline : oldEvent.registration_deadline,
                max_participants !== undefined ? Number(max_participants) : oldEvent.max_participants,
                event_status !== undefined ? event_status : oldEvent.event_status,
                newOrder,
                newShowDropdown,
                newIsPublished,
                rules !== undefined ? rules : oldEvent.rules,
                prizes !== undefined ? prizes : oldEvent.prizes,
                organized_by !== undefined ? organized_by : oldEvent.organized_by,
                faculty_coordinator_name !== undefined ? faculty_coordinator_name : oldEvent.faculty_coordinator_name,
                faculty_coordinator_phone !== undefined ? faculty_coordinator_phone : oldEvent.faculty_coordinator_phone,
                student_coordinator_name !== undefined ? student_coordinator_name : oldEvent.student_coordinator_name,
                student_coordinator_phone !== undefined ? student_coordinator_phone : oldEvent.student_coordinator_phone,
                tags !== undefined ? tags : oldEvent.tags,
                eventId
            ]
        );

        const updatedEvent = updateRes.rows[0];

        // Sync with navigation_items:
        await client.query(`DELETE FROM navigation_items WHERE parent_id = $1 AND slug = $2`, [oldEvent.nav_item_id, oldEvent.slug]);

        if (updatedEvent.show_in_dropdown && updatedEvent.is_published) {
            await client.query(
                `INSERT INTO navigation_items (parent_id, label, slug, display_order, is_active)
                 VALUES ($1, $2, $3, $4, true)`,
                [updatedEvent.nav_item_id, updatedEvent.navigation_label || updatedEvent.event_name, updatedEvent.slug, updatedEvent.display_order]
            );
        }

        await client.query('COMMIT');

        emitNavigationChange({ action: 'update', type: 'sub_event', item: updatedEvent });

        res.status(200).json({
            success: true,
            message: 'Sub-event updated successfully',
            event: updatedEvent
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error updating sub-event:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    } finally {
        client.release();
    }
}

/**
 * DELETE /api/pages/:slug/events/:eventId
 * Deletes a sub-event and removes its navigation_items record.
 */
async function deleteSubEvent(req, res) {
    const client = await db.pool.connect();
    try {
        const eventId = Number(req.params.eventId);
        await client.query('BEGIN');

        const deleteRes = await client.query(`DELETE FROM events WHERE id = $1 RETURNING *`, [eventId]);

        if (deleteRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, error: 'Sub-event not found' });
        }

        const deletedEvent = deleteRes.rows[0];

        // Remove matching navigation_items row
        await client.query(`DELETE FROM navigation_items WHERE parent_id = $1 AND slug = $2`, [deletedEvent.nav_item_id, deletedEvent.slug]);

        await client.query('COMMIT');

        emitNavigationChange({ action: 'delete', type: 'sub_event', deletedId: eventId });

        res.status(200).json({
            success: true,
            message: 'Sub-event deleted successfully',
            deletedId: eventId
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error deleting sub-event:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    } finally {
        client.release();
    }
}

/**
 * GET /api/events/detail/:eventSlug
 * Public endpoint to fetch detailed data for a specific sub-event by slug.
 */
async function getEventDetailBySlug(req, res) {
    try {
        const rawSlug = req.params.eventSlug;
        const searchSlug = normalizeSlug(rawSlug);

        const eventRes = await db.pool.query(
            `SELECT e.*, n.label as parent_section_name, n.slug as parent_section_slug
             FROM events e
             JOIN navigation_items n ON e.nav_item_id = n.id
             WHERE e.slug = $1 OR e.slug = $2 OR LOWER(e.event_name) = LOWER($3)`,
            [searchSlug, rawSlug, rawSlug]
        );

        if (eventRes.rows.length === 0) {
            return res.status(404).json({ success: false, error: `Sub-event "${rawSlug}" not found.` });
        }

        res.status(200).json({
            success: true,
            event: eventRes.rows[0]
        });
    } catch (err) {
        console.error('Error fetching event detail:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    }
}

/**
 * Content Section Handlers
 */
async function createContentSection(req, res) {
    try {
        const searchSlug = normalizeSlug(req.params.slug);
        const navRes = await db.pool.query(`SELECT * FROM navigation_items WHERE slug = $1 OR LOWER(label) = LOWER($2)`, [
            searchSlug,
            req.params.slug
        ]);

        if (navRes.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Parent page section not found' });
        }

        const navItem = navRes.rows[0];
        const { section_type, title, subtitle, content, media_url, display_order, is_active } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ success: false, error: 'Section title is required' });
        }

        const countRes = await db.pool.query(`SELECT COUNT(*) FROM page_content_sections WHERE nav_item_id = $1`, [navItem.id]);
        const currentCount = parseInt(countRes.rows[0].count, 10);
        const order = display_order !== undefined ? Number(display_order) : currentCount + 1;

        const insertRes = await db.pool.query(
            `INSERT INTO page_content_sections (nav_item_id, section_type, title, subtitle, content, media_url, display_order, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [
                navItem.id,
                section_type || 'custom',
                title.trim(),
                subtitle || '',
                content || '',
                media_url || '',
                order,
                is_active !== undefined ? Boolean(is_active) : true
            ]
        );

        const newSection = insertRes.rows[0];
        emitNavigationChange({ action: 'create', type: 'content_section', item: newSection });

        res.status(201).json({
            success: true,
            message: 'Content section created successfully',
            section: newSection
        });
    } catch (err) {
        console.error('Error creating content section:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    }
}

async function reorderContentSections(req, res) {
    const client = await db.pool.connect();
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, error: 'Invalid items array for reordering sections' });
        }

        await client.query('BEGIN');
        for (const item of items) {
            await client.query(`UPDATE page_content_sections SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [
                Number(item.display_order),
                Number(item.id)
            ]);
        }
        await client.query('COMMIT');

        emitNavigationChange({ action: 'reorder', type: 'content_sections' });

        res.status(200).json({ success: true, message: 'Content sections reordered successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error reordering content sections:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    } finally {
        client.release();
    }
}

async function updateContentSection(req, res) {
    try {
        const sectionId = Number(req.params.sectionId);
        const { section_type, title, subtitle, content, media_url, display_order, is_active } = req.body;

        const updateRes = await db.pool.query(
            `UPDATE page_content_sections
             SET section_type = COALESCE($1, section_type),
                 title = COALESCE($2, title),
                 subtitle = COALESCE($3, subtitle),
                 content = COALESCE($4, content),
                 media_url = COALESCE($5, media_url),
                 display_order = COALESCE($6, display_order),
                 is_active = COALESCE($7, is_active),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $8 RETURNING *`,
            [
                section_type || null,
                title ? title.trim() : null,
                subtitle !== undefined ? subtitle : null,
                content !== undefined ? content : null,
                media_url !== undefined ? media_url : null,
                display_order !== undefined ? Number(display_order) : null,
                is_active !== undefined ? Boolean(is_active) : null,
                sectionId
            ]
        );

        if (updateRes.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Content section not found' });
        }

        const updatedSection = updateRes.rows[0];
        emitNavigationChange({ action: 'update', type: 'content_section', item: updatedSection });

        res.status(200).json({
            success: true,
            message: 'Content section updated successfully',
            section: updatedSection
        });
    } catch (err) {
        console.error('Error updating content section:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    }
}

async function deleteContentSection(req, res) {
    try {
        const sectionId = Number(req.params.sectionId);
        const deleteRes = await db.pool.query(`DELETE FROM page_content_sections WHERE id = $1 RETURNING *`, [sectionId]);

        if (deleteRes.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Content section not found' });
        }

        emitNavigationChange({ action: 'delete', type: 'content_section', deletedId: sectionId });

        res.status(200).json({
            success: true,
            message: 'Content section deleted successfully',
            deletedId: sectionId
        });
    } catch (err) {
        console.error('Error deleting content section:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    }
}

module.exports = {
    getPageBySlug,
    updatePageSettings,
    createSubEvent,
    reorderSubEvents,
    updateSubEvent,
    deleteSubEvent,
    getEventDetailBySlug,
    createContentSection,
    reorderContentSections,
    updateContentSection,
    deleteContentSection
};
