const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Playlist = require('../models/Playlist'); // Assuming this exists based on usage in userRoutes
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const playlistCount = await Playlist.countDocuments();

        // Mocking song count as we don't store all songs in DB, only liked/playlists
        // Or we could sum up liked songs?
        // Let's just return what we have in DB
        const totalLikedSongs = await User.aggregate([
            { $project: { count: { $size: "$likedSongs" } } },
            { $group: { _id: null, total: { $sum: "$count" } } }
        ]);

        res.json({
            users: userCount,
            playlists: playlistCount,
            totalLikedSongs: totalLikedSongs[0]?.total || 0,
            activeUsers: Math.floor(userCount * 0.7) // Mock active users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
