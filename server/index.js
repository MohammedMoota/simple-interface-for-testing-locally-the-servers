const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'FYP Secure Backend is running',
        timestamp: new Date().toISOString()
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start Server
const startServer = async () => {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
        console.error('⚠️  Warning: Database connection failed. Please check your MySQL configuration.');
        console.log('📋 Make sure to run the schema.sql file in MySQL first.');
    }

    app.listen(PORT, () => {
        console.log('=========================================');
        console.log('🚀 FYP Secure Backend Server');
        console.log('=========================================');
        console.log(`📡 Server running on: http://localhost:${PORT}`);
        console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
        console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
        console.log('=========================================');
    });
};

startServer();
