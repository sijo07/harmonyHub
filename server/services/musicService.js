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
const getRadioStations = async () => {
    try {
        const response = await axios.get(`${SAAVN_API_URL}/modules`, {
            params: { language: 'english,hindi,malayalam,tamil' }
        });

        if (response.data && response.data.status === 'SUCCESS') {
            const data = response.data.data;
            const charts = data.charts ? data.charts.map(item => ({
                id: item.id,
                title: item.title,
                subtitle: item.subtitle,
                type: item.type,
                image: item.image,
                url: item.url,
                explicit: item.explicit
            })) : [];

            const radio = data.radio ? data.radio.map(item => ({
                id: item.id,
                title: item.title,
                subtitle: item.subtitle,
                type: item.type,
                image: item.image,
                url: item.url,
                explicit: item.explicit
            })) : [];

            return { data: { charts, radio } };
        }
        return { data: { charts: [], radio: [] } };
    } catch (error) {
        console.error('Error getting radio stations:', error.message);
        return { data: { charts: [], radio: [] } };
    }
};

const getLiveRadioStations = async (limit = 20, tag = '') => {
    try {
        let url = 'https://de1.api.radio-browser.info/json/stations/topclick/' + limit;
        if (tag) {
            url = `https://de1.api.radio-browser.info/json/stations/bytag/${tag}?limit=${limit}`;
        }

        const response = await axios.get(url);

        if (Array.isArray(response.data)) {
            return response.data.map(station => ({
                id: station.stationuuid,
                name: station.name,
                subtitle: station.country || 'Global',
                type: 'radio_station',
                image: station.favicon || '',
                url: station.url_resolved || station.url,
                explicit: false,
                country: station.country,
                tags: station.tags
            }));
        }
        return [];
    } catch (error) {
        console.error('Error getting live radio:', error.message);
        return [];
    }
};

const getNewReleases = async () => {
    try {
        const searchUrl = 'https://saavn.sumit.co/api/search/songs';
        console.log(`[DEBUG] Fetching new releases via search from ${searchUrl}`);

        // Parallel fetch for broader coverage
        const [res2024, res2025] = await Promise.all([
            axios.get(searchUrl, { params: { query: '2024', limit: 20 } }),
            axios.get(searchUrl, { params: { query: '2025', limit: 20 } })
        ]);

        const mapSearchResults = (res) => {
            const data = res.data.data || res.data;
            const results = data.results || data;
            return Array.isArray(results) ? results : [];
        };

        const songs2024 = mapSearchResults(res2024);
        const songs2025 = mapSearchResults(res2025);

        // Combine and dedup by ID
        const allSongs = [...songs2025, ...songs2024];
        const uniqueSongs = Array.from(new Map(allSongs.map(item => [item.id, item])).values());

        // Map to standard format
        const newTrending = uniqueSongs.map(item => ({
            id: item.id,
            title: item.name || item.title,
            subtitle: item.subtitle || item.primaryArtists || item.artist || (item.artists ? item.artists.map(a => a.name).join(', ') : 'Unknown'),
            type: 'song',
            image: (item.image && item.image.length > 0) ? (Array.isArray(item.image) ? item.image[item.image.length - 1].link : item.image) : '',
            url: (item.downloadUrl && item.downloadUrl.length > 0) ? (Array.isArray(item.downloadUrl) ? item.downloadUrl[item.downloadUrl.length - 1].link : item.downloadUrl) : '',
            year: item.year
        })).slice(0, 20);

        // Fetch Albums (search for '2024')
        let newAlbums = [];
        try {
            const albumRes = await axios.get('https://saavn.sumit.co/api/search/albums', { params: { query: '2024', limit: 10 } });
            const albumData = albumRes.data.data || albumRes.data;
            const albumResults = albumData.results || albumData;
            if (Array.isArray(albumResults)) {
                newAlbums = albumResults.map(item => ({
                    id: item.id,
                    title: item.name || item.title,
                    subtitle: item.subtitle || item.primaryArtists || 'Various',
                    type: 'album',
                    image: (item.image && item.image.length > 0) ? (Array.isArray(item.image) ? item.image[item.image.length - 1].link : item.image) : '',
                    url: item.url
                }));
            }
        } catch (e) { console.log("Album fetch failed", e.message); }

        return { data: { newTrending, newAlbums, topPlaylists: [] } };

    } catch (error) {
        console.error('Error getting new releases:', error.message);
        console.error(error.stack);
        return { data: { newTrending: [], newAlbums: [], topPlaylists: [] } };
    }
};

module.exports = {
    searchSongs,
    getSongDetails,
    getAlbumDetails,
    getPlaylistDetails,
    getArtistDetails,
    getLyrics,
    getRadioStations,
    getLiveRadioStations,
    getNewReleases
};
