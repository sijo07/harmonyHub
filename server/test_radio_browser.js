const axios = require('axios');

// Radio Browser API has multiple servers. We can try one.
const RADIO_API_URL = 'https://de1.api.radio-browser.info/json/stations/topclick/5';

async function testRadioBrowser() {
    try {
        console.log(`Fetching from ${RADIO_API_URL}...`);
        const response = await axios.get(RADIO_API_URL);

        if (Array.isArray(response.data)) {
            console.log(`Found ${response.data.length} stations.`);
            if (response.data.length > 0) {
                console.log("Sample Station:", JSON.stringify(response.data[0], null, 2));
            }
        } else {
            console.log("Unexpected response format:", typeof response.data);
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

testRadioBrowser();
