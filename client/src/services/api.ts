// External API for Music
const SAAVN_API_URL = 'https://saavn.sumit.co/api';
// Internal Backend API for Auth & User Data
const BACKEND_URL = '/api';

export interface Song {
    id: string;
    name: string;
    type: string;
    album: {
        id?: string;
        name: string;
        url: string;
    };
    year: string;
    duration: string;
    label?: string;
    artists: {
        primary: {
            id: string;
            name: string;
            role: string;
            image: {
                quality?: string;
                link: string;
            }[];
            type: string;
            url: string;
        }[];
        featured?: any[];
        all?: any[];
    };
    image: {
        quality?: string;
        link: string;
    }[];
    downloadUrl: {
        quality?: string;
        link: string;
    }[];
    // Transformed fields
    title: string;
    artist: any;
    coverUrl: string;
    previewUrl: string;
}

// Keeping interfaces for compatibility where possible, but the API response structure is different now.
// We will primarily rely on the transformed structure for the frontend.



export const convertImage = (images: { quality?: string, link?: string, url?: string }[]) => {
    if (!images || images.length === 0) return '';
    const lastImage = images[images.length - 1];
    return lastImage.url || lastImage.link || '';
}

const decodeEntities = (str: string) => {
    if (!str) return "";
    return str.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

const transformSaavnData = (results: any[]) => {
    if (!results || !Array.isArray(results)) return [];

    return results.map(item => {
        // Get highest quality image
        // Saavn API sometimes returns 'url' instead of 'link'
        const image = item.image && item.image.length > 0
            ? (item.image[item.image.length - 1].url || item.image[item.image.length - 1].link)
            : '/img/bg-img/a1.jpg';

        // Get highest quality audio stream
        // External API usually returns 'downloadUrl' array with 'url' or 'link'.
        const downloadUrlArr = item.downloadUrl || [];
        const downloadUrlObj = downloadUrlArr.length > 0 ? downloadUrlArr[downloadUrlArr.length - 1] : null;
        const downloadUrl = downloadUrlObj ? (downloadUrlObj.url || downloadUrlObj.link) : null;

        const decodedName = decodeEntities(item.name);
        const decodedAlbum = decodeEntities(item.album?.name);

        return {
            id: item.id,
            name: decodedName,
            type: item.type,
            album: { name: decodedAlbum, url: item.album?.url },
            year: item.year,
            duration: item.duration,
            label: item.label,
            artists: {
                primary: Array.isArray(item.primaryArtists) ? item.primaryArtists : [{ name: item.primaryArtists }],
                featured: item.featuredArtists || [],
                all: item.artists || []
            },
            image: item.image || [{ link: image }],
            downloadUrl: item.downloadUrl || [{ link: downloadUrl }],

            // Unified fields
            title: decodedName,
            artist: item.primaryArtists || item.artist || (Array.isArray(item.primaryArtists) ? item.primaryArtists[0]?.name : "Unknown"),
            coverUrl: image,
            previewUrl: downloadUrl // Full audio URL
        };
    }).filter(track => track.previewUrl);
};

export const musicApi = {
    search: async (term: string) => {
        try {
            // Use /search/songs for direct song results
            const response = await fetch(`${SAAVN_API_URL}/search/songs?query=${encodeURIComponent(term)}`);
            const data = await response.json();
            // Expected format: { success: true, data: { results: [...] } }
            const results = data.data?.results || [];
            return transformSaavnData(results);
        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    },

    getEnglishHits: async () => {
        return await musicApi.search('English Top 50');
    },

    getMalayalamHits: async () => {
        return await musicApi.search('Latest Malayalam Hits');
    },

    getTamilHits: async () => {
        return await musicApi.search('Top Tamil Songs');
    },

    getHindiHits: async () => {
        return await musicApi.search('Bollywood Top Hits');
    },

    getSongDetails: async (id: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/music/songs/${id}`);
            const data = await response.json();
            // transform expects array
            return { data: data.data ? data.data[0] : data.data };
        } catch (error) {
            console.error('Get Song Details Error:', error);
            return null;
        }
    },

    getAlbumDetails: async (id: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/music/albums/${id}`);
            return await response.json();
        } catch (e) { console.error(e); return null; }
    },

    getPlaylistDetails: async (id: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/music/playlists/${id}`);
            return await response.json();
        } catch (e) { console.error(e); return null; }
    },

    getArtistDetails: async (id: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/music/artists/${id}`);
            return await response.json();
        } catch (e) { console.error(e); return null; }
    },

    getLyrics: async (id: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/music/songs/${id}/lyrics`);
            return await response.json();
        } catch (e) { console.error(e); return null; }
    },

    getArtistData: async (query: string) => {
        try {
            const response = await fetch(`${SAAVN_API_URL}/search/artists?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            const results = data.data?.results || [];
            if (results.length > 0) {
                const item = results[0];
                const image = item.image && item.image.length > 0
                    ? (item.image[item.image.length - 1].url || item.image[item.image.length - 1].link)
                    : '/img/bg-img/a1.jpg';
                return { ...item, image: [{ link: image }] };
            }
            return null;
        } catch (error) {
            console.error('Artist Search Error:', error);
            return null;
        }
    },

    getFeaturedArtists: async () => {
        try {
            // Fetch a few popular artists to show
            const artists = ['Arijit Singh', 'Taylor Swift', 'Anirudh Ravichander', 'The Weeknd'];
            const promises = artists.map(name => musicApi.getArtistData(name));
            const results = await Promise.all(promises);
            return results.filter(Boolean);
        } catch (error) {
            console.error('Featured Artists Error:', error);
            return [];
        }
    },
    getRadioStations: async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/music/radio`);
            return await response.json();
        } catch (e) {
            console.error(e);
            return { data: { charts: [], radio: [] } };
        }
    },
    getLiveStations: async (limit = 20, tag = '') => {
        try {
            const response = await fetch(`${BACKEND_URL}/music/live-radio?limit=${limit}&tag=${tag}`);
            return await response.json();
        } catch (e) {
            console.error(e);
            return { data: [] };
        }
    },
    getNewReleases: async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/music/new-releases`);
            return await response.json();
        } catch (e) {
            console.error(e);
            return { data: { newTrending: [], newAlbums: [], topPlaylists: [] } };
        }
    }
};

