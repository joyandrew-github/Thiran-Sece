const { Pool } = require('pg');

/**
 * Creates a pg.Pool instance using process.env configuration.
 * @param {string} dbName Database name to connect to.
 */
function createPool(dbName) {
    return new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        database: dbName,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD
    });
}

let activePool = createPool((process.env.DB_NAME || 'thiran_db').trim());

/**
 * Tests the PostgreSQL database connection using SELECT NOW()
 */
async function testConnection() {
    try {
        let client;
        try {
            client = await activePool.connect();
        } catch (err) {
            if (err.message && err.message.includes('does not exist')) {
                try {
                    // Try fallback with leading space
                    const spacePrefixedName = ' ' + (process.env.DB_NAME || 'thiran_db').trim();
                    const fallbackPool = createPool(spacePrefixedName);
                    client = await fallbackPool.connect();
                    activePool = fallbackPool;
                } catch (spaceErr) {
                    // If still missing, connect to default 'postgres' database and create 'thiran_db'
                    console.log(`📦 Database "${process.env.DB_NAME || 'thiran_db'}" does not exist. Creating automatically...`);
                    const adminPool = createPool('postgres');
                    const adminClient = await adminPool.connect();
                    const targetDb = (process.env.DB_NAME || 'thiran_db').trim();
                    await adminClient.query(`CREATE DATABASE "${targetDb}"`);
                    adminClient.release();
                    await adminPool.end();

                    activePool = createPool(targetDb);
                    client = await activePool.connect();
                }
            } else {
                throw err;
            }
        }

        const res = await client.query('SELECT NOW()');
        client.release();

        return {
            success: true,
            timestamp: res.rows[0].now,
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '5432',
            database: activePool.options.database.trim()
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '5432',
            database: process.env.DB_NAME || 'thiran_db'
        };
    }
}

module.exports = {
    get pool() {
        return activePool;
    },
    testConnection
};
