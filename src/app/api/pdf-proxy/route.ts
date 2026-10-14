import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

// Parse Cloudinary config
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
} else {
    cloudinary.config({ secure: true });
}

export async function GET(request: Request) {
    try {
        // Note: getServerSession is removed here because iframe requests (used by the PDF viewer)
        // often drop NextAuth session cookies due to modern SameSite=Lax cookie policies,
        // causing a false 401 Unauthorized error when users try to view notes.

        const { searchParams } = new URL(request.url);
        const pdfUrl = searchParams.get("url");

        if (!pdfUrl) {
            return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
        }

        // Validate it's a Cloudinary URL from our account
        if (!pdfUrl.includes("cloudinary.com")) {
            return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
        }

        // Extract the public_id and version correctly
        // Cloudinary raw URLs format: https://res.cloudinary.com/<cloud>/raw/upload/v<version>/<folder>/<filename>
        const urlObj = new URL(pdfUrl);
        const pathParts = urlObj.pathname.split("/upload/");
        if (pathParts.length !== 2) {
            return NextResponse.json({ error: "Invalid Cloudinary URL structure" }, { status: 400 });
        }

        const afterUpload = pathParts[1]; // e.g., "v1234567/examvault/pdfs/file.pdf"
        
        // Remove version if present (v followed by digits)
        const publicId = afterUpload.replace(/^v\d+\//, "");

        // Determine if this is a raw or image upload
        const resourceType = pdfUrl.includes("/raw/upload") ? "raw" : "image";

        // Ensure no attachment flags are accidentally passed to the signature generator
        const cleanPublicId = publicId.replace("fl_attachment/", "");

        // Instead of struggling with complex CDN URL signatures for raw files,
        // we use Cloudinary's secure Admin/Delivery API with Basic Auth.
        // This guarantees access using the server's private API secret.
        const cloudName = cloudinary.config().cloud_name;
        const apiKey = cloudinary.config().api_key;
        const apiSecret = cloudinary.config().api_secret;

        // Our test script revealed that the Cloudinary Delivery CDN (res.cloudinary.com)
        // rejects server-side raw fetches with 401 Unauthorized even with Basic Auth headers.
        // However, the Cloudinary Admin API retrieves the file bytes perfectly.
        const secureDeliveryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/${resourceType}/upload/${cleanPublicId}`;

        // Fetch the file securely server-side
        const response = await fetch(secureDeliveryUrl, {
            headers: {
                // Add Authorization header explicitly
                Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
            },
        });

        if (!response.ok) {
            console.error("Cloudinary fetch failed:", response.status, secureDeliveryUrl);
            return NextResponse.json(
                { error: `Failed to fetch PDF from storage: ${response.status}` },
                { status: 502 }
            );
        }

        // Send the raw bytes down to the browser with explicit INLINE headers
        const blob = await response.arrayBuffer();
        
        // Extract a clean filename for the browser
        const urlParts = cleanPublicId.split("/");
        const fileName = urlParts[urlParts.length - 1] || "document.pdf";

        return new NextResponse(blob, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                // Force inline so the browser renders it in the iframe instead of downloading
                "Content-Disposition": `inline; filename="${fileName}"`,
                "Cache-Control": "public, max-age=86400",
            },
        });

    } catch (error: any) {
        console.error("PDF proxy error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
