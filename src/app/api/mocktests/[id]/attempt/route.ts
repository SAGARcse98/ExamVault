import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import MockTest from "@/models/MockTest";
import MockTestAttempt from "@/models/MockTestAttempt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;
        const userId = (session.user as any).id;

        const attempts = await MockTestAttempt.find({ userId, mockTestId: id })
            .sort({ createdAt: -1 });

        return NextResponse.json(attempts);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;
        const userId = (session.user as any).id;
        const body = await request.json();

        // Action: "start" or "submit"
        if (body.action === "start") {
            // Check for existing in-progress attempt
            const existing = await MockTestAttempt.findOne({
                userId, mockTestId: id, status: "in-progress",
            });
            if (existing) {
                return NextResponse.json(existing);
            }

            const attempt = await MockTestAttempt.create({
                userId,
                mockTestId: id,
                startedAt: new Date(),
                status: "in-progress",
                answers: [],
            });
            return NextResponse.json(attempt, { status: 201 });
        }

        if (body.action === "submit") {
            const { answers } = body; // Array of { questionIndex, selectedAnswer, timeTaken }
            const test = await MockTest.findById(id);
            if (!test) {
                return NextResponse.json({ error: "Test not found" }, { status: 404 });
            }

            // Grade the answers
            let score = 0;
            let totalCorrect = 0;
            let totalWrong = 0;
            let totalSkipped = 0;

            const gradedAnswers = test.questions.map((q, index) => {
                const userAnswer = answers.find((a: any) => a.questionIndex === index);
                const selectedAnswer = userAnswer?.selectedAnswer ?? null;
                const timeTaken = userAnswer?.timeTaken ?? 0;

                if (selectedAnswer === null || selectedAnswer === undefined || selectedAnswer === -1) {
                    totalSkipped++;
                    return { questionIndex: index, selectedAnswer: null, isCorrect: false, timeTaken };
                }

                const isCorrect = selectedAnswer === q.correctAnswer;
                if (isCorrect) {
                    totalCorrect++;
                    score += q.marks;
                } else {
                    totalWrong++;
                    score -= test.negativeMarking;
                }

                return { questionIndex: index, selectedAnswer, isCorrect, timeTaken };
            });

            // Round score to 2 decimal places
            score = Math.round(score * 100) / 100;

            // Find or create attempt
            let attempt = await MockTestAttempt.findOne({
                userId, mockTestId: id, status: "in-progress",
            });

            if (attempt) {
                attempt.answers = gradedAnswers;
                attempt.score = score;
                attempt.totalCorrect = totalCorrect;
                attempt.totalWrong = totalWrong;
                attempt.totalSkipped = totalSkipped;
                attempt.completedAt = new Date();
                attempt.status = "completed";
                await attempt.save();
            } else {
                attempt = await MockTestAttempt.create({
                    userId,
                    mockTestId: id,
                    answers: gradedAnswers,
                    score,
                    totalCorrect,
                    totalWrong,
                    totalSkipped,
                    startedAt: new Date(),
                    completedAt: new Date(),
                    status: "completed",
                });
            }

            return NextResponse.json(attempt);
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
