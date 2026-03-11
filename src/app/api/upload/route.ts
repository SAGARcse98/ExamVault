import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

// Increase Vercel's default body size limit (4.5MB) for file uploads
export const config = {
    api: {
        bodyParser: false,
        responseLimit: false,
    },
};

// Increase max duration for large file uploads on Vercel (seconds)
export const maxDuration = 60;

// Explicitly parse CLOUDINARY_URL in case Vercel doesn't auto-populate it
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
        cloudinary.config({ secure: true }); // fallback to auto-parse
    }
} else {
    cloudinary.config({ secure: true });
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string; // "video" or "pdf"

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Check file size: warn if over 50MB (Vercel Hobby plan struggles with very large files)
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > 100) {
            return NextResponse.json(
                { error: `File too large (${fileSizeMB.toFixed(1)}MB). Maximum allowed is 100MB.` },
                { status: 413 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        const isVideo = type === "video";

        const uploadResult = await new Promise((resolve, reject) => {
            // PDFs as "image" type lets Cloudinary compress and still serve as PDF.
            // Videos as "video" type with quality:auto for Cloudinary-side compression.
            const resourceType: "image" | "video" | "raw" | "auto" = isVideo
                ? "video"
                : isPdf
                    ? "image"
                    : "auto";

            // Strip extension from public_id (Cloudinary adds format automatically)
            const publicId = file.name.replace(/\.[^/.]+$/, "");

            const uploadOptions: Record<string, any> = {
                resource_type: resourceType,
                folder: `examvault/${isVideo ? "videos" : "pdfs"}`,
                public_id: publicId,
                timeout: 120000, // 2 min timeout for large files
            };

            if (isVideo) {
                // Compress video server-side on Cloudinary
                // NOTE: No eager transforms — they can cause Vercel function timeouts
                uploadOptions.quality = "auto:good";   // reduce file size automatically
                uploadOptions.video_codec = "auto";     // best codec for content
            }

            if (isPdf) {
                // Compress PDF: lossy compression on embedded images inside the PDF
                uploadOptions.quality = "auto:good";
                uploadOptions.flags = "lossy";
                uploadOptions.format = "pdf";
                uploadOptions.pages = true;
            }

            const uploadStream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload failed:", error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(buffer);
        });

        const result = uploadResult as any;
        const publicUrl = result.secure_url;

        // For PDFs: fl_attachment forces browser to download instead of displaying inline
        let downloadUrl = publicUrl;
        if (isPdf) {
            downloadUrl = publicUrl.replace("/upload/", "/upload/fl_attachment/");
        }

        const fileName =
            result.original_filename +
            "." +
            (result.format || file.name.split(".").pop() || "");

        return NextResponse.json({ url: publicUrl, downloadUrl, fileName }, { status: 201 });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
