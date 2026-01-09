const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const musicRoutes = require('./routes/musicRoutes');

dotenv.config();

const app = express();

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        next(err);
    }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/music', musicRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));


app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/db-check', (req, res) => {
    const mongoose = require('mongoose');
    res.json({
        database: mongoose.connection.name || 'not_connected',
        connected: mongoose.connection.readyState === 1,
        readyState: mongoose.connection.readyState,
        env: process.env.NODE_ENV,
        hasUri: !!process.env.MONGO_URI,
        host: mongoose.connection.host
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.stack);
    res.status(500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
