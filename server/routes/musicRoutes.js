const express = require('express');
const router = express.Router();
const musicService = require('../services/musicService');

const { protect } = require('../middleware/authMiddleware');
const Playlist = require('../models/Playlist');
const User = require('../models/User');

router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }
        const results = await musicService.searchSongs(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message, details: error.response?.data });
    }
});

// Create Playlist (Local)
router.post('/playlists', protect, async (req, res) => {
    try {
        const { name, description, coverUrl, isPublic } = req.body;

        const playlist = await Playlist.create({
            name,
            description,
            coverUrl,
            isPublic,
            user: req.user._id,
            songs: []
        });

        // Add to user's playlists
        await User.findByIdAndUpdate(req.user._id, {
            $push: { playlists: playlist._id }
        });

        res.status(201).json(playlist);
    } catch (error) {
        console.error("Create Playlist Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add Song to Playlist
router.post('/playlists/:id/songs', protect, async (req, res) => {
    try {
        const { id } = req.params;
        const songData = req.body;

        const playlist = await Playlist.findById(id);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Check ownership
        if (playlist.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Persist song to the general songs collection if it doesn't exist
        let existingSong = await Song.findOne({ id: songData.id });
        if (!existingSong) {
            existingSong = await Song.create({
                id: songData.id,
                title: songData.title || songData.name,
                artist: songData.artist || (songData.artists && songData.artists.primary && songData.artists.primary[0].name),
                album: songData.album || (songData.album && songData.album.name),
                image: songData.coverUrl || songData.image,
                duration: songData.duration,
                audioUrl: songData.audioUrl || songData.previewUrl
            });
        }

        // Check if song already exists in playlist
        const songExists = playlist.songs.find(s => s.toString() === existingSong._id.toString());
        if (songExists) {
            return res.status(400).json({ message: 'Song already in playlist' });
        }

        playlist.songs.push(existingSong._id);
        await playlist.save();

        res.json(playlist);
    } catch (error) {
        console.error("Add to Playlist Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Edit Playlist
router.put('/playlists/:id', protect, async (req, res) => {
    try {
        const { name, description, coverUrl, isPublic } = req.body;
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        if (playlist.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        playlist.name = name || playlist.name;
        playlist.description = description || playlist.description;
        playlist.coverUrl = coverUrl || playlist.coverUrl;
        playlist.isPublic = isPublic !== undefined ? isPublic : playlist.isPublic;

        await playlist.save();
        res.json(playlist);
    } catch (error) {
        console.error("Edit Playlist Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete Playlist
router.delete('/playlists/:id', protect, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        if (playlist.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await playlist.deleteOne();

        // Remove from user's playlists
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { playlists: playlist._id }
        });

        res.json({ message: 'Playlist removed' });
    } catch (error) {
        console.error("Delete Playlist Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Remove Song from Playlist
router.delete('/playlists/:id/songs/:songId', protect, async (req, res) => {
    try {
        const { id, songId } = req.params;
        const playlist = await Playlist.findById(id);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        if (playlist.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Find the song to get its internal _id
        const song = await Song.findOne({ id: songId });
        if (song) {
            playlist.songs = playlist.songs.filter(s => s.toString() !== song._id.toString());
            await playlist.save();
        }

        res.json(playlist);
    } catch (error) {
        console.error("Remove Song from Playlist Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/songs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const song = await musicService.getSongDetails(id);
        res.json(song);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/albums/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const album = await musicService.getAlbumDetails(id);
        res.json(album);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/playlists/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if it's a local Mongo ID (length 24 hex)
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const localPlaylist = await Playlist.findById(id).populate('user', 'name').populate('songs');
            if (localPlaylist) {
                return res.json(localPlaylist);
            }
        }

        // Fallback to External API
        const playlist = await musicService.getPlaylistDetails(id);
        res.json(playlist);
    } catch (error) {
        console.error("Get Playlist Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/artists/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const artist = await musicService.getArtistDetails(id);
        res.json(artist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/songs/:id/lyrics', async (req, res) => {
    try {
        const { id } = req.params;
        const lyrics = await musicService.getLyrics(id);
        res.json(lyrics);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/radio', async (req, res) => {
    try {
        const result = await musicService.getRadioStations();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/live-radio', async (req, res) => {
    try {
        const { limit, tag } = req.query;
        const result = await musicService.getLiveRadioStations(limit, tag);
        res.json({ data: result });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/new-releases', async (req, res) => {
    try {
        const result = await musicService.getNewReleases();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
