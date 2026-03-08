"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, Clock, Target, Trophy, Search, Zap, ArrowRight } from "lucide-react";

export default function MockTestsPage() {
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");

    useEffect(() => {
        fetch("/api/mocktests")
            .then(r => r.json())
            .then(testData => {
                setTests(Array.isArray(testData) ? testData : []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = tests.filter(t => {
        const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.description?.toLowerCase().includes(search.toLowerCase());
        const matchDifficulty = !selectedDifficulty || t.difficulty === selectedDifficulty;
        return matchSearch && matchDifficulty;
    });

    const difficultyInfo: any = {
        easy: { bg: "#F0FDF4", color: "#16A34A", label: "Easy" },
        medium: { bg: "#FEF9C3", color: "#CA8A04", label: "Medium" },
        hard: { bg: "#FEF2F2", color: "#DC2626", label: "Hard" },
    };

    const gradients = [
        "linear-gradient(135deg, #4F46E5, #7C3AED)",
        "linear-gradient(135deg, #0EA5E9, #6366F1)",
        "linear-gradient(135deg, #10B981, #06B6D4)",
        "linear-gradient(135deg, #F59E0B, #EF4444)",
        "linear-gradient(135deg, #EC4899, #8B5CF6)",
    ];
    const icons = ["📐", "🧩", "📝", "🌍", "💻"];

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #7C3AED, #EC4899)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ClipboardList className="w-5 h-5 text-white" />
                    </div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A" }}>
                        Mock Tests
                    </h2>
                </div>
                <p style={{ color: "#64748B", fontSize: 15 }}>
                    Practice with timed mock tests to prepare for your exams
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
                <div style={{ background: "white", borderRadius: 14, padding: "16px 20px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #4F46E5, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ClipboardList className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{tests.length}</p>
                        <p style={{ fontSize: 12, color: "#94A3B8" }}>Total Tests</p>
                    </div>
                </div>
                <div style={{ background: "white", borderRadius: 14, padding: "16px 20px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #10B981, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{tests.filter(t => t.lastAttempt).length}</p>
                        <p style={{ fontSize: 12, color: "#94A3B8" }}>Attempted</p>
                    </div>
                </div>
                <div style={{ background: "white", borderRadius: 14, padding: "16px 20px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #F59E0B, #EF4444)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{tests.filter(t => !t.lastAttempt).length}</p>
                        <p style={{ fontSize: 12, color: "#94A3B8" }}>Pending</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: "1 1 250px" }}>
                    <Search className="w-4 h-4" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: "100%", padding: "10px 14px 10px 40px", borderRadius: 12,
                            border: "1px solid #E2E8F0", background: "white", fontSize: 14,
                            color: "#0F172A", outline: "none", boxSizing: "border-box",
                        }}
                        placeholder="Search tests..."
                        id="search-tests"
                    />
                </div>
                <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    style={{
                        padding: "10px 14px", borderRadius: 12, border: "1px solid #E2E8F0",
                        background: "white", fontSize: 14, color: "#0F172A", outline: "none",
                        cursor: "pointer", minWidth: 140,
                    }}
                >
                    <option value="">All Levels</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>

            {/* Test Cards */}
            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="skeleton" style={{ height: 260, borderRadius: 20 }} />
                    ))}
                </div>
            ) : filtered.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
                    {filtered.map((test: any, idx: number) => {
                        const d = difficultyInfo[test.difficulty] || difficultyInfo.medium;
                        const attempted = !!test.lastAttempt;
                        return (
                            <div
                                key={test._id}
                                className="card-hover"
                                style={{
                                    background: "white", borderRadius: 20, overflow: "hidden",
                                    border: "1px solid #E2E8F0", position: "relative",
                                }}
                            >
                                {/* Gradient header */}
                                <div style={{
                                    background: gradients[idx % 5], padding: "20px 24px",
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <span style={{ fontSize: 28 }}>{icons[idx % 5]}</span>
                                        <div>
                                            <h4 style={{ fontSize: 17, fontWeight: 700, color: "white", marginBottom: 2 }}>{test.title}</h4>
                                            <span style={{
                                                fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 50,
                                                background: "rgba(255,255,255,0.2)", color: "white",
                                            }}>
                                                {d.label}
                                            </span>
                                        </div>
                                    </div>
                                    {attempted && (
                                        <div style={{
                                            width: 48, height: 48, borderRadius: "50%",
                                            background: "rgba(255,255,255,0.2)", display: "flex",
                                            alignItems: "center", justifyContent: "center",
                                            fontSize: 14, fontWeight: 800, color: "white",
                                        }}>
                                            {Math.round((test.lastAttempt.score / test.totalMarks) * 100)}%
                                        </div>
                                    )}
                                </div>

                                <div style={{ padding: "20px 24px" }}>
                                    {test.description && (
                                        <p style={{
                                            fontSize: 13, color: "#64748B", marginBottom: 16, lineHeight: 1.5,
                                            display: "-webkit-box", WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical", overflow: "hidden",
                                        }}>
                                            {test.description}
                                        </p>
                                    )}

                                    {/* Stats row */}
                                    <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
                                        <div style={{
                                            display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
                                            background: "#F8FAFC", borderRadius: 8, fontSize: 12,
                                            color: "#475569", fontWeight: 600,
                                        }}>
                                            <ClipboardList className="w-3.5 h-3.5" style={{ color: "#4F46E5" }} />
                                            {test.totalQuestions} Questions
                                        </div>
                                        <div style={{
                                            display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
                                            background: "#F8FAFC", borderRadius: 8, fontSize: 12,
                                            color: "#475569", fontWeight: 600,
                                        }}>
                                            <Clock className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />
                                            {test.duration} min
                                        </div>
                                        <div style={{
                                            display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
                                            background: "#F8FAFC", borderRadius: 8, fontSize: 12,
                                            color: "#475569", fontWeight: 600,
                                        }}>
                                            <Target className="w-3.5 h-3.5" style={{ color: "#10B981" }} />
                                            {test.totalMarks} Marks
                                        </div>
                                        {test.subjectId?.name && (
                                            <div style={{
                                                display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
                                                background: "#F8FAFC", borderRadius: 8, fontSize: 12,
                                                color: "#475569", fontWeight: 600,
                                            }}>
                                                {test.subjectId.name}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action */}
                                    {attempted ? (
                                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                            <div style={{
                                                flex: 1, padding: "10px 14px", background: "#F0FDF4",
                                                borderRadius: 10, fontSize: 14, color: "#16A34A", fontWeight: 700,
                                                border: "1px solid #BBF7D0", textAlign: "center",
                                            }}>
                                                ✓ Score: {test.lastAttempt.score}/{test.totalMarks}
                                            </div>
                                            <Link href={`/dashboard/mocktests/${test._id}/results`} className="btn-secondary" style={{ fontSize: 12, padding: "10px 14px", textDecoration: "none" }}>
                                                Review
                                            </Link>
                                            <Link href={`/dashboard/mocktests/${test._id}`} className="btn-primary" style={{ fontSize: 12, padding: "10px 14px", textDecoration: "none" }}>
                                                Retake
                                            </Link>
                                        </div>
                                    ) : (
                                        <Link href={`/dashboard/mocktests/${test._id}`} className="btn-primary" style={{
                                            width: "100%", justifyContent: "center", textDecoration: "none",
                                            fontSize: 14, padding: "12px 20px", borderRadius: 12,
                                        }}>
                                            <Zap className="w-4 h-4" /> Start Test <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ background: "white", borderRadius: 20, padding: 60, textAlign: "center", border: "1px solid #E2E8F0" }}>
                    <ClipboardList className="w-16 h-16" style={{ color: "#CBD5E1", margin: "0 auto 16px" }} />
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#374151", marginBottom: 8 }}>No Mock Tests Found</h3>
                    <p style={{ color: "#94A3B8" }}>
                        {search ? "Try a different search term." : "Mock tests will appear once the admin creates them."}
                    </p>
                </div>
            )}
        </div>
    );
}
