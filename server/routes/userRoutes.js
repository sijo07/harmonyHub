const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Playlist = require('../models/Playlist');
const { protect } = require('../middleware/authMiddleware');
const Song = require('../models/Song');

// @desc    Add song to favorites
// @route   POST /api/users/favorites/add
// @access  Private
router.post('/favorites/add', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { song } = req.body;

        // Persist song to the general songs collection if it doesn't exist
        let existingSong = await Song.findOne({ id: song.id });
        if (!existingSong) {
            existingSong = await Song.create({
                id: song.id,
                title: song.title || song.name,
                artist: song.artist || (song.artists && song.artists.primary && song.artists.primary[0].name),
                album: song.album || (song.album && song.album.name),
                image: song.coverUrl || song.image,
                duration: song.duration,
                audioUrl: song.audioUrl || song.previewUrl
            });
        }

        if (!user.likedSongs.find(s => s.id === song.id)) {
            user.likedSongs.push({
                id: existingSong.id,
                title: existingSong.title,
                artist: existingSong.artist,
                album: existingSong.album,
                image: existingSong.image,
                duration: existingSong.duration,
                audioUrl: existingSong.audioUrl
            });
            await user.save();
        }
        res.status(200).json(user.likedSongs);
    } catch (error) {
        console.error("Add Favorite Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Remove song from favorites
// @route   POST /api/users/favorites/remove
// @access  Private
router.post('/favorites/remove', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { songId } = req.body;

        user.likedSongs = user.likedSongs.filter(s => s.id !== songId);
        await user.save();

        res.status(200).json(user.likedSongs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get favorites
// @route   GET /api/users/favorites
// @access  Private
router.get('/favorites', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user.likedSongs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create Playlist
// @route   POST /api/users/playlists
// @access  Private
router.post('/playlists', protect, async (req, res) => {
    try {
        const { name, description, isPublic } = req.body;
        const playlist = await Playlist.create({
            name,
            description,
            isPublic,
            user: req.user.id,
            songs: []
        });

        // Add to user's playlists
        const user = await User.findById(req.user.id);
        user.playlists.push(playlist._id);
        await user.save();

        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get My Playlists
// @route   GET /api/users/playlists
// @access  Private
router.get('/playlists', protect, async (req, res) => {
    try {
        const playlists = await Playlist.find({ user: req.user.id });
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
