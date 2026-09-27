const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const navigationRoutes = require('./src/routes/navigationRoutes');
const pagesRoutes = require('./src/routes/pagesRoutes');

// API Routes
app.use('/api/navigation', navigationRoutes);
app.use('/api/pages', pagesRoutes);

// Root Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Thiran API is running 🚀'
    });
});

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy'
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = app;
