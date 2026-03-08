import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

        // Determine upload directory
        const subDir = type === "video" ? "videos" : "pdfs";
        const uploadDir = path.join(process.cwd(), "public", "uploads", subDir);

        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true });

        // Create unique filename with timestamp
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const fileName = `${timestamp}_${originalName}`;
        const filePath = path.join(uploadDir, fileName);

        // Write file to disk
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Return the public URL
        const publicUrl = `/uploads/${subDir}/${fileName}`;
        return NextResponse.json({ url: publicUrl, fileName }, { status: 201 });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

