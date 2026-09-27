const db = require('./db');

/**
 * Initializes database schema and default seed data for Navigation, Pages, Events, and Content Sections.
 */
async function initNavigationTables() {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Create navigation_items table
        await client.query(`
            CREATE TABLE IF NOT EXISTS navigation_items (
                id SERIAL PRIMARY KEY,
                parent_id INT REFERENCES navigation_items(id) ON DELETE CASCADE,
                label VARCHAR(100) NOT NULL,
                slug VARCHAR(255) NOT NULL,
                icon_name VARCHAR(50) DEFAULT NULL,
                display_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                is_home BOOLEAN DEFAULT false,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_nav_parent_order ON navigation_items (parent_id, display_order);
        `);

        // 2. Create page_settings table
        await client.query(`
            CREATE TABLE IF NOT EXISTS page_settings (
                id SERIAL PRIMARY KEY,
                nav_item_id INT REFERENCES navigation_items(id) ON DELETE CASCADE UNIQUE,
                title VARCHAR(255) NOT NULL,
                subtitle TEXT,
                description TEXT,
                hero_image VARCHAR(500),
                badge_label VARCHAR(100) DEFAULT 'THIRAN EVENT SECTION',
                icon_name VARCHAR(50) DEFAULT 'Terminal',
                status BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 3. Create events table (Sub-events for any page section)
        await client.query(`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                nav_item_id INT REFERENCES navigation_items(id) ON DELETE CASCADE,
                event_name VARCHAR(255) NOT NULL,
                navigation_label VARCHAR(100),
                slug VARCHAR(255) NOT NULL,
                short_description TEXT,
                full_description TEXT,
                event_image VARCHAR(500),
                banner_image VARCHAR(500),
                event_date VARCHAR(100),
                start_time VARCHAR(50),
                end_time VARCHAR(50),
                venue VARCHAR(255),
                registration_enabled BOOLEAN DEFAULT true,
                registration_url VARCHAR(500),
                registration_deadline VARCHAR(100),
                max_participants INT DEFAULT 0,
                event_status VARCHAR(50) DEFAULT 'Upcoming',
                display_order INT DEFAULT 0,
                show_in_dropdown BOOLEAN DEFAULT true,
                is_published BOOLEAN DEFAULT true,
                rules TEXT,
                prizes TEXT,
                organized_by VARCHAR(255),
                faculty_coordinator_name VARCHAR(255),
                faculty_coordinator_phone VARCHAR(50),
                student_coordinator_name VARCHAR(255),
                student_coordinator_phone VARCHAR(50),
                tags TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Migration safety for existing tables
        await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS organized_by VARCHAR(255);`);
        await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS faculty_coordinator_name VARCHAR(255);`);
        await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS faculty_coordinator_phone VARCHAR(50);`);
        await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS student_coordinator_name VARCHAR(255);`);
        await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS student_coordinator_phone VARCHAR(50);`);
        await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS tags TEXT;`);

        // 4. Create page_content_sections table
        await client.query(`
            CREATE TABLE IF NOT EXISTS page_content_sections (
                id SERIAL PRIMARY KEY,
                nav_item_id INT REFERENCES navigation_items(id) ON DELETE CASCADE,
                section_type VARCHAR(50) DEFAULT 'custom',
                title VARCHAR(255) NOT NULL,
                subtitle TEXT,
                content TEXT,
                media_url VARCHAR(500),
                display_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Seed initial defaults if navigation_items is empty
        const checkRes = await client.query('SELECT COUNT(*) FROM navigation_items');
        const count = parseInt(checkRes.rows[0].count, 10);

        if (count === 0) {
            console.log('🌱 Seeding initial Thiran navigation items, pages, sub-events & content sections into PostgreSQL...');

            // Top level items
            const topItems = [
                { label: 'Home', slug: '/', is_home: true, order: 1, icon: 'Home' },
                { label: 'Hackathons', slug: '/hackathons', is_home: false, order: 2, icon: 'Terminal' },
                { label: 'Tech Fest', slug: '/tech-fest', is_home: false, order: 3, icon: 'Cpu' },
                { label: 'Spotlight Events', slug: '/spotlight-events', is_home: false, order: 4, icon: 'Sparkles' },
                { label: 'Events', slug: '/events', is_home: false, order: 5, icon: 'Calendar' },
                { label: 'Cultural Contests', slug: '/cultural-contests', is_home: false, order: 6, icon: 'Music' },
                { label: 'Guest Lounge', slug: '/guest-lounge', is_home: false, order: 7, icon: 'UserCheck' },
                { label: 'Celebrity Shows', slug: '/celebrity-shows', is_home: false, order: 8, icon: 'Crown' }
            ];

            const insertedParents = {};

            for (const item of topItems) {
                const insertRes = await client.query(
                    `INSERT INTO navigation_items (label, slug, is_home, display_order, icon_name)
                     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                    [item.label, item.slug, item.is_home, item.order, item.icon]
                );
                insertedParents[item.label] = insertRes.rows[0].id;
            }

            // Seed Hackathons Page Settings
            const hackathonId = insertedParents['Hackathons'];
            if (hackathonId) {
                await client.query(
                    `INSERT INTO page_settings (nav_item_id, title, subtitle, description, badge_label, icon_name)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        hackathonId,
                        'HACKATHONS',
                        'Multi-track coding hackathons & build fests',
                        'Join thousands of developers, designers, and innovators in high-stakes 24-hour and track-based coding challenges. Build real-world AI, Web3, and Cyber security applications with mentorship from industry leaders.',
                        'THIRAN EVENT SECTION',
                        'Terminal'
                    ]
                );

                // Seed Sub-events for Hackathons with full coordinator details & tags matching design mockups
                const hackathonSubEvents = [
                    {
                        name: 'Codeathon',
                        slug: '/hackathons/24-hours',
                        short_desc: 'Building Sustainable automation solutions for a better planet!',
                        full_desc:
                            'A 24 Hours Hackathon. Evolve with AI. Hack. Build. Elevate. Building Sustainable automation solutions for a better planet at Sri Eshwar Campus.',
                        img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
                        date: '04, 05 February, 2026',
                        start: '11.00 am',
                        end: '11.00 am',
                        venue: 'Sri Eshwar Campus, Coimbatore',
                        org: 'CCE',
                        fName: 'Ms. R. Megala',
                        fPhone: '99526 15687',
                        sName: 'Mr. Prassanna Murthy',
                        sPhone: '94428 23677',
                        tags: '4 FEB, 5 FEB, CCE, CSE, HACKATHONS',
                        order: 1
                    },
                    {
                        name: 'CTF Quest',
                        slug: '/hackathons/cyber-hackathon',
                        short_desc: 'Decode, Hack, Innovate! Capture The Flag Cybersecurity Challenge.',
                        full_desc:
                            'Jeopardy-style CTF challenge covering web exploitation, cryptography, reverse engineering, and digital forensics.',
                        img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
                        date: '04 February, 2026',
                        start: '09.30 am',
                        end: '05.00 pm',
                        venue: 'Sri Eshwar Campus',
                        org: 'Cyber Security Club',
                        fName: 'Dr. K. Sujatha',
                        fPhone: '98765 43210',
                        sName: 'Aravind R',
                        sPhone: '91234 56789',
                        tags: '4 FEB, CCE, CSE, CYBER, IT',
                        order: 2
                    },
                    {
                        name: 'AI-Agentathon',
                        slug: '/hackathons/ai-hackathon',
                        short_desc: 'Code the Agents that change the world.',
                        full_desc: 'Autonomous AI Agent buildathon. Build next-gen autonomous LLM agents, vision models, and intelligent workflows.',
                        img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
                        date: '04 February, 2026',
                        start: '09.30 am',
                        end: '05.00 pm',
                        venue: 'AI Research Hub',
                        org: 'AI-DS',
                        fName: 'Dr. G. Shobana',
                        fPhone: '94432 10987',
                        sName: 'Santhosh Kumar',
                        sPhone: '98941 23456',
                        tags: '4 FEB, AI-DS, AI-ML, CSE, HACKATHONS',
                        order: 3
                    }
                ];

                for (const sub of hackathonSubEvents) {
                    await client.query(
                        `INSERT INTO events (
                            nav_item_id, event_name, navigation_label, slug, short_description, full_description,
                            event_image, banner_image, event_date, start_time, end_time, venue,
                            organized_by, faculty_coordinator_name, faculty_coordinator_phone,
                            student_coordinator_name, student_coordinator_phone, tags, display_order
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
                        [
                            hackathonId,
                            sub.name,
                            sub.name,
                            sub.slug,
                            sub.short_desc,
                            sub.full_desc,
                            sub.img,
                            sub.img,
                            sub.date,
                            sub.start,
                            sub.end,
                            sub.venue,
                            sub.org,
                            sub.fName,
                            sub.fPhone,
                            sub.sName,
                            sub.sPhone,
                            sub.tags,
                            sub.order
                        ]
                    );

                    await client.query(
                        `INSERT INTO navigation_items (parent_id, label, slug, display_order)
                         VALUES ($1, $2, $3, $4)`,
                        [hackathonId, sub.name, sub.slug, sub.order]
                    );
                }
            }

            console.log('✅ Full Page, Sub-Events & Content Sections database seeding complete!');
        }

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Failed to initialize navigation & page database schema:', err.message);
        throw err;
    } finally {
        client.release();
    }
}

module.exports = {
    initNavigationTables
};
