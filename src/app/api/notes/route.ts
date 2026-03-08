import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Note from "@/models/Note";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const subjectId = searchParams.get("subjectId");
        const topicId = searchParams.get("topicId");
        const important = searchParams.get("important");

        const filter: any = {};
        if (subjectId) filter.subjectId = subjectId;
        if (topicId) filter.topicId = topicId;
        if (important === "true") filter.isImportant = true;

        const notes = await Note.find(filter)
            .populate("subjectId", "name slug")
            .populate("topicId", "name slug")
            .sort({ createdAt: -1 });
        return NextResponse.json(notes);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await request.json();
        const note = await Note.create(data);
        return NextResponse.json(note, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
