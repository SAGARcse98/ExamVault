"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, ChevronLeft, ChevronRight, Flag, Send, AlertTriangle, CheckCircle2, X } from "lucide-react";

export default function MockTestTakePage() {
    const params = useParams();
    const router = useRouter();
    const testId = params.id as string;

    const [test, setTest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [started, setStarted] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
    const [visited, setVisited] = useState<Set<number>>(new Set([0]));
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [questionTimes, setQuestionTimes] = useState<number[]>([]);
    const questionStartTime = useRef(Date.now());
    const timerRef = useRef<any>(null);

    useEffect(() => {
        fetch(`/api/mocktests/${testId}`)
            .then(r => r.json())
            .then(data => {
                setTest(data);
                setAnswers(new Array(data.questions?.length || 0).fill(null));
                setQuestionTimes(new Array(data.questions?.length || 0).fill(0));
                setTimeLeft(data.duration * 60);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [testId]);

    // Timer
    useEffect(() => {
        if (!started || timeLeft <= 0) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [started]);

    const trackTime = useCallback(() => {
        const elapsed = Math.round((Date.now() - questionStartTime.current) / 1000);
        setQuestionTimes(prev => {
            const updated = [...prev];
            updated[currentQ] = (updated[currentQ] || 0) + elapsed;
            return updated;
        });
        questionStartTime.current = Date.now();
    }, [currentQ]);

    const goToQuestion = (index: number) => {
        trackTime();
        setVisited(prev => new Set([...prev, index]));
        setCurrentQ(index);
    };

    const selectAnswer = (optionIndex: number) => {
        setAnswers(prev => {
            const updated = [...prev];
            updated[currentQ] = updated[currentQ] === optionIndex ? null : optionIndex;
            return updated;
        });
    };

    const toggleReview = () => {
        setMarkedForReview(prev => {
            const next = new Set(prev);
            next.has(currentQ) ? next.delete(currentQ) : next.add(currentQ);
            return next;
        });
    };

    const startTest = async () => {
        await fetch(`/api/mocktests/${testId}/attempt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "start" }),
        });
        questionStartTime.current = Date.now();
        setStarted(true);
    };

    const handleSubmit = async (autoSubmit = false) => {
        if (submitting) return;
        if (!autoSubmit) {
            setShowConfirm(true);
            return;
        }
        setSubmitting(true);
        trackTime();
        clearInterval(timerRef.current);

        const formattedAnswers = answers.map((ans, i) => ({
            questionIndex: i,
            selectedAnswer: ans === null ? -1 : ans,
            timeTaken: questionTimes[i] || 0,
        }));

        await fetch(`/api/mocktests/${testId}/attempt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "submit", answers: formattedAnswers }),
        });

        router.push(`/dashboard/mocktests/${testId}/results`);
    };

    const confirmSubmit = () => {
        setShowConfirm(false);
        handleSubmit(true);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <div className="animate-fade-in" style={{ padding: 40 }}>
                <div className="skeleton" style={{ height: 400, borderRadius: 20 }} />
            </div>
        );
    }

    if (!test || test.error) {
        return (
            <div style={{ textAlign: "center", padding: 60 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: "#374151" }}>Test not found</h3>
            </div>
        );
    }

    // Pre-test screen
    if (!started) {
        const answered = answers.filter(a => a !== null).length;
        return (
            <div className="animate-fade-in">
                <div style={{ maxWidth: 650, margin: "0 auto", padding: "0 8px" }}>
                    <div style={{
                        background: "white", borderRadius: 20, border: "1px solid #E2E8F0", overflow: "hidden",
                    }}>
                        <div style={{ height: 6, background: "linear-gradient(90deg, #4F46E5, #7C3AED, #EC4899)" }} />
                        <div style={{ padding: "32px 36px" }}>
                            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>{test.title}</h2>
                            {test.description && <p style={{ color: "#64748B", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>{test.description}</p>}

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 28 }}>
                                <div style={{ padding: "14px 18px", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0" }}>
                                    <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>Questions</p>
                                    <p style={{ fontSize: 20, fontWeight: 700, color: "#0F172A" }}>{test.totalQuestions}</p>
                                </div>
                                <div style={{ padding: "14px 18px", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0" }}>
                                    <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>Duration</p>
                                    <p style={{ fontSize: 20, fontWeight: 700, color: "#0F172A" }}>{test.duration} min</p>
                                </div>
                                <div style={{ padding: "14px 18px", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0" }}>
                                    <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>Total Marks</p>
                                    <p style={{ fontSize: 20, fontWeight: 700, color: "#0F172A" }}>{test.totalMarks}</p>
                                </div>
                                <div style={{ padding: "14px 18px", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0" }}>
                                    <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>Negative Marking</p>
                                    <p style={{ fontSize: 20, fontWeight: 700, color: "#EF4444" }}>-{test.negativeMarking}</p>
                                </div>
                            </div>

                            <div style={{ padding: 16, background: "#FEF9C3", borderRadius: 12, marginBottom: 24, fontSize: 13, color: "#92400E", lineHeight: 1.6 }}>
                                <strong>⚠ Instructions:</strong><br />
                                • Each question carries marks as shown. Wrong answers have negative marking.<br />
                                • You can navigate between questions and mark them for review.<br />
                                • Test auto-submits when time runs out.
                            </div>

                            <button onClick={startTest} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px 24px", fontSize: 16 }}>
                                Start Test →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const question = test.questions[currentQ];
    const totalQuestions = test.questions.length;
    const answeredCount = answers.filter(a => a !== null).length;
    const skippedCount = totalQuestions - answeredCount;
    const isUrgent = timeLeft < 60;

    return (
        <div className="animate-fade-in" style={{ position: "relative" }}>
            {/* Timer Bar */}
            <div style={{
                background: "white", borderRadius: 14, padding: "12px 20px", marginBottom: 16,
                border: `1px solid ${isUrgent ? "#FEE2E2" : "#E2E8F0"}`,
                display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
                position: "sticky", top: 64, zIndex: 20,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>
                        Q {currentQ + 1}/{totalQuestions}
                    </span>
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>
                        {answeredCount} answered · {skippedCount} remaining
                    </span>
                </div>
                <div style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 10,
                    background: isUrgent ? "#FEF2F2" : "#F8FAFC",
                    color: isUrgent ? "#DC2626" : "#0F172A",
                    fontWeight: 700, fontSize: 18, fontVariantNumeric: "tabular-nums",
                }}>
                    <Clock className="w-4 h-4" />
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="test-layout" style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 16, alignItems: "start" }}>
                {/* Question Area */}
                <div style={{ background: "white", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
                    <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                            Question {currentQ + 1}
                        </h3>
                        <span style={{ fontSize: 12, color: "#94A3B8" }}>
                            {question.marks} mark{question.marks > 1 ? "s" : ""}
                        </span>
                    </div>

                    <div style={{ padding: "24px" }}>
                        <p style={{ fontSize: 16, color: "#1E293B", lineHeight: 1.8, marginBottom: 24, fontWeight: 500 }}>
                            {question.questionText}
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {question.options.map((opt: string, idx: number) => {
                                const isSelected = answers[currentQ] === idx;
                                const letter = ["A", "B", "C", "D"][idx];
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => selectAnswer(idx)}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 14,
                                            padding: "14px 18px", borderRadius: 12,
                                            border: `2px solid ${isSelected ? "#4F46E5" : "#E2E8F0"}`,
                                            background: isSelected ? "#EEF2FF" : "white",
                                            cursor: "pointer", textAlign: "left",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        <span style={{
                                            width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 13, fontWeight: 700,
                                            background: isSelected ? "#4F46E5" : "#F1F5F9",
                                            color: isSelected ? "white" : "#64748B",
                                        }}>
                                            {letter}
                                        </span>
                                        <span style={{ fontSize: 15, color: "#1E293B", fontWeight: isSelected ? 600 : 400 }}>
                                            {opt}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom buttons */}
                    <div style={{ padding: "16px 24px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => goToQuestion(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
                                className="btn-secondary" style={{ fontSize: 13, padding: "8px 16px", opacity: currentQ === 0 ? 0.4 : 1 }}>
                                <ChevronLeft className="w-4 h-4" /> Previous
                            </button>
                            <button onClick={() => goToQuestion(Math.min(totalQuestions - 1, currentQ + 1))} disabled={currentQ === totalQuestions - 1}
                                className="btn-secondary" style={{ fontSize: 13, padding: "8px 16px", opacity: currentQ === totalQuestions - 1 ? 0.4 : 1 }}>
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={toggleReview} className="btn-secondary"
                                style={{ fontSize: 13, padding: "8px 16px", color: markedForReview.has(currentQ) ? "#F59E0B" : "#64748B" }}>
                                <Flag className="w-4 h-4" fill={markedForReview.has(currentQ) ? "#F59E0B" : "none"} />
                                {markedForReview.has(currentQ) ? "Marked" : "Mark for Review"}
                            </button>
                            <button onClick={() => handleSubmit(false)} className="btn-primary" style={{ fontSize: 13, padding: "8px 16px" }}>
                                <Send className="w-4 h-4" /> Submit
                            </button>
                        </div>
                    </div>
                </div>

                {/* Question Navigation Panel */}
                <div style={{ background: "white", borderRadius: 16, border: "1px solid #E2E8F0", padding: 16, position: "sticky", top: 130 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>Question Navigator</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 16 }}>
                        {test.questions.map((_: any, idx: number) => {
                            let bg = "#F1F5F9"; let color = "#64748B"; // not visited
                            if (answers[idx] !== null) { bg = "#10B981"; color = "white"; } // answered
                            else if (markedForReview.has(idx)) { bg = "#F59E0B"; color = "white"; } // marked
                            else if (visited.has(idx)) { bg = "#EF4444"; color = "white"; } // visited but not answered
                            if (idx === currentQ) { bg = "#4F46E5"; color = "white"; } // current
                            return (
                                <button key={idx} onClick={() => goToQuestion(idx)}
                                    style={{
                                        width: "100%", aspectRatio: "1", borderRadius: 8, border: "none",
                                        background: bg, color, fontSize: 12, fontWeight: 700, cursor: "pointer",
                                    }}>
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                    {/* Legend */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, color: "#64748B" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: "#4F46E5" }} /> Current</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: "#10B981" }} /> Answered</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: "#F59E0B" }} /> Marked for Review</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: "#EF4444" }} /> Not Answered</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: "#F1F5F9" }} /> Not Visited</div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
                }}>
                    <div style={{ background: "white", borderRadius: 20, padding: 32, maxWidth: 420, width: "90%", textAlign: "center" }}>
                        <AlertTriangle className="w-12 h-12" style={{ color: "#F59E0B", margin: "0 auto 16px" }} />
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Submit Test?</h3>
                        <p style={{ color: "#64748B", fontSize: 14, marginBottom: 8 }}>
                            You have answered <strong>{answeredCount}</strong> out of <strong>{totalQuestions}</strong> questions.
                        </p>
                        {skippedCount > 0 && (
                            <p style={{ color: "#EF4444", fontSize: 13, marginBottom: 20 }}>
                                {skippedCount} question{skippedCount > 1 ? "s" : ""} unanswered!
                            </p>
                        )}
                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                            <button onClick={() => setShowConfirm(false)} className="btn-secondary" style={{ padding: "10px 24px" }}>
                                <X className="w-4 h-4" /> Go Back
                            </button>
                            <button onClick={confirmSubmit} className="btn-primary" style={{ padding: "10px 24px" }} disabled={submitting}>
                                <CheckCircle2 className="w-4 h-4" /> {submitting ? "Submitting..." : "Confirm Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Responsive */}
            <style>{`
                @media (max-width: 768px) {
                    .test-layout {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
