"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Video, FileText, Clock, Download, ExternalLink } from "lucide-react";

export default function FavoritesPage() {
    const [user, setUser] = useState<any>(null);
    const [videos, setVideos] = useState<any[]>([]);
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"videos" | "notes">("videos");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, videoRes, noteRes] = await Promise.all([
                    fetch("/api/users"),
                    fetch("/api/videos"),
                    fetch("/api/notes"),
                ]);
                const [userData, videoData, noteData] = await Promise.all([
                    userRes.json(),
                    videoRes.json(),
                    noteRes.json(),
                ]);
                setUser(userData);
                setVideos(Array.isArray(videoData) ? videoData : []);
                setNotes(Array.isArray(noteData) ? noteData : []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleFavorite = async (itemId: string) => {
        await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "toggleFavorite", itemId }),
        });
        const res = await fetch("/api/users");
        setUser(await res.json());
    };

    const favoriteVideos = videos.filter((v) => user?.favorites?.includes(v._id));
    const favoriteNotes = notes.filter((n) => user?.favorites?.includes(n._id));

    const tabs = [
        { key: "videos", label: "Videos", icon: Video, count: favoriteVideos.length },
        { key: "notes", label: "Notes", icon: FileText, count: favoriteNotes.length },
    ];

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
                    <Star className="w-6 h-6 inline text-amber-500" style={{ marginRight: 8 }} />
                    Favorites
                </h2>
                <p style={{ color: "#64748B", fontSize: 15 }}>
                    Your bookmarked videos and notes in one place
                </p>
            </div>

            {/* Tabs */}
            <div
                style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 24,
                    background: "white",
                    padding: 6,
                    borderRadius: 14,
                    border: "1px solid #E2E8F0",
                    width: "fit-content",
                }}
            >
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            style={{
                                padding: "10px 20px",
                                borderRadius: 10,
                                border: "none",
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: 14,
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                background: activeTab === tab.key ? "#4F46E5" : "transparent",
                                color: activeTab === tab.key ? "white" : "#64748B",
                                transition: "all 0.2s",
                            }}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                            <span
                                style={{
                                    fontSize: 12,
                                    padding: "2px 8px",
                                    borderRadius: 50,
                                    background: activeTab === tab.key ? "rgba(255,255,255,0.2)" : "#F1F5F9",
                                }}
                            >
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />
                    ))}
                </div>
            ) : (
                <>
                    {/* Videos Tab */}
                    {activeTab === "videos" && (
                        favoriteVideos.length > 0 ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                                {favoriteVideos.map((video) => (
                                    <div key={video._id} className="card-hover" style={{ background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid #E2E8F0" }}>
                                        <Link href={`/dashboard/videos/${video._id}`} style={{ textDecoration: "none" }}>
                                            <div className="gradient-primary" style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Video className="w-10 h-10 text-white" style={{ opacity: 0.6 }} />
                                            </div>
                                        </Link>
                                        <div style={{ padding: 16 }}>
                                            <Link href={`/dashboard/videos/${video._id}`} style={{ textDecoration: "none" }}>
                                                <h4 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>{video.title}</h4>
                                            </Link>
                                            <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 12 }}>
                                                {video.subjectId?.name || "General"}
                                                {video.duration && <> · {video.duration}</>}
                                            </p>
                                            <button onClick={() => toggleFavorite(video._id)} className="btn-icon" style={{ color: "#F59E0B" }}>
                                                <Star className="w-5 h-5" fill="#F59E0B" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ background: "white", borderRadius: 16, padding: 60, textAlign: "center", border: "1px solid #E2E8F0" }}>
                                <Video className="w-14 h-14" style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
                                <p style={{ color: "#94A3B8" }}>No favorite videos yet. Star videos you like!</p>
                            </div>
                        )
                    )}

                    {/* Notes Tab */}
                    {activeTab === "notes" && (
                        favoriteNotes.length > 0 ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                                {favoriteNotes.map((note) => (
                                    <div key={note._id} className="card-hover" style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #E2E8F0" }}>
                                        <div style={{ display: "flex", alignItems: "start", gap: 14 }}>
                                            <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #06B6D4, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <FileText className="w-6 h-6 text-white" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>{note.title}</h4>
                                                <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 12 }}>{note.subjectId?.name || "General"}</p>
                                                <div style={{ display: "flex", gap: 8 }}>
                                                    <a href={note.pdfUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ fontSize: 11, padding: "4px 10px" }}>
                                                        <ExternalLink className="w-3 h-3" /> View
                                                    </a>
                                                    <button onClick={() => toggleFavorite(note._id)} className="btn-icon" style={{ color: "#F59E0B" }}>
                                                        <Star className="w-4 h-4" fill="#F59E0B" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ background: "white", borderRadius: 16, padding: 60, textAlign: "center", border: "1px solid #E2E8F0" }}>
                                <FileText className="w-14 h-14" style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
                                <p style={{ color: "#94A3B8" }}>No favorite notes yet. Star notes you like!</p>
                            </div>
                        )
                    )}
                </>
            )}
        </div>
    );
}
