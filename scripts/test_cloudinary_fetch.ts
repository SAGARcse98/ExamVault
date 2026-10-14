import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const cloudinaryUrl = process.env.CLOUDINARY_URL || "";
const url = new URL(cloudinaryUrl);
const cloudName = url.host;
const apiKey = url.username;
const apiSecret = url.password;

// The corrupted URL user is trying to access
const pdfUrl = "https://res.cloudinary.com/dquaiqpaz/raw/upload/examvault/pdfs/Speed%20Math_Vedic%20Math%20Part-3.pdf";

async function testFetch(name: string, fetchUrl: string, headers: any = {}) {
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
