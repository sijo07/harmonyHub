const musicService = require('./services/musicService');

async function testDirectly() {
    console.log("Testing musicService.getNewReleases() directly...");
    try {
        const result = await musicService.getNewReleases();
        console.log("Result Keys:", Object.keys(result));
        if (result.data) {
            console.log("New Trending Length:", result.data.newTrending.length);
            console.log("New Albums Length:", result.data.newAlbums.length);
            if (result.data.newTrending.length > 0) {
                console.log("First Item:", result.data.newTrending[0].title);
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

testDirectly();
