import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Topic from "@/models/Topic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const subjectId = searchParams.get("subjectId");

        const filter = subjectId ? { subjectId } : {};
        const topics = await Topic.find(filter).populate("subjectId", "name slug").sort({ name: 1 });
        return NextResponse.json(topics);
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
        const topic = await Topic.create(data);
        return NextResponse.json(topic, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
