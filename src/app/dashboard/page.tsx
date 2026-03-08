"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Video,
    FileText,
    Star,
    Calculator,
    Brain,
    BookOpen,
    ArrowRight,
    Sparkles,
    TrendingUp,
    Clock,
    ClipboardList,
    Target,
    Zap,
} from "lucide-react";

export default function DashboardPage() {
    const { data: session } = useSession();
    const [subjects, setSubjects] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [notes, setNotes] = useState<any[]>([]);
    const [mocktests, setMocktests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subRes, vidRes, noteRes, mockRes] = await Promise.all([
                    fetch("/api/subjects"),
                    fetch("/api/videos?important=true"),
                    fetch("/api/notes?important=true"),
                    fetch("/api/mocktests"),
                ]);
                const [subData, vidData, noteData, mockData] = await Promise.all([
                    subRes.json(),
                    vidRes.json(),
                    noteRes.json(),
                    mockRes.json(),
                ]);
                setSubjects(Array.isArray(subData) ? subData : []);
                setVideos(Array.isArray(vidData) ? vidData : []);
                setNotes(Array.isArray(noteData) ? noteData : []);
                setMocktests(Array.isArray(mockData) ? mockData : []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const quickTools = [
        { href: "/dashboard/calculator", label: "Calculator", icon: Calculator, gradient: "subject-card-4" },
        { href: "/dashboard/formulas", label: "Formulas", icon: Brain, gradient: "subject-card-3" },
        { href: "/dashboard/videos", label: "Videos", icon: Video, gradient: "subject-card-1" },
        { href: "/dashboard/notes", label: "Notes", icon: FileText, gradient: "subject-card-2" },
    ];

    const subjectGradients = ["subject-card-1", "subject-card-2", "subject-card-3", "subject-card-4", "subject-card-5"];

    return (
        <div className="animate-fade-in">
            {/* Welcome banner */}
            <div
                className="gradient-card"
                style={{
                    borderRadius: 20,
                    padding: "32px 36px",
                    marginBottom: 28,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <Sparkles className="w-5 h-5 text-amber-300" />
                        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600 }}>
                            Welcome back!
                        </span>
                    </div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 8 }}>
                        Hello, {session?.user?.name?.split(" ")[0] || "Student"} 👋
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>
                        Continue your preparation journey. You&apos;re making great progress!
                    </p>
                </div>
                {/* Decorative circle */}
                <div
                    style={{
                        position: "absolute",
                        right: -30,
                        top: -30,
                        width: 180,
                        height: 180,
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: "50%",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        right: 60,
                        bottom: -40,
                        width: 120,
                        height: 120,
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "50%",
                    }}
                />
            </div>

            {/* Quick Tools */}
            <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                    <TrendingUp className="w-5 h-5 text-primary" /> Quick Tools
                </h3>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                        gap: 14,
                    }}
                >
                    {quickTools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                className="card-hover"
                                style={{
                                    background: "white",
                                    borderRadius: 16,
                                    padding: 20,
                                    textDecoration: "none",
                                    textAlign: "center",
                                    border: "1px solid #E2E8F0",
                                }}
                            >
                                <div
                                    className={tool.gradient}
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 14,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        margin: "0 auto 12px",
                                    }}
                                >
                                    <Icon className="w-6 h-6" />
                                </div>
                                <p style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{tool.label}</p>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Important Notes */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                        <FileText className="w-5 h-5 text-red-500" /> Important Notes (PDFs)
                    </h3>
                    <Link href="/dashboard/notes" style={{ fontSize: 13, fontWeight: 600, color: "#4F46E5", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                {loading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton" style={{ height: 180, borderRadius: 16 }} />
                        ))}
                    </div>
                ) : notes.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                        {notes.slice(0, 6).map((note: any) => (
                            <a
                                key={note._id}
                                href={note.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="card-hover"
                                style={{
                                    background: "white",
                                    borderRadius: 16,
                                    overflow: "hidden",
                                    textDecoration: "none",
                                    border: "1px solid #E2E8F0",
                                }}
                            >
                                <div
                                    style={{
                                        background: "linear-gradient(135deg, #EF4444, #B91C1C)",
                                        height: 100,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <FileText className="w-10 h-10 text-white" style={{ opacity: 0.9 }} />
                                </div>
                                <div style={{ padding: 16 }}>
                                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                                        {note.isImportant && <span className="badge-important">Important</span>}
                                    </div>
                                    <h4 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>
                                        {note.title}
                                    </h4>
                                    <p style={{ fontSize: 12, color: "#94A3B8" }}>
                                        {note.subjectId?.name || "General"}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div
                        style={{
                            background: "white",
                            borderRadius: 16,
                            padding: 40,
                            textAlign: "center",
                            border: "1px solid #E2E8F0",
                        }}
                    >
                        <FileText className="w-12 h-12" style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
                        <p style={{ color: "#94A3B8", fontSize: 15 }}>No important notes yet. Check back later!</p>
                    </div>
                )}
            </div>

            {/* Important Videos */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                        <Star className="w-5 h-5 text-amber-500" /> Important Videos
                    </h3>
                    <Link href="/dashboard/videos" style={{ fontSize: 13, fontWeight: 600, color: "#4F46E5", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                {loading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton" style={{ height: 180, borderRadius: 16 }} />
                        ))}
                    </div>
                ) : videos.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                        {videos.slice(0, 6).map((video: any) => (
                            <Link
                                key={video._id}
                                href={`/dashboard/videos/${video._id}`}
                                className="card-hover"
                                style={{
                                    background: "white",
                                    borderRadius: 16,
                                    overflow: "hidden",
                                    textDecoration: "none",
                                    border: "1px solid #E2E8F0",
                                }}
                            >
                                <div
                                    className="gradient-primary"
                                    style={{
                                        height: 100,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Video className="w-10 h-10 text-white" style={{ opacity: 0.7 }} />
                                </div>
                                <div style={{ padding: 16 }}>
                                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                                        {video.isImportant && <span className="badge-important">Important</span>}
                                        {video.duration && (
                                            <span style={{ fontSize: 12, color: "#94A3B8", display: "flex", alignItems: "center", gap: 4 }}>
                                                <Clock className="w-3 h-3" /> {video.duration}
                                            </span>
                                        )}
                                    </div>
                                    <h4 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>
                                        {video.title}
                                    </h4>
                                    <p style={{ fontSize: 12, color: "#94A3B8" }}>
                                        {video.subjectId?.name || "General"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div
                        style={{
                            background: "white",
                            borderRadius: 16,
                            padding: 40,
                            textAlign: "center",
                            border: "1px solid #E2E8F0",
                        }}
                    >
                        <Video className="w-12 h-12" style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
                        <p style={{ color: "#94A3B8", fontSize: 15 }}>No important videos yet. Check back later!</p>
                    </div>
                )}
            </div>

            {/* Subjects Grid */}
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                        <BookOpen className="w-5 h-5 text-primary" /> Subjects
                    </h3>
                    <Link href="/dashboard/subjects" style={{ fontSize: 13, fontWeight: 600, color: "#4F46E5", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                {loading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }} />
                        ))}
                    </div>
                ) : subjects.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                        {subjects.map((subject: any, i: number) => (
                            <Link
                                key={subject._id}
                                href={`/dashboard/subjects/${subject.slug}`}
                                className={`${subjectGradients[i % 5]} card-hover`}
                                style={{
                                    borderRadius: 16,
                                    padding: 24,
                                    textDecoration: "none",
                                    color: "white",
                                    position: "relative",
                                    overflow: "hidden",
                                    minHeight: 120,
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        right: -20,
                                        bottom: -20,
                                        width: 100,
                                        height: 100,
                                        background: "rgba(255,255,255,0.1)",
                                        borderRadius: "50%",
                                    }}
                                />
                                <BookOpen className="w-8 h-8" style={{ marginBottom: 12, opacity: 0.9 }} />
                                <h4 style={{ fontSize: 17, fontWeight: 700 }}>{subject.name}</h4>
                                {subject.description && (
                                    <p style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{subject.description}</p>
                                )}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div
                        style={{
                            background: "white",
                            borderRadius: 16,
                            padding: 40,
                            textAlign: "center",
                            border: "1px solid #E2E8F0",
                        }}
                    >
                        <BookOpen className="w-12 h-12" style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
                        <p style={{ color: "#94A3B8", fontSize: 15 }}>No subjects added yet. Ask admin to add subjects.</p>
                    </div>
                )}
            </div>

            {/* Mock Tests Section */}
            <div style={{ marginTop: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                        <ClipboardList className="w-5 h-5 text-primary" /> Mock Tests
                    </h3>
                    <Link href="/dashboard/mocktests" style={{ fontSize: 13, fontWeight: 600, color: "#4F46E5", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                {loading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="skeleton" style={{ height: 150, borderRadius: 16 }} />
                        ))}
                    </div>
                ) : mocktests.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                        {mocktests.map((test: any, idx: number) => {
                            const gradients = [
                                "linear-gradient(135deg, #4F46E5, #7C3AED)",
                                "linear-gradient(135deg, #0EA5E9, #6366F1)",
                                "linear-gradient(135deg, #10B981, #06B6D4)",
                                "linear-gradient(135deg, #F59E0B, #EF4444)",
                                "linear-gradient(135deg, #EC4899, #8B5CF6)",
                            ];
                            const icons = ["📐", "🧩", "📝", "🌍", "💻"];
                            const attempted = !!test.lastAttempt;
                            return (
                                <Link
                                    key={test._id}
                                    href={attempted ? `/dashboard/mocktests/${test._id}/results` : `/dashboard/mocktests/${test._id}`}
                                    className="card-hover"
                                    style={{
                                        background: gradients[idx % 5],
                                        borderRadius: 16, padding: 20, textDecoration: "none",
                                        color: "white", position: "relative", overflow: "hidden",
                                        minHeight: 150, display: "flex", flexDirection: "column",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    {/* Decorative circle */}
                                    <div style={{
                                        position: "absolute", right: -20, bottom: -20,
                                        width: 100, height: 100,
                                        background: "rgba(255,255,255,0.1)", borderRadius: "50%",
                                    }} />
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                            <span style={{ fontSize: 24 }}>{icons[idx % 5]}</span>
                                            <h4 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{test.title}</h4>
                                        </div>
                                        <div style={{ display: "flex", gap: 10, fontSize: 12, opacity: 0.85, marginBottom: 6 }}>
                                            <span>{test.totalQuestions} Qs</span>
                                            <span>·</span>
                                            <span>{test.duration} min</span>
                                            <span>·</span>
                                            <span>{test.totalMarks} marks</span>
                                        </div>
                                    </div>
                                    {attempted ? (
                                        <div style={{
                                            padding: "6px 12px", background: "rgba(255,255,255,0.2)",
                                            borderRadius: 8, fontSize: 13, fontWeight: 700,
                                            textAlign: "center", marginTop: 6,
                                        }}>
                                            ✓ Score: {test.lastAttempt.score}/{test.totalMarks}
                                        </div>
                                    ) : (
                                        <div style={{
                                            padding: "6px 12px", background: "rgba(255,255,255,0.15)",
                                            borderRadius: 8, fontSize: 12, fontWeight: 600,
                                            textAlign: "center", marginTop: 6,
                                            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                                        }}>
                                            <Zap className="w-3.5 h-3.5" /> Start Test
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ background: "white", borderRadius: 16, padding: 40, textAlign: "center", border: "1px solid #E2E8F0" }}>
                        <ClipboardList className="w-12 h-12" style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
                        <p style={{ color: "#94A3B8", fontSize: 15 }}>No mock tests available yet. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
