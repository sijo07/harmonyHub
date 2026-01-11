const axios = require('axios');

const SAAVN_API_URL = 'https://saavn.sumit.co/api';

async function inspectSaavnResponse() {
    try {
        console.log(`Fetching from ${SAAVN_API_URL}/modules...`);
        const response = await axios.get(`${SAAVN_API_URL}/modules`, {
            params: { language: 'english,hindi,malayalam,tamil' }
        });

        console.log("Status:", response.status);
        if (response.data) {
            if (response.data.status === 'SUCCESS' || response.data.data) {
                console.log("SUCCESS! Data found.");
                const data = response.data.data;
                console.log("Data Keys:", Object.keys(data));
                if (data.trending) console.log("Trending:", JSON.stringify(data.trending).substring(0, 200));
                if (data.albums) console.log("Albums:", JSON.stringify(data.albums).substring(0, 200));
                if (data.playlists) console.log("Playlists:", JSON.stringify(data.playlists).substring(0, 200));
            } else {
                console.log("Response JSON but no success/data:", JSON.stringify(response.data).substring(0, 500));
            }
        }

    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Data:", JSON.stringify(error.response.data).substring(0, 500));
        }
    }
}

inspectSaavnResponse();
