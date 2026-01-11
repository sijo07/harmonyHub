const axios = require('axios');

const endpoints = [
    'https://saavn.me/modules',
    'https://saavn.dev/api/modules',
    'https://saavn.sumit.co/api/modules',
    'https://jiosaavn-api-privatecvc2.vercel.app/modules',
    'https://saavn.api.br/modules' // Another potential mirror
];

async function testEndpoints() {
    console.log("Starting comprehensive API test...");

    for (const url of endpoints) {
        try {
            console.log(`\nTesting ${url}...`);
            const response = await axios.get(url, {
                params: { language: 'english,hindi' },
                timeout: 8000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            const contentType = response.headers['content-type'] || '';

            if (response.status === 200 && contentType.includes('application/json')) {
                const data = response.data.data || response.data;

                // Check for key components
                const keys = Object.keys(data);
                const hasTrending = keys.includes('trending') || keys.includes('new_trending');
                const hasAlbums = keys.includes('albums') || keys.includes('new_albums');

                if (hasTrending || hasAlbums) {
                    console.log(`[PASS] ${url}`);
                    console.log(`Keys: ${keys.join(', ')}`);

                    // Deep check trending
                    let trending = data.trending || data.new_trending;
                    if (trending) {
                        const isArr = Array.isArray(trending);
                        const isObjArr = trending.songs && Array.isArray(trending.songs);
                        console.log(`Trending structure: ${isArr ? 'Array' : (isObjArr ? 'Object with songs array' : typeof trending)}`);
                    }
                } else {
                    console.log(`[FAIL] ${url} (Invalid data structure) Keys: ${keys.join(', ')}`);
                }
            } else {
                console.log(`[FAIL] ${url} returned ${contentType}`);
            }
        } catch (error) {
            console.log(`[FAIL] ${url}: ${error.message}`);
        }
    }
    console.log("\nTest complete.");
}

testEndpoints();
