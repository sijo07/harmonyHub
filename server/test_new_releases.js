const axios = require('axios');

const BACKEND_URL = 'http://localhost:3001/api/music/new-releases';

async function testNewReleases() {
    try {
        console.log(`Fetching from ${BACKEND_URL}...`);
        const response = await axios.get(BACKEND_URL);

        if (response.data && response.data.data) {
            const { newTrending, newAlbums, topPlaylists } = response.data.data;
            console.log(`New Trending: ${newTrending.length} items`);
            console.log(`New Albums: ${newAlbums.length} items`);
            console.log(`Top Playlists: ${topPlaylists.length} items`);

            if (newTrending.length > 0) {
                console.log("Sample Trending Item:", JSON.stringify(newTrending[0], null, 2));
            }
        } else {
            console.log("Unexpected response format:", response.data);
        }

    } catch (error) {
        console.error("Error Message:", error.message);
        console.error("Stack:", error.stack);
        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Data:", JSON.stringify(error.response.data, null, 2));
        }
    }
}

testNewReleases();
