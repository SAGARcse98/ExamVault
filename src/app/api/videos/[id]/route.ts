import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import VideoLecture from "@/models/VideoLecture";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();
        const video = await VideoLecture.findById(id)
            .populate("subjectId", "name slug")
            .populate("topicId", "name slug");
        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }
        return NextResponse.json(video);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await request.json();
        const video = await VideoLecture.findByIdAndUpdate(id, data, { new: true });
        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }
        return NextResponse.json(video);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const video = await VideoLecture.findByIdAndDelete(id);
        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Video deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
