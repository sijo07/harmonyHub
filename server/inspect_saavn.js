const axios = require('axios');

const SAAVN_API_URL = 'https://saavn.me';

async function inspectSaavnResponse() {
    try {
        console.log(`Fetching from ${SAAVN_API_URL}/modules...`);
        const response = await axios.get(`${SAAVN_API_URL}/modules`, {
            params: { language: 'english,hindi,malayalam,tamil' }
        });

        console.log("Status:", response.status);
        if (response.data) {
            console.log("Response Keys:", Object.keys(response.data));
            if (response.data.data) {
                console.log("Data Keys:", Object.keys(response.data.data));
                // Log a small part to see structure
                console.log("Sample Data (First 500 chars):", JSON.stringify(response.data.data).substring(0, 500));
            } else {
                console.log("No 'data' property in response body.");
                console.log("Full Body:", JSON.stringify(response.data).substring(0, 500));
            }
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

inspectSaavnResponse();
