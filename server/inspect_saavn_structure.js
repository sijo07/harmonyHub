const axios = require('axios');

const url = 'https://saavn.me/modules';

async function inspectStructure() {
    try {
        const response = await axios.get(url, { params: { language: 'english,hindi' } });
        const data = response.data.data || response.data; // Handle both wrapper and no-wrapper

        console.log("Root Keys:", Object.keys(data));

        if (data.trending) {
            console.log("Trending Type:", typeof data.trending);
            if (data.trending.songs) {
                console.log("Trending.songs detected");
                console.log("Sample:", JSON.stringify(data.trending.songs[0], null, 2));
            } else if (Array.isArray(data.trending)) {
                console.log("Trending is Array");
                console.log("Sample:", JSON.stringify(data.trending[0], null, 2));
            } else {
                console.log("Trending structure unknown:", JSON.stringify(data.trending).substring(0, 200));
            }
        }

        if (data.albums) {
            console.log("Albums Type:", typeof data.albums);
            if (Array.isArray(data.albums)) {
                console.log("Sample Album:", JSON.stringify(data.albums[0], null, 2));
            }
        }

    } catch (error) {
        console.error(error.message);
    }
}

inspectStructure();
