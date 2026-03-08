import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Formula from "@/models/Formula";
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
        const formula = await Formula.findByIdAndUpdate(id, data, { new: true });
        if (!formula) {
            return NextResponse.json({ error: "Formula not found" }, { status: 404 });
        }
        return NextResponse.json(formula);
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
        const formula = await Formula.findByIdAndDelete(id);
        if (!formula) {
            return NextResponse.json({ error: "Formula not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Formula deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
