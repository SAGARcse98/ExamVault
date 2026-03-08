"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, Eye, EyeOff, ArrowLeft, Clock, BookOpen, ChevronRight } from "lucide-react";

export default function VideoPlayerPage() {
    const params = useParams();
    const videoId = params.id as string;
    const [video, setVideo] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [videoRes, userRes] = await Promise.all([
                    fetch(`/api/videos/${videoId}`),
                    fetch("/api/users"),
                ]);
                const videoData = await videoRes.json();
                const userData = await userRes.json();
                setVideo(videoData);
                setUser(userData);

                if (videoData.subjectId?._id) {
                    const relRes = await fetch(`/api/videos?subjectId=${videoData.subjectId._id}`);
                    const relData = await relRes.json();
                    setRelatedVideos(
                        Array.isArray(relData)
                            ? relData.filter((v: any) => v._id !== videoId).slice(0, 5)
                            : []
                    );
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [videoId]);

    const getYouTubeEmbedUrl = (url: string) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url?.match(regex);
        return match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : null;
    };

    const toggleAction = async (action: string) => {
        await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, itemId: videoId }),
        });
        const res = await fetch("/api/users");
        setUser(await res.json());
    };

    if (loading) {
        return (
            <div className="animate-fade-in">
                <div className="skeleton" style={{ height: 400, borderRadius: 20, marginBottom: 24 }} />
                <div className="skeleton" style={{ height: 80, borderRadius: 16 }} />
            </div>
        );
    }

    if (!video || video.error) {
        return (
            <div style={{ textAlign: "center", padding: 60 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: "#374151" }}>Video not found</h3>
                <Link href="/dashboard/videos" style={{ color: "#4F46E5", fontWeight: 600, textDecoration: "none" }}>
                    ← Back to Videos
                </Link>
            </div>
        );
    }

    const embedUrl = getYouTubeEmbedUrl(video.videoUrl);
    const isFav = user?.favorites?.includes(videoId);
    const isWatched = user?.watchedVideos?.includes(videoId);

    return (
        <div className="animate-fade-in">
            <Link
                href="/dashboard/videos"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#64748B", textDecoration: "none", fontSize: 14, marginBottom: 16, fontWeight: 500 }}
            >
                <ArrowLeft className="w-4 h-4" /> Back to Videos
            </Link>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
                {/* Main */}
                <div>
                    {/* Player */}
                    <div
                        style={{
                            borderRadius: 20,
                            overflow: "hidden",
                            background: "#0F172A",
                            marginBottom: 20,
                            aspectRatio: "16/9",
                        }}
                    >
                        {embedUrl ? (
                            <iframe
                                src={embedUrl}
                                title={video.title}
                                style={{ width: "100%", height: "100%", border: "none" }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : video.videoUrl?.startsWith("/uploads/") ? (
                            <video
                                src={video.videoUrl}
                                controls
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                controlsList="nodownload"
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94A3B8" }}>
                                <p>Video URL: <a href={video.videoUrl} target="_blank" rel="noreferrer" style={{ color: "#06B6D4" }}>{video.videoUrl}</a></p>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E2E8F0" }}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                            {video.isImportant && <span className="badge-important">★ Important</span>}
                            {isWatched && <span className="badge-watched">✓ Watched</span>}
                            {video.duration && (
                                <span style={{ fontSize: 12, color: "#94A3B8", display: "flex", alignItems: "center", gap: 4 }}>
                                    <Clock className="w-3 h-3" /> {video.duration}
                                </span>
                            )}
                        </div>

                        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>
                            {video.title}
                        </h2>
                        <p style={{ fontSize: 14, color: "#64748B", marginBottom: 16 }}>
                            {video.subjectId?.name} {video.topicId?.name ? `→ ${video.topicId.name}` : ""}
                        </p>

                        {video.description && (
                            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 20 }}>
                                {video.description}
                            </p>
                        )}

                        {/* Actions */}
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <button
                                onClick={() => toggleAction("toggleFavorite")}
                                className={isFav ? "btn-primary" : "btn-secondary"}
                                style={{ fontSize: 13 }}
                            >
                                <Star className="w-4 h-4" fill={isFav ? "white" : "none"} />
                                {isFav ? "Favorited" : "Add to Favorites"}
                            </button>
                            <button
                                onClick={() => toggleAction("toggleWatched")}
                                className={isWatched ? "btn-primary" : "btn-secondary"}
                                style={{ fontSize: 13, background: isWatched ? "linear-gradient(135deg, #10B981, #06B6D4)" : undefined }}
                            >
                                {isWatched ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                {isWatched ? "Watched" : "Mark as Watched"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related */}
                <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
                        Related Videos
                    </h3>
                    {relatedVideos.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {relatedVideos.map((rv: any) => (
                                <Link
                                    key={rv._id}
                                    href={`/dashboard/videos/${rv._id}`}
                                    className="card-hover"
                                    style={{
                                        background: "white",
                                        borderRadius: 12,
                                        padding: 14,
                                        textDecoration: "none",
                                        border: "1px solid #E2E8F0",
                                        display: "flex",
                                        gap: 12,
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        className="gradient-primary"
                                        style={{ width: 48, height: 48, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                                    >
                                        <BookOpen className="w-5 h-5 text-white" style={{ opacity: 0.8 }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h4 style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {rv.title}
                                        </h4>
                                        <p style={{ fontSize: 11, color: "#94A3B8" }}>{rv.topicId?.name || ""}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted" style={{ flexShrink: 0 }} />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p style={{ fontSize: 13, color: "#94A3B8", background: "white", padding: 20, borderRadius: 12, border: "1px solid #E2E8F0", textAlign: "center" }}>
                            No related videos
                        </p>
                    )}
                </div>
            </div>

            {/* Responsive override */}
            <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1fr 320px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
}
