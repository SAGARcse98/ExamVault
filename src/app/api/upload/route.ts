import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    secure: true, // Uses CLOUDINARY_URL automatically
});

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

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary using upload_stream
        const uploadResult = await new Promise((resolve, reject) => {
            const resourceType = type === "video" ? "video" : (file.type === "application/pdf" ? "raw" : "auto");

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: resourceType,
                    folder: `examvault/${type}s`,
                    public_id: file.name.replace(/\.[^/.]+$/, ""), // Original name without extension
                },
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

        const publicUrl = (uploadResult as any).secure_url;
        const fileName = (uploadResult as any).original_filename + "." + ((uploadResult as any).format || ((file.name.split('.').pop() || '')));

        return NextResponse.json({ url: publicUrl, fileName }, { status: 201 });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

