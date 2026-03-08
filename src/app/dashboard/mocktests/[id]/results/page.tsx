"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, CheckCircle2, XCircle, MinusCircle, Clock, BarChart3, RotateCcw } from "lucide-react";

export default function MockTestResultsPage() {
    const params = useParams();
    const testId = params.id as string;
    const [test, setTest] = useState<any>(null);
    const [attempt, setAttempt] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showReview, setShowReview] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch(`/api/mocktests/${testId}`).then(r => r.json()),
            fetch(`/api/mocktests/${testId}/attempt`).then(r => r.json()),
        ])
            .then(([testData, attempts]) => {
                setTest(testData);
                // Get latest completed attempt
                const completed = Array.isArray(attempts)
                    ? attempts.filter((a: any) => a.status === "completed").sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0]
                    : null;
                setAttempt(completed);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [testId]);

    if (loading) {
        return (
            <div className="animate-fade-in">
                <div className="skeleton" style={{ height: 300, borderRadius: 20, marginBottom: 20 }} />
                <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
            </div>
        );
    }

    if (!test || !attempt) {
        return (
            <div style={{ textAlign: "center", padding: 60 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: "#374151", marginBottom: 12 }}>No results found</h3>
                <Link href="/dashboard/mocktests" style={{ color: "#4F46E5", fontWeight: 600, textDecoration: "none" }}>
                    ← Back to Mock Tests
                </Link>
            </div>
        );
    }

    const accuracy = attempt.totalCorrect > 0
        ? Math.round((attempt.totalCorrect / (attempt.totalCorrect + attempt.totalWrong)) * 100)
        : 0;
    const percentage = Math.round((attempt.score / test.totalMarks) * 100);
    const timeTaken = attempt.completedAt && attempt.startedAt
        ? Math.round((new Date(attempt.completedAt).getTime() - new Date(attempt.startedAt).getTime()) / 60000)
        : 0;

    const scoreColor = percentage >= 70 ? "#10B981" : percentage >= 40 ? "#F59E0B" : "#EF4444";

    return (
        <div className="animate-fade-in">
            <Link href="/dashboard/mocktests" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#64748B", textDecoration: "none", fontSize: 14, marginBottom: 20, fontWeight: 500 }}>
                <ArrowLeft className="w-4 h-4" /> Back to Mock Tests
            </Link>

            {/* Score Card */}
            <div style={{ background: "white", borderRadius: 20, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 20 }}>
                <div style={{ height: 6, background: `linear-gradient(90deg, ${scoreColor}, #06B6D4)` }} />
                <div style={{ padding: "32px 36px" }}>
                    <div style={{ textAlign: "center", marginBottom: 28 }}>
                        <Trophy className="w-12 h-12" style={{ color: scoreColor, margin: "0 auto 12px" }} />
                        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>{test.title}</h2>
                        <p style={{ color: "#64748B", fontSize: 14 }}>Test Completed</p>
                    </div>

                    {/* Score circle */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
                        <div style={{
                            width: 140, height: 140, borderRadius: "50%",
                            background: `conic-gradient(${scoreColor} ${percentage * 3.6}deg, #F1F5F9 0deg)`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <div style={{
                                width: 110, height: 110, borderRadius: "50%", background: "white",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            }}>
                                <span style={{ fontSize: 28, fontWeight: 800, color: scoreColor }}>{attempt.score}</span>
                                <span style={{ fontSize: 12, color: "#94A3B8" }}>/ {test.totalMarks}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14 }}>
                        <div style={{ padding: "16px", background: "#F0FDF4", borderRadius: 14, textAlign: "center" }}>
                            <CheckCircle2 className="w-5 h-5" style={{ color: "#10B981", margin: "0 auto 6px" }} />
                            <p style={{ fontSize: 22, fontWeight: 800, color: "#10B981" }}>{attempt.totalCorrect}</p>
                            <p style={{ fontSize: 12, color: "#64748B" }}>Correct</p>
                        </div>
                        <div style={{ padding: "16px", background: "#FEF2F2", borderRadius: 14, textAlign: "center" }}>
                            <XCircle className="w-5 h-5" style={{ color: "#EF4444", margin: "0 auto 6px" }} />
                            <p style={{ fontSize: 22, fontWeight: 800, color: "#EF4444" }}>{attempt.totalWrong}</p>
                            <p style={{ fontSize: 12, color: "#64748B" }}>Wrong</p>
                        </div>
                        <div style={{ padding: "16px", background: "#F8FAFC", borderRadius: 14, textAlign: "center" }}>
                            <MinusCircle className="w-5 h-5" style={{ color: "#94A3B8", margin: "0 auto 6px" }} />
                            <p style={{ fontSize: 22, fontWeight: 800, color: "#64748B" }}>{attempt.totalSkipped}</p>
                            <p style={{ fontSize: 12, color: "#64748B" }}>Skipped</p>
                        </div>
                        <div style={{ padding: "16px", background: "#EEF2FF", borderRadius: 14, textAlign: "center" }}>
                            <BarChart3 className="w-5 h-5" style={{ color: "#4F46E5", margin: "0 auto 6px" }} />
                            <p style={{ fontSize: 22, fontWeight: 800, color: "#4F46E5" }}>{accuracy}%</p>
                            <p style={{ fontSize: 12, color: "#64748B" }}>Accuracy</p>
                        </div>
                        <div style={{ padding: "16px", background: "#FEF9C3", borderRadius: 14, textAlign: "center" }}>
                            <Clock className="w-5 h-5" style={{ color: "#CA8A04", margin: "0 auto 6px" }} />
                            <p style={{ fontSize: 22, fontWeight: 800, color: "#CA8A04" }}>{timeTaken}</p>
                            <p style={{ fontSize: 12, color: "#64748B" }}>Min Taken</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <button onClick={() => setShowReview(!showReview)} className="btn-secondary" style={{ flex: 1, justifyContent: "center", padding: "12px" }}>
                    {showReview ? "Hide Review" : "📝 Review Answers"}
                </button>
                <Link href={`/dashboard/mocktests/${testId}`} className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "12px", textDecoration: "none" }}>
                    <RotateCcw className="w-4 h-4" /> Retake Test
                </Link>
            </div>

            {/* Question Review */}
            {showReview && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {test.questions.map((q: any, idx: number) => {
                        const userAnswer = attempt.answers?.find((a: any) => a.questionIndex === idx);
                        const selected = userAnswer?.selectedAnswer;
                        const isCorrect = userAnswer?.isCorrect;
                        const isSkipped = selected === null || selected === undefined || selected === -1;
                        const letters = ["A", "B", "C", "D"];

                        return (
                            <div key={idx} style={{
                                background: "white", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden",
                            }}>
                                <div style={{
                                    padding: "14px 20px", borderBottom: "1px solid #F1F5F9",
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    background: isSkipped ? "#F8FAFC" : isCorrect ? "#F0FDF4" : "#FEF2F2",
                                }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Q{idx + 1}</span>
                                    <span style={{
                                        fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 50,
                                        background: isSkipped ? "#F1F5F9" : isCorrect ? "#DCFCE7" : "#FEE2E2",
                                        color: isSkipped ? "#94A3B8" : isCorrect ? "#16A34A" : "#DC2626",
                                    }}>
                                        {isSkipped ? "Skipped" : isCorrect ? "Correct ✓" : "Wrong ✗"}
                                    </span>
                                </div>
                                <div style={{ padding: "16px 20px" }}>
                                    <p style={{ fontSize: 15, color: "#1E293B", marginBottom: 14, lineHeight: 1.7, fontWeight: 500 }}>
                                        {q.questionText}
                                    </p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: q.explanation ? 14 : 0 }}>
                                        {q.options.map((opt: string, oi: number) => {
                                            const isUserPick = selected === oi;
                                            const isCorrectAnswer = q.correctAnswer === oi;
                                            let bg = "white"; let border = "#E2E8F0"; let color = "#475569";
                                            if (isCorrectAnswer) { bg = "#F0FDF4"; border = "#86EFAC"; color = "#166534"; }
                                            if (isUserPick && !isCorrect) { bg = "#FEF2F2"; border = "#FECACA"; color = "#991B1B"; }
                                            return (
                                                <div key={oi} style={{
                                                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                                                    borderRadius: 10, border: `1.5px solid ${border}`, background: bg,
                                                }}>
                                                    <span style={{ fontSize: 12, fontWeight: 700, color, width: 24 }}>{letters[oi]}.</span>
                                                    <span style={{ fontSize: 14, color }}>{opt}</span>
                                                    {isCorrectAnswer && <CheckCircle2 className="w-4 h-4" style={{ marginLeft: "auto", color: "#10B981" }} />}
                                                    {isUserPick && !isCorrect && <XCircle className="w-4 h-4" style={{ marginLeft: "auto", color: "#EF4444" }} />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {q.explanation && (
                                        <div style={{ padding: "12px 16px", background: "#F0F9FF", borderRadius: 10, border: "1px solid #BAE6FD", fontSize: 13, color: "#0369A1", lineHeight: 1.6, marginTop: 8 }}>
                                            <strong>Explanation:</strong> {q.explanation}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
