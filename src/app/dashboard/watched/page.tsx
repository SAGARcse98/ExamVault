"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Video, CheckCircle, Clock, BarChart3 } from "lucide-react";

export default function WatchedPage() {
    const [user, setUser] = useState<any>(null);
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, videoRes] = await Promise.all([
                    fetch("/api/users"),
                    fetch("/api/videos"),
                ]);
                const [userData, videoData] = await Promise.all([
                    userRes.json(),
                    videoRes.json(),
                ]);
                setUser(userData);
                setVideos(Array.isArray(videoData) ? videoData : []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const watchedVideos = videos.filter((v) => user?.watchedVideos?.includes(v._id));
    const totalVideos = videos.length;
    const progressPercent = totalVideos > 0 ? Math.round((watchedVideos.length / totalVideos) * 100) : 0;

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
                    Watch History
                </h2>
                <p style={{ color: "#64748B", fontSize: 15 }}>Track your progress and continue watching</p>
            </div>

            {/* Progress card */}
            <div
                className="gradient-card"
                style={{
                    borderRadius: 20,
                    padding: 28,
                    marginBottom: 28,
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <BarChart3 className="w-5 h-5" />
                        <span style={{ fontSize: 14, fontWeight: 600 }}>Your Progress</span>
                    </div>
                    <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 16 }}>
                        <div>
                            <p style={{ fontSize: 36, fontWeight: 800 }}>{watchedVideos.length}</p>
                            <p style={{ fontSize: 13, opacity: 0.8 }}>Videos Watched</p>
                        </div>
                        <div>
                            <p style={{ fontSize: 36, fontWeight: 800 }}>{totalVideos}</p>
                            <p style={{ fontSize: 13, opacity: 0.8 }}>Total Videos</p>
                        </div>
                        <div>
                            <p style={{ fontSize: 36, fontWeight: 800 }}>{progressPercent}%</p>
                            <p style={{ fontSize: 13, opacity: 0.8 }}>Completed</p>
                        </div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 50, height: 10, overflow: "hidden" }}>
                        <div
                            style={{
                                width: `${progressPercent}%`,
                                height: "100%",
                                background: "rgba(255,255,255,0.8)",
                                borderRadius: 50,
                                transition: "width 1s ease",
                            }}
                        />
                    </div>
                </div>
                <div style={{ position: "absolute", right: -20, top: -20, width: 140, height: 140, background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
            </div>

            {/* Watched videos list */}
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#0F172A" }}>
                Watched Videos
            </h3>
            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14 }} />
                    ))}
                </div>
            ) : watchedVideos.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {watchedVideos.map((video) => (
                        <Link
                            key={video._id}
                            href={`/dashboard/videos/${video._id}`}
                            className="card-hover"
                            style={{
                                background: "white",
                                borderRadius: 14,
                                padding: 18,
                                textDecoration: "none",
                                border: "1px solid #E2E8F0",
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                            }}
                        >
                            <div
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 12,
                                    background: "linear-gradient(135deg, #10B981, #06B6D4)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>
                                    {video.title}
                                </h4>
                                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#94A3B8" }}>
                                    <span>{video.subjectId?.name || "General"}</span>
                                    {video.duration && (
                                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                            <Clock className="w-3 h-3" /> {video.duration}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <span className="badge-watched">✓ Completed</span>
                        </Link>
                    ))}
                </div>
            ) : (
                <div style={{ background: "white", borderRadius: 16, padding: 60, textAlign: "center", border: "1px solid #E2E8F0" }}>
                    <Eye className="w-14 h-14" style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#374151", marginBottom: 8 }}>No Watched Videos</h3>
                    <p style={{ color: "#94A3B8" }}>Start watching videos to track your progress here.</p>
                    <Link
                        href="/dashboard/videos"
                        className="btn-primary"
                        style={{ textDecoration: "none", display: "inline-flex", marginTop: 16 }}
                    >
                        Browse Videos
                    </Link>
                </div>
            )}
        </div>
    );
}
