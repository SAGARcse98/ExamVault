"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Video, FileText, ArrowRight } from "lucide-react";

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/subjects")
            .then((r) => r.json())
            .then((data) => setSubjects(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const gradients = ["subject-card-1", "subject-card-2", "subject-card-3", "subject-card-4", "subject-card-5"];
    const icons = ["📐", "🧠", "📝", "🌍", "💻"];

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
                    All Subjects
                </h2>
                <p style={{ color: "#64748B", fontSize: 15 }}>
                    Choose a subject to explore topics, videos, and notes
                </p>
            </div>

            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="skeleton" style={{ height: 180, borderRadius: 20 }} />
                    ))}
                </div>
            ) : subjects.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                    {subjects.map((subject, i) => (
                        <Link
                            key={subject._id}
                            href={`/dashboard/subjects/${subject.slug}`}
                            className={`${gradients[i % 5]} card-hover`}
                            style={{
                                borderRadius: 20,
                                padding: 32,
                                textDecoration: "none",
                                color: "white",
                                position: "relative",
                                overflow: "hidden",
                                minHeight: 180,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <div>
                                <span style={{ fontSize: 40, display: "block", marginBottom: 16 }}>
                                    {icons[i % icons.length]}
                                </span>
                                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{subject.name}</h3>
                                {subject.description && (
                                    <p style={{ fontSize: 14, opacity: 0.85 }}>{subject.description}</p>
                                )}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16, fontSize: 13, fontWeight: 600, opacity: 0.9 }}>
                                Explore <ArrowRight className="w-4 h-4" />
                            </div>
                            <div
                                style={{
                                    position: "absolute",
                                    right: -30,
                                    bottom: -30,
                                    width: 140,
                                    height: 140,
                                    background: "rgba(255,255,255,0.08)",
                                    borderRadius: "50%",
                                }}
                            />
                        </Link>
                    ))}
                </div>
            ) : (
                <div style={{ background: "white", borderRadius: 20, padding: 60, textAlign: "center", border: "1px solid #E2E8F0" }}>
                    <BookOpen className="w-16 h-16" style={{ color: "#CBD5E1", margin: "0 auto 16px" }} />
                    <h3 style={{ fontSize: 20, fontWeight: 600, color: "#374151", marginBottom: 8 }}>No Subjects Yet</h3>
                    <p style={{ color: "#94A3B8" }}>Subjects will appear here once the admin adds them.</p>
                </div>
            )}
        </div>
    );
}
