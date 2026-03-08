"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Video, FileText, BookOpen, Brain, ArrowRight, Hash } from "lucide-react";

export default function SubjectDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [subject, setSubject] = useState<any>(null);
    const [topics, setTopics] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const subRes = await fetch("/api/subjects");
                const allSubjects = await subRes.json();
                const sub = Array.isArray(allSubjects) ? allSubjects.find((s: any) => s.slug === slug) : null;
                if (!sub) return;
                setSubject(sub);

                const [topicRes, videoRes, noteRes] = await Promise.all([
                    fetch(`/api/topics?subjectId=${sub._id}`),
                    fetch(`/api/videos?subjectId=${sub._id}`),
                    fetch(`/api/notes?subjectId=${sub._id}`),
                ]);
                const [topicData, videoData, noteData] = await Promise.all([
                    topicRes.json(),
                    videoRes.json(),
                    noteRes.json(),
                ]);
                setTopics(Array.isArray(topicData) ? topicData : []);
                setVideos(Array.isArray(videoData) ? videoData : []);
                setNotes(Array.isArray(noteData) ? noteData : []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="animate-fade-in">
                <div className="skeleton" style={{ height: 120, borderRadius: 20, marginBottom: 24 }} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton" style={{ height: 150, borderRadius: 16 }} />
                    ))}
                </div>
            </div>
        );
    }

    if (!subject) {
        return (
            <div style={{ textAlign: "center", padding: 60 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: "#374151" }}>Subject not found</h3>
                <Link href="/dashboard/subjects" style={{ color: "#4F46E5", fontWeight: 600, textDecoration: "none" }}>
                    ← Back to Subjects
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
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
                    <Link href="/dashboard/subjects" style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, textDecoration: "none", marginBottom: 8, display: "inline-block" }}>
                        ← Back to Subjects
                    </Link>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 8 }}>
                        {subject.name}
                    </h2>
                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                            <Hash className="w-4 h-4" /> {topics.length} Topics
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                            <Video className="w-4 h-4" /> {videos.length} Videos
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                            <FileText className="w-4 h-4" /> {notes.length} Notes
                        </span>
                    </div>
                </div>
                <div style={{ position: "absolute", right: -20, top: -20, width: 160, height: 160, background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
            </div>

            {/* Topics */}
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "#0F172A" }}>Topics</h3>
            {topics.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 32 }}>
                    {topics.map((topic: any) => {
                        const topicVideos = videos.filter((v: any) => v.topicId?._id === topic._id || v.topicId === topic._id);
                        const topicNotes = notes.filter((n: any) => n.topicId?._id === topic._id || n.topicId === topic._id);
                        return (
                            <div
                                key={topic._id}
                                className="card-hover"
                                style={{
                                    background: "white",
                                    borderRadius: 16,
                                    padding: 24,
                                    border: "1px solid #E2E8F0",
                                }}
                            >
                                <h4 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>
                                    {topic.name}
                                </h4>
                                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                                    <span style={{ fontSize: 13, color: "#64748B", display: "flex", alignItems: "center", gap: 4 }}>
                                        <Video className="w-4 h-4 text-primary" /> {topicVideos.length} videos
                                    </span>
                                    <span style={{ fontSize: 13, color: "#64748B", display: "flex", alignItems: "center", gap: 4 }}>
                                        <FileText className="w-4 h-4 text-secondary" /> {topicNotes.length} notes
                                    </span>
                                </div>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    {topicVideos.length > 0 && (
                                        <Link
                                            href={`/dashboard/videos?topicId=${topic._id}`}
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: "#4F46E5",
                                                textDecoration: "none",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 4,
                                                padding: "6px 12px",
                                                background: "#EEF2FF",
                                                borderRadius: 8,
                                            }}
                                        >
                                            Watch Videos <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    )}
                                    {topicNotes.length > 0 && (
                                        <Link
                                            href={`/dashboard/notes?topicId=${topic._id}`}
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: "#06B6D4",
                                                textDecoration: "none",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 4,
                                                padding: "6px 12px",
                                                background: "#ECFEFF",
                                                borderRadius: 8,
                                            }}
                                        >
                                            View Notes <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ background: "white", borderRadius: 16, padding: 40, textAlign: "center", border: "1px solid #E2E8F0", marginBottom: 32 }}>
                    <p style={{ color: "#94A3B8" }}>No topics added for this subject yet.</p>
                </div>
            )}
        </div>
    );
}
