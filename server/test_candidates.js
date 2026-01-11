const axios = require('axios');

const candidates = [
    'https://saavn.me/modules',
    'https://saavn.me/home',
    'https://saavn.sumit.co/api/modules',
    'https://saavn.sumit.co/api/home',
    'https://jiosaavn-api-privatecvc2.vercel.app/modules',
    'https://saavn-api-v2.vercel.app/modules'
];

async function testCandidates() {
    for (const url of candidates) {
        try {
            console.log(`Checking ${url}...`);
            const response = await axios.get(url, { params: { language: 'english' }, timeout: 5000 });
            const data = response.data;
            const innerData = data.data || data;

            const keys = Object.keys(innerData);
            console.log(`keys: ${keys.join(',')}`);

            if (keys.includes('trending') || keys.includes('new_trending')) {
                console.log(`\n!!! FOUND WORKING API: ${url} !!!\n`);
                console.log(`Structure: ${JSON.stringify(innerData).substring(0, 100)}...`);
                return;
            }
        } catch (error) {
            console.log(`Failed: ${url} - ${error.message}`);
        }
    }
    console.log("No working API found.");
}

testCandidates();
