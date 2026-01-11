const axios = require('axios');

const SAAVN_API_URL = 'https://saavn.me';

async function testRadio() {
    try {
        console.log("Testing /modules...");
        const response = await axios.get(`${SAAVN_API_URL}/modules`);
        const data = response.data;
        console.log("Type of data:", typeof data);
        if (typeof data === 'string') {
            console.log("Data (first 500 chars):", data.substring(0, 500));
        } else {
            console.log("Data is object.");
            console.log("Keys:", Object.keys(data));
            if (data.data) {
                console.log("Data.data keys:", Object.keys(data.data));
                if (data.data.radio) {
                    console.log("Radio found!");
                }
                if (data.data.charts) {
                    console.log("Charts found!");
                }
            }
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

testRadio();
