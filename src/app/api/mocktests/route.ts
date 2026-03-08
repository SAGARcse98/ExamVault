import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import MockTest from "@/models/MockTest";
import MockTestAttempt from "@/models/MockTestAttempt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const subjectId = searchParams.get("subjectId");
        const difficulty = searchParams.get("difficulty");

        const filter: any = { isPublished: true };
        if (subjectId) filter.subjectId = subjectId;
        if (difficulty) filter.difficulty = difficulty;

        const tests = await MockTest.find(filter)
            .select("-questions") // Don't send questions in listing
            .populate("subjectId", "name slug")
            .populate("topicId", "name slug")
            .sort({ createdAt: -1 });

        // Get user's attempts for these tests
        const session = await getServerSession(authOptions);
        let attempts: any[] = [];
        if (session?.user) {
            const userId = (session.user as any).id;
            attempts = await MockTestAttempt.find({
                userId,
                mockTestId: { $in: tests.map(t => t._id) },
                status: "completed",
            }).select("mockTestId score totalCorrect totalWrong totalSkipped");
        }

        const testsWithAttempts = tests.map(test => {
            const attempt = attempts.find(a => a.mockTestId.toString() === test._id.toString());
            return {
                ...test.toObject(),
                lastAttempt: attempt || null,
            };
        });

        return NextResponse.json(testsWithAttempts);
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
        const test = await MockTest.create(data);
        return NextResponse.json(test, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
