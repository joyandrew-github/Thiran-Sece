const { Server } = require('socket.io');

let io = null;

/**
 * Initializes Socket.IO server attached to HTTP server.
 */
function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: ['http://localhost:5173', 'http://localhost:5174'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`⚡ Socket client connected: ${socket.id}`);

        socket.on('disconnect', (reason) => {
            console.log(`🔌 Socket client disconnected: ${socket.id} (${reason})`);
        });
    });

    return io;
}

/**
 * Gets the active Socket.IO server instance.
 */
function getIO() {
    if (!io) {
        throw new Error('Socket.io has not been initialized!');
    }
    return io;
}

/**
 * Helper to safely emit real-time events to all connected clients.
 */
function emitNavigationChange(payload) {
    if (io) {
        console.log(`📡 Emitting real-time socket event "navigation:changed":`, payload);
        io.emit('navigation:changed', payload);
    }
}

module.exports = {
    initSocket,
    getIO,
    emitNavigationChange
};
