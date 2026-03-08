import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Topic from "@/models/Topic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
        const topic = await Topic.findByIdAndUpdate(id, data, { new: true });
        if (!topic) {
            return NextResponse.json({ error: "Topic not found" }, { status: 404 });
        }
        return NextResponse.json(topic);
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
        const topic = await Topic.findByIdAndDelete(id);
        if (!topic) {
            return NextResponse.json({ error: "Topic not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Topic deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
