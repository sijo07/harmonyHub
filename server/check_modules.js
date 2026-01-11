const axios = require('axios');
const SAAVN_API_URL = 'https://saavn.me';
async function checkModules() {
    try {
        const res = await axios.get(`${SAAVN_API_URL}/modules?language=english,hindi`);
        if (res.data.status === 'SUCCESS') {
            const data = res.data.data;
            console.log("Keys:", Object.keys(data));
            if (data.charts) console.log("Charts count:", data.charts.length);
            if (data.radio) console.log("Radio count:", data.radio.length);
        }
    } catch (e) { console.error(e.message); }
}
checkModules();
