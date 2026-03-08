import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import MockTest from "@/models/MockTest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Admin endpoint - returns ALL tests including unpublished, with questions
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const tests = await MockTest.find({})
            .select("-questions") // Don't send questions in listing
            .sort({ createdAt: -1 });

        return NextResponse.json(tests);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