// Exporting existing api object structure for compatibility with existing code until fully refactored
export const api = {
    setToken: (token: string) => {
        localStorage.setItem('token', token);
    },

    auth: {
        login: async (email, password) => {
            const response = await fetch(`${BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) throw new Error('Login failed');
            return response.json();
        },
        register: async (name, email, password) => {
            const response = await fetch(`${BACKEND_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            if (!response.ok) throw new Error('Registration failed');
            return response.json();
        },
        getMe: async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch user');
            return response.json();
        },
        updateProfile: async (data: { name?: string; email?: string; password?: string }) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/auth/updatedetails`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update profile');
            return response.json();
        }
    },

    admin: {
        getStats: async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/admin/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch stats');
            return response.json();
        },
        getUsers: async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            return response.json();
        }
    },

    searchSongs: async (query: string) => {
        // Adapt new return style to old style somewhat or just use new style
        // Old style: returns { data: { results: [...] } }
        const results = await musicApi.search(query);
        return { data: { results } };
    },
    // Wrappers for compatibility
    getSongDetails: async (id: string) => musicApi.getSongDetails(id),
    getAlbumDetails: async (id: string) => musicApi.getAlbumDetails(id),
    getPlaylistDetails: async (id: string) => musicApi.getPlaylistDetails(id),
    getArtistDetails: async (id: string) => musicApi.getArtistDetails(id),
    getLyrics: async (id: string) => musicApi.getLyrics(id),
    getEnglishHits: musicApi.getEnglishHits,
    getMalayalamHits: musicApi.getMalayalamHits,
    getTamilHits: musicApi.getTamilHits,
    getHindiHits: musicApi.getHindiHits,
    getFeaturedArtists: musicApi.getFeaturedArtists,
    getRadioStations: musicApi.getRadioStations,
    getLiveStations: musicApi.getLiveStations,
    getNewReleases: musicApi.getNewReleases,

    convertImage: convertImage,

    // Library Management
    addToFavorites: async (song: Song) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BACKEND_URL}/users/favorites/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ song })
        });
        return response.json();
    },

    removeFromFavorites: async (songId: string) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BACKEND_URL}/users/favorites/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ songId })
        });
        return response.json();
    },

    addSongToPlaylist: async (playlistId: string, song: Song) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BACKEND_URL}/music/playlists/${playlistId}/songs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(song)
        });
        if (!response.ok) throw new Error('Failed to add song to playlist');
        return response.json();
    },

    removeSongFromPlaylist: async (playlistId: string, songId: string) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BACKEND_URL}/music/playlists/${playlistId}/songs/${songId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to remove song from playlist');
        return response.json();
    },

    deletePlaylist: async (id: string) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BACKEND_URL}/music/playlists/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete playlist');
        return response.json();
    },

    createPlaylist: async (data: { name: string; description?: string; coverUrl?: string; isPublic?: boolean }) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BACKEND_URL}/music/playlists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create playlist');
        return response.json();
    },

    editPlaylist: async (id: string, data: { name?: string; description?: string; coverUrl?: string; isPublic?: boolean }) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BACKEND_URL}/music/playlists/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update playlist');
        return response.json();
    }
};
