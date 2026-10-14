import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const cloudinaryUrl = process.env.CLOUDINARY_URL || "";
if (cloudinaryUrl) {
    try {
        const url = new URL(cloudinaryUrl);
        cloudinary.config({
            cloud_name: url.host,
            api_key: url.username,
            api_secret: url.password,
            secure: true,
        });
    } catch {
        cloudinary.config({ secure: true });
    }
}

const testUrl = "https://res.cloudinary.com/dquaiqpaz/raw/upload/v1773297663/examvault/pdfs/Simplification%20Questions%20Final%20Test%20PDF%20by%20Aashish%20Arora.pdf";

async function test() {
    const urlObj = new URL(testUrl);
    const pathParts = urlObj.pathname.split("/upload/");
    const withoutVersion = pathParts[1].replace(/^v\d+\//, "");
    // Keeping the extension is REQUIRED for raw files
    const publicId = withoutVersion; 

    // Generate signed URL properly
    const signedUrl = cloudinary.url(publicId, {
        resource_type: "raw",
        sign_url: true,
        type: "upload",
        secure: true
    });

    console.log("Original URL:", testUrl);
    console.log("Generated Public ID:", publicId);
    console.log("Signed URL:", signedUrl);

    const res = await fetch(signedUrl);
    console.log("Fetch result:", res.status, res.statusText);
}

test().catch(console.error);
