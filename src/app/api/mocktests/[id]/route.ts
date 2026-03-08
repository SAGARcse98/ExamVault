import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import MockTest from "@/models/MockTest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const test = await MockTest.findById(id)
            .populate("subjectId", "name slug")
            .populate("topicId", "name slug");

        if (!test) {
            return NextResponse.json({ error: "Test not found" }, { status: 404 });
        }
        return NextResponse.json(test);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;
        const data = await request.json();
        const test = await MockTest.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json(test);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;
        await MockTest.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
