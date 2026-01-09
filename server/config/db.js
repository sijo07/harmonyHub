const mongoose = require('mongoose');

let cachedConn = null;

const connectDB = async () => {
    if (cachedConn) {
        return cachedConn;
    }

    if (!process.env.MONGO_URI) {
        console.error('CRITICAL: MONGO_URI is not defined!');
        return null;
    }

    try {
        console.log('Establishing new MongoDB connection...');
        cachedConn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'musicHub', // Explicitly force the database name
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`MongoDB Connected: ${cachedConn.connection.host}`);
        return cachedConn;
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        cachedConn = null;
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
        return null;
    }
};

module.exports = connectDB;
