import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

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
        const { searchParams } = new URL(request.url);
        const pdfUrl = searchParams.get("url");

        if (!pdfUrl) {
            return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
        }

        let blob: ArrayBuffer;
        let fileName = "document.pdf";

        // Case 1: Local file in public/
        if (pdfUrl.startsWith("/") || pdfUrl.startsWith("/uploads/")) {
            const cleanRelPath = pdfUrl.startsWith("/") ? pdfUrl.slice(1) : pdfUrl;
            const localPath = path.join(process.cwd(), "public", cleanRelPath);
            if (fs.existsSync(localPath)) {
                const fileBuf = fs.readFileSync(localPath);
                blob = fileBuf.buffer.slice(fileBuf.byteOffset, fileBuf.byteOffset + fileBuf.byteLength) as ArrayBuffer;
                fileName = path.basename(localPath);
            } else {
                return NextResponse.json({ error: "File not found on server" }, { status: 404 });
            }
        }
        // Case 2: Cloudinary URL
        else if (pdfUrl.includes("cloudinary.com")) {
            const urlObj = new URL(pdfUrl);
            const pathParts = urlObj.pathname.split("/upload/");
            if (pathParts.length !== 2) {
                return NextResponse.json({ error: "Invalid Cloudinary URL structure" }, { status: 400 });
            }

            const afterUpload = pathParts[1];
            // Remove version if present (v followed by digits)
            const publicId = afterUpload.replace(/^v\d+\//, "");
            const cleanPublicId = publicId.replace("fl_attachment/", "");

            // Generate private authenticated download URL which bypasses restricted PDF delivery
            const downloadUrl = cloudinary.utils.private_download_url(cleanPublicId, "pdf", {
                resource_type: "raw",
                type: "upload",
            });

            let response = await fetch(downloadUrl);
            if (!response.ok) {
                // Try direct fetch fallback
                response = await fetch(pdfUrl);
            }

            if (!response.ok) {
                console.error("Cloudinary PDF fetch failed:", response.status, downloadUrl);
                return NextResponse.json(
                    { error: `Failed to fetch PDF from storage: ${response.status}` },
                    { status: 502 }
                );
            }

            blob = await response.arrayBuffer();
            const urlParts = cleanPublicId.split("/");
            fileName = urlParts[urlParts.length - 1] || "document.pdf";
        }
        // Case 3: External URL
        else {
            const response = await fetch(pdfUrl);
            if (!response.ok) {
                return NextResponse.json({ error: "Failed to fetch external PDF" }, { status: 502 });
            }
            blob = await response.arrayBuffer();
            fileName = pdfUrl.split("/").pop() || "document.pdf";
        }

        return new NextResponse(blob, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${fileName}"`,
                "Cache-Control": "public, max-age=86400",
            },
        });
    } catch (error: any) {
        console.error("PDF proxy error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
