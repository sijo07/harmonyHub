const axios = require('axios');

const SAAVN_API_URL = 'https://saavn.me';

async function testDateSearch() {
    try {
        const query = '2024';
        console.log(`Searching songs for "${query}"...`);
        const response = await axios.get(`${SAAVN_API_URL}/search/songs`, {
            params: { query: query, limit: 10 }
        });

        if (response.data) {
            let results = [];
            const data = response.data;

            // Handle various possible structures
            if (data.data && data.data.results) {
                results = data.data.results;
            } else if (data.results) {
                results = data.results;
            } else if (Array.isArray(data)) {
                results = data;
            }

            console.log(`Found ${results.length} results.`);

            if (results.length > 0) {
                results.slice(0, 5).forEach(song => {
                    console.log(`- [${song.year}] ${song.name} (Date: ${song.release_date || 'N/A'})`);
                });
            } else {
                console.log("Structure unclear. Root keys:", Object.keys(data));
                if (!Array.isArray(data)) {
                    console.log("First key type:", typeof data[Object.keys(data)[0]]);
                }
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

testDateSearch();
