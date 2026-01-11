const axios = require('axios');

const searchEndpoints = [
    'https://saavn.me/search/songs',
    'https://saavn.dev/api/search/songs',
    'https://saavn.sumit.co/api/search/songs',
    'https://jiosaavn-api-privatecvc2.vercel.app/search/songs',
    'https://saavn.api.br/search/songs'
];

async function findWorkingSearch() {
    console.log("Testing Search Endpoints using query '2024'...");

    for (const url of searchEndpoints) {
        try {
            console.log(`\nTesting ${url}...`);
            const response = await axios.get(url, {
                params: { query: '2024', limit: 5 },
                timeout: 5000
            });

            const contentType = response.headers['content-type'] || '';

            if (response.status === 200 && contentType.includes('application/json')) {
                const data = response.data.data || response.data;
                const results = data.results || data;

                if (Array.isArray(results) && results.length > 0) {
                    const first = results[0];
                    if (first.name || first.title) {
                        console.log(`[PASS] ${url}`);
                        console.log(`Sample: ${first.name || first.title} (${first.year})`);
                        return; // Found one!
                    }
                }
                console.log(`[FAIL] ${url} - Valid JSON but unexpected structure. Keys: ${Object.keys(data)}`);
            } else {
                console.log(`[FAIL] ${url} - Content-Type: ${contentType}`);
            }

        } catch (error) {
            console.log(`[FAIL] ${url}: ${error.message}`);
        }
    }
    console.log("\nNo working search API found.");
}

findWorkingSearch();
