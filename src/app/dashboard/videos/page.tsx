"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Video, Clock, Star, Eye, Filter, Search, X } from "lucide-react";

export default function VideosPage() {
    return (
        <Suspense fallback={<div className="animate-fade-in"><div className="skeleton" style={{ height: 400, borderRadius: 16 }} /></div>}>
            <VideosContent />
        </Suspense>
    );
}

function VideosContent() {
    const searchParams = useSearchParams();
    const [videos, setVideos] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedSubject, setSelectedSubject] = useState(searchParams.get("subjectId") || "");
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        Promise.all([
            fetch("/api/subjects").then((r) => r.json()),
            fetch("/api/users").then((r) => r.json()),
        ])
            .then(([subData, userData]) => {
                setSubjects(Array.isArray(subData) ? subData : []);
                setUser(userData);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedSubject) params.set("subjectId", selectedSubject);
        const topicId = searchParams.get("topicId");
        if (topicId) params.set("topicId", topicId);

        fetch(`/api/videos?${params}`)
            .then((r) => r.json())
            .then((data) => setVideos(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [selectedSubject, searchParams]);

    const toggleFavorite = async (videoId: string) => {
        await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "toggleFavorite", itemId: videoId }),
        });
        const res = await fetch("/api/users");
        setUser(await res.json());
    };

    const filteredVideos = videos.filter((v) =>
        v.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
                    Video Lectures
                </h2>
                <p style={{ color: "#64748B", fontSize: 15 }}>
                    Watch topic-wise video lectures for your exam preparation
                </p>
            </div>

            {/* Filters */}
            <div
                style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 24,
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                <div style={{ position: "relative", flex: "1 1 250px" }}>
                    <Search className="w-4 h-4" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-styled"
                        style={{ paddingLeft: 40 }}
                        placeholder="Search videos..."
                        id="search-videos"
                    />
                </div>
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="input-styled"
                    style={{ maxWidth: 200 }}
                    id="filter-subject"
                >
                    <option value="">All Subjects</option>
                    {subjects.map((s: any) => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                </select>
            </div>

            {/* Videos Grid */}
            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="skeleton" style={{ height: 220, borderRadius: 16 }} />
                    ))}
                </div>
            ) : filteredVideos.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                    {filteredVideos.map((video: any) => {
                        const isFav = user?.favorites?.includes(video._id);
                        const isWatched = user?.watchedVideos?.includes(video._id);
                        return (
                            <div
                                key={video._id}
                                className="card-hover"
                                style={{
                                    background: "white",
                                    borderRadius: 16,
                                    overflow: "hidden",
                                    border: "1px solid #E2E8F0",
                                    position: "relative",
                                }}
                            >
                                <Link
                                    href={`/dashboard/videos/${video._id}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <div
                                        className="gradient-primary"
                                        style={{
                                            height: 120,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            position: "relative",
                                        }}
                                    >
                                        <Video className="w-12 h-12 text-white" style={{ opacity: 0.6 }} />
                                        {isWatched && (
                                            <span
                                                className="badge-watched"
                                                style={{ position: "absolute", top: 12, left: 12 }}
                                            >
                                                ✓ Watched
                                            </span>
                                        )}
                                        {video.isImportant && (
                                            <span
                                                className="badge-important"
                                                style={{ position: "absolute", top: 12, right: 12 }}
                                            >
                                                ★ Important
                                            </span>
                                        )}
                                    </div>
                                </Link>
                                <div style={{ padding: 16 }}>
                                    <Link href={`/dashboard/videos/${video._id}`} style={{ textDecoration: "none" }}>
                                        <h4 style={{ fontSize: 16, fontWeight: 600, color: "#0F172A", marginBottom: 6, lineHeight: 1.4 }}>
                                            {video.title}
                                        </h4>
                                    </Link>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                                        <span style={{ fontSize: 12, color: "#94A3B8" }}>
                                            {video.subjectId?.name || "General"}
                                        </span>
                                        {video.duration && (
                                            <span style={{ fontSize: 12, color: "#94A3B8", display: "flex", alignItems: "center", gap: 4 }}>
                                                <Clock className="w-3 h-3" /> {video.duration}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => toggleFavorite(video._id)}
                                        className="btn-icon"
                                        style={{ color: isFav ? "#F59E0B" : "#94A3B8" }}
                                        title={isFav ? "Remove from favorites" : "Add to favorites"}
                                    >
                                        <Star className="w-5 h-5" fill={isFav ? "#F59E0B" : "none"} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ background: "white", borderRadius: 16, padding: 60, textAlign: "center", border: "1px solid #E2E8F0" }}>
                    <Video className="w-16 h-16" style={{ color: "#CBD5E1", margin: "0 auto 16px" }} />
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#374151", marginBottom: 8 }}>No Videos Found</h3>
                    <p style={{ color: "#94A3B8" }}>
                        {search ? "Try a different search term." : "Videos will appear once the admin uploads them."}
                    </p>
                </div>
            )}
        </div>
    );
}
