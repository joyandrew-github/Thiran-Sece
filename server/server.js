const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const http = require('http');
const app = require('./app');
const { testConnection } = require('./src/config/db');
const { initNavigationTables } = require('./src/config/initDb');
const { initSocket } = require('./src/config/socket');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO server
initSocket(server);

server.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);

    const dbStatus = await testConnection();
    if (dbStatus.success) {
        console.log(`✅ Node.js successfully connected to PostgreSQL database: ${dbStatus.database} on ${dbStatus.host}:${dbStatus.port}`);
        try {
            await initNavigationTables();
        } catch (err) {
            console.error(`⚠️ Could not auto-initialize navigation table: ${err.message}`);
        }
    } else {
        console.error(`❌ Database connection failed: ${dbStatus.error}`);
    }
});
