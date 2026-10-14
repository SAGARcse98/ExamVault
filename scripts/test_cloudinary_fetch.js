// run with: node scripts/test_cloudinary_fetch.js
const https = require('https');

const cloudName = "dquaiqpaz";
const apiKey = "684499474594685";
const apiSecret = "3XOyZSD1QHyu-PI7VfqRj7ZsS38";

// The corrupted URL user is trying to access
const pdfUrl = "https://res.cloudinary.com/dquaiqpaz/raw/upload/examvault/pdfs/Speed%20Math_Vedic%20Math%20Part-3.pdf";

async function testFetch(name, fetchUrl, headers = {}) {
    try {
        const res = await fetch(fetchUrl, { headers });
        console.log(`[${name}] Status:`, res.status);
    } catch (e) {
        console.error(`[${name}] Failed:`, e.message);
    }
}

async function runTests() {
    console.log("Testing Cloudinary Raw PDF Fetching");
    console.log("-----------------------------------");

    // 1. Direct fetch
    await testFetch("Direct", pdfUrl);

    // 2. Basic Auth
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    await testFetch("Basic Auth", pdfUrl, { Authorization: `Basic ${auth}` });

    // 3. User Agent Bypass
    await testFetch("Server User-Agent", pdfUrl, { "User-Agent": "node-fetch" });
    
    // 4. Using the API folder instead of direct URL
    const apiFetchUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/raw/upload/examvault/pdfs/Speed%20Math_Vedic%20Math%20Part-3.pdf`;
    await testFetch("Admin API fetch", apiFetchUrl, { Authorization: `Basic ${auth}` });
}

runTests();
