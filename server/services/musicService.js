const axios = require('axios');

// Using Saavn API for Full Songs
const SAAVN_API_URL = 'https://saavn.me';

const transformSaavnTrack = (track) => {
    // Determine the highest quality download link
    const sortedDownloads = track.downloadUrl ? track.downloadUrl.sort((a, b) => {
        // rough sort logic: 320kbps > 160kbps > 96kbps
        const getVal = (s) => {
            if (typeof s.quality === 'string') {
                return parseInt(s.quality.replace('kbps', '')) || 0;
            }
            return 0;
        };
        return getVal(b) - getVal(a);
    }) : [];

    const bestAudio = sortedDownloads.length > 0 ? sortedDownloads[0].link : null;

    // Get highest quality image
    const sortedImages = track.image ? track.image.sort((a, b) => {
        const getVal = (s) => {
            if (typeof s.quality === 'string') {
                return parseInt(s.quality.replace('x', '')) || 0;
            }
            return 0;
        };
        return getVal(b) - getVal(a);
    }) : [];

    // Ensure we have an array for images
    const images = track.image || [];

    return {
        id: track.id,
        name: track.name,
        type: track.type || "song",
        album: {
            id: track.album?.id,
            name: track.album?.name,
            url: track.album?.url
        },
        year: track.year,
        duration: track.duration,
        label: track.label,
        artists: {
            primary: Array.isArray(track.primaryArtists) ? track.primaryArtists : (track.primaryArtists ? [{ name: track.primaryArtists }] : []),
            featured: Array.isArray(track.featuredArtists) ? track.featuredArtists : [],
            all: Array.isArray(track.artists) ? track.artists : []
        },
        image: images,
        downloadUrl: track.downloadUrl || [],
        // Helpers for frontend
        primaryArtists: typeof track.primaryArtists === 'string' ? track.primaryArtists : track.primaryArtists?.[0]?.name,
        language: track.language,
        previewUrl: bestAudio, // Full Audio
        audioUrl: bestAudio    // Legacy support
    };
};

const searchSongs = async (query) => {
    try {
        const response = await axios.get(`${SAAVN_API_URL}/search/songs`, {
            params: { query, page: 1, limit: 20 }
        });

        if (response.data && response.data.status === 'SUCCESS') {
            const results = response.data.data.results.map(transformSaavnTrack);
            return { data: { results } };
        }
        return { data: { results: [] } };

    } catch (error) {
        console.error('Error searching songs (Saavn):', error.message);
        return { data: { results: [] } };
    }
};

const getSongDetails = async (id) => {
    try {
        const response = await axios.get(`${SAAVN_API_URL}/songs`, {
            params: { id }
        });

        if (response.data && response.data.status === 'SUCCESS') {
            const rawData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
            const results = rawData.map(transformSaavnTrack);
            return { data: results };
        }
        return { data: [] };
    } catch (error) {
        console.error('Error getting song details:', error.message);
        return { data: [] };
    }
};

const getAlbumDetails = async (id) => {
    try {
        const response = await axios.get(`${SAAVN_API_URL}/albums`, {
            params: { id }
        });

        if (response.data && response.data.status === 'SUCCESS') {
            const data = response.data.data;
            const songs = data.songs ? data.songs.map(transformSaavnTrack) : [];
            return {
                data: {
                    ...data,
                    songs
                }
            };
        }
        return { data: {} };
    } catch (error) {
        console.error('Error getting album details:', error.message);
        return { data: {} };
    }
};

const getPlaylistDetails = async (id) => {
    try {
        const response = await axios.get(`${SAAVN_API_URL}/playlists`, {
            params: { id }
        });

        if (response.data && response.data.status === 'SUCCESS') {
            const data = response.data.data;
            const songs = data.songs ? data.songs.map(transformSaavnTrack) : [];
            return {
                data: {
                    ...data,
                    songs
                }
            };
        }
        return { data: {} };
    } catch (error) {
        console.error('Error getting playlist:', error.message);
        return { data: {} };
    }
};

const getArtistDetails = async (id) => {
    try {
        const response = await axios.get(`${SAAVN_API_URL}/artists`, {
            params: { id, page: 1, limit: 20 }
        });

        if (response.data && response.data.status === 'SUCCESS') {
            const data = response.data.data;
            const topSongs = data.topSongs ? data.topSongs.map(transformSaavnTrack) : [];
            return {
                data: {
                    ...data,
                    topSongs,
                    songs: topSongs
                }
            };
        }
        return { data: {} };
    } catch (error) {
        console.error('Error getting artist details:', error.message);
        return { data: {} };
    }
};

const getLyrics = async (id) => {
    try {
        const response = await axios.get(`${SAAVN_API_URL}/lyrics`, {
            params: { id }
        });
        if (response.data && response.data.status === 'SUCCESS') {
            return response.data.data; // { lyrics: "..." }
        }
        return { lyrics: "Lyrics not available." };
    } catch (error) {
        return { lyrics: "Lyrics not available." };
    }
};

module.exports = {
    searchSongs,
    getSongDetails,
    getAlbumDetails,
    getPlaylistDetails,
    getArtistDetails,
    getLyrics
};
