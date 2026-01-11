const axios = require('axios');

const url = 'https://saavn.dev/api/modules';

async function testTarget() {
    try {
        console.log(`Testing ${url}...`);
        const response = await axios.get(url, { params: { language: 'english,hindi' } });

        console.log("Status:", response.status);
        const data = response.data;

        console.log("Root Keys:", Object.keys(data));
        if (data.data) {
            console.log("Data Keys:", Object.keys(data.data));
            // Check trending
            if (data.data.trending) {
                console.log("Trending found.");
            }
        }

    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Data:", JSON.stringify(error.response.data).substring(0, 200));
        }
    }
}

testTarget();
