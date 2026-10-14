import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

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

        // Check file size limit
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
            let resourceType: "image" | "video" | "raw" | "auto";
            let publicId: string;

            if (isVideo) {
                // Videos: use "video" resource type with quality compression
                resourceType = "video";
                // Strip extension — Cloudinary adds it automatically for video/image
                publicId = file.name.replace(/\.[^/.]+$/, "");
            } else if (isPdf) {
                // PDFs: MUST use "raw" resource type to preserve file bytes exactly.
                // Using "image" corrupts the PDF by applying image processing transforms.
                resourceType = "raw";
                // For "raw" uploads, keep the .pdf extension in the public_id
                // so Cloudinary serves it with the correct Content-Type.
                publicId = file.name;
            } else {
                resourceType = "auto";
                publicId = file.name.replace(/\.[^/.]+$/, "");
            }

            const uploadOptions: Record<string, any> = {
                resource_type: resourceType,
                folder: `examvault/${isVideo ? "videos" : "pdfs"}`,
                public_id: publicId,
                timeout: 120000, // 2 min timeout for large files
            };

            if (isVideo) {
                // Compress video server-side on Cloudinary
                uploadOptions.quality = "auto:good";
                uploadOptions.video_codec = "auto";
            }

            // NOTE: No quality/compression options for PDFs —
            // raw upload stores the file exactly as-is.

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

        // For PDFs: provide a separate download URL with fl_attachment so the
        // browser downloads instead of trying to display inline via raw URL.
        let downloadUrl = publicUrl;
        if (isPdf) {
            // raw URLs look like: /raw/upload/v.../folder/file.pdf
            // We can still add Cloudinary transformation flags to raw URLs.
            downloadUrl = publicUrl.replace("/upload/", "/upload/fl_attachment/");
        }

        const fileName = isPdf
            ? file.name
            : result.original_filename + "." + (result.format || file.name.split(".").pop() || "");

        return NextResponse.json({ url: publicUrl, downloadUrl, fileName }, { status: 201 });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
