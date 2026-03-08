"use client";

import { useEffect, useState } from "react";
import { Users, Video, FileText, Brain, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        subjects: 0,
        videos: 0,
        notes: 0,
        formulas: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [subRes, vidRes, noteRes, formRes] = await Promise.all([
                    fetch("/api/subjects"),
                    fetch("/api/videos"),
                    fetch("/api/notes"),
                    fetch("/api/formulas"),
                ]);
                const [subjects, videos, notes, formulas] = await Promise.all([
                    subRes.json(),
                    vidRes.json(),
                    noteRes.json(),
                    formRes.json(),
                ]);
                setStats({
                    subjects: Array.isArray(subjects) ? subjects.length : 0,
                    videos: Array.isArray(videos) ? videos.length : 0,
                    notes: Array.isArray(notes) ? notes.length : 0,
                    formulas: Array.isArray(formulas) ? formulas.length : 0,
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: "Subjects", value: stats.subjects, icon: TrendingUp, gradient: "subject-card-1" },
        { label: "Videos", value: stats.videos, icon: Video, gradient: "subject-card-2" },
        { label: "Notes & PDFs", value: stats.notes, icon: FileText, gradient: "subject-card-3" },
        { label: "Formulas", value: stats.formulas, icon: Brain, gradient: "subject-card-4" },
    ];

    return (
        <div className="animate-fade-in">
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 24 }}>
                Admin Dashboard
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 32 }}>
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className={`${card.gradient} card-hover`}
                            style={{
                                borderRadius: 16,
                                padding: 24,
                                color: "white",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            <Icon className="w-8 h-8" style={{ opacity: 0.8, marginBottom: 12 }} />
                            <p style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>
                                {loading ? "—" : card.value}
                            </p>
                            <p style={{ fontSize: 14, fontWeight: 600, opacity: 0.85 }}>{card.label}</p>
                            <div style={{ position: "absolute", right: -20, bottom: -20, width: 100, height: 100, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
                        </div>
                    );
                })}
            </div>

            <div style={{ background: "white", borderRadius: 16, padding: 32, border: "1px solid #E2E8F0" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Quick Guide</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                    {[
                        { step: "1", title: "Add Subjects", desc: "Create subjects like Quant, Reasoning, English" },
                        { step: "2", title: "Add Topics", desc: "Add topics under each subject for organization" },
                        { step: "3", title: "Upload Content", desc: "Add video URLs, PDF links, and formulas" },
                        { step: "4", title: "Manage Content", desc: "Edit, delete, or mark content as important" },
                    ].map((item) => (
                        <div key={item.step} style={{ display: "flex", gap: 14, alignItems: "start" }}>
                            <div
                                className="gradient-primary"
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 10,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontWeight: 700,
                                    fontSize: 14,
                                    flexShrink: 0,
                                }}
                            >
                                {item.step}
                            </div>
                            <div>
                                <h4 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>{item.title}</h4>
                                <p style={{ fontSize: 13, color: "#64748B" }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
